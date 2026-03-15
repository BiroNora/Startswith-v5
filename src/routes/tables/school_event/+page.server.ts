import { db } from '$lib/database'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { getFilterBaseData } from '$lib/server/filterUtils';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user?.active) {
        throw redirect(302, '/auth/login')
    }

    const filterData = await getFilterBaseData();

    // 2. Aggregált adatok lekérése (nem töltjük be az összes rekordot a memóriába)
    // Csak azokat az iskolákat nézzük, amik aktívak és van userük
    const schoolFilter = {
        coop: true,
        active: true,
        User: { some: { NOT: { user_id: undefined } } }
    };

    const schoolsCount = await db.school.count({
        where: schoolFilter
    });

    const stats = await db.event.aggregate({
        where: { School: schoolFilter },
        _count: { event_id: true },
        _sum: { estimated_student: true }
    });

    // 3. Érdeklődők összesítése státusz szerint GroupBy-al
    // Ez egyetlen SQL lekéréssel visszaadja az összes státusz összegét
    const interestStats = await db.interestedStudents.groupBy({
        by: ['status'],
        where: { Event: { School: schoolFilter } },
        _sum: { intrest_count: true }
    });

    // Segédfüggvény a státuszok kinyeréséhez a groupBy eredményéből
    const getStatusCount = (status: string) =>
        interestStats.find(s => s.status === status)?._sum.intrest_count || 0;

    return {
        ...filterData,
        schoolsCount,
        totalEvents: stats._count.event_id,
        totalEstStudents: stats._sum.estimated_student || 0,
        totalIntrest0: getStatusCount('0'),
        totalIntrest1: getStatusCount('1'),
        totalIntrest2: getStatusCount('2'),
        totalIntrest3: getStatusCount('3')
    };
};
