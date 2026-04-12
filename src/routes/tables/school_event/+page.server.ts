import { db } from '$lib/database';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user?.active) {
		throw redirect(302, '/auth/login');
	}

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

	const interestStats = await db.interestedStudents.groupBy({
		by: ['status'],
		where: { Event: { School: schoolFilter } },
		_sum: { intrest_count: true }
	});

	const appliedSum = await db.interestedStudents.aggregate({
		where: {
			Event: { School: schoolFilter },
			applied: true
		},
		_sum: { intrest_count: true }
	});

	const statusMap: Record<string, number> = {};
	interestStats.forEach((s) => {
		statusMap[`totalIntrest${s.status}`] = s._sum.intrest_count || 0;
	});

	return {
		schoolsCount,
		totalEvents: stats._count.event_id,
		totalEstStudents: stats._sum.estimated_student || 0,
    totalApplied: appliedSum._sum.intrest_count || 0,
		...statusMap
	};
};
