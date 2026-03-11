import { db } from '$lib/database'
import { json, redirect } from '@sveltejs/kit'

export async function POST({ request, locals }) {
	if (!locals.user || locals.user.active === false) {
		throw redirect(302, '/auth/login')
	}

	const { selectedYear, selectedSemester, selectedDuty } = await request.json();

	// 1. Alapfeltételek (amik mindig kellenek)
	let whereConditions = ["s.coop = TRUE", "s.active = TRUE"];
	let queryParams: any[] = [];

	// 2. Dinamikus szűrők hozzáadása
	// Csak akkor adjuk hozzá, ha nem 'ALL' és nem null/undefined
	if (selectedYear && selectedYear !== 'ALL') {
		queryParams.push(Number(selectedYear));
		whereConditions.push(`e.event_year = $${queryParams.length}`);
	}

	if (selectedSemester && selectedSemester !== 'ALL') {
		queryParams.push(selectedSemester);
		whereConditions.push(`e.semester = $${queryParams.length}`);
	}

	if (selectedDuty && selectedDuty !== 'ALL') {
		queryParams.push(selectedDuty);
		whereConditions.push(`e.on_duty = $${queryParams.length}`);
	}
	
	// Összefűzzük a feltételeket egyetlen stringgé, AND-del elválasztva
	const finalWhereClause = whereConditions.join(" AND ");

	console.log("SQL feltételek:", finalWhereClause);
	console.log("Paraméterek:", queryParams);

	try {
		const regionIntAdm = await db.$queryRawUnsafe(`
      WITH UserAggregates AS (
        SELECT stu."A" AS school_id, STRING_AGG(u.user_name, ', ') AS user_names
        FROM "_SchoolToUser" stu
        JOIN users u ON stu."B" = u.user_id
        GROUP BY stu."A"
      )
      SELECT
        r.region_name,
        CAST(SUM(i.intrest_count) AS INTEGER) AS intrest_count,
        CAST(SUM(CASE WHEN i.status = '1' THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_count_status_1
      FROM interested i
      JOIN region r USING (region_id)
      JOIN events e USING (event_id)
      JOIN schools s ON e.school_id = s.school_id
      JOIN UserAggregates ua ON s.school_id = ua.school_id
      WHERE ${finalWhereClause}
      GROUP BY r.region_name;
    `, ...queryParams);

		return json({ regionIntAdm });

	} catch (error) {
		console.error('SQL Error:', error);
		return json({ error: 'Database query failed' }, { status: 500 });
	}
}
