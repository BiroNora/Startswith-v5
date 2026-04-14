import { db } from '$lib/server/database';
import { Prisma } from '@prisma/client';
import { json } from '@sveltejs/kit';

function buildWhereClause(conditions: Prisma.Sql[]): Prisma.Sql {
	if (conditions.length === 0) {
		return Prisma.sql`TRUE`;
	}
	if (conditions.length === 1) {
		return conditions[0];
	}
	return Prisma.join(conditions, ' AND ');
}

export async function POST({ request }) {
	try {
		const filters = await request.json();
		const {
			isActive,
			isCoop,
			selectedYear,
			selectedSemester,
			selectedDuty,
			selectedCountry,
			selectedRegion
		} = filters;

		// 1. ISKOLA SZŰRŐK (Mindig érvényesek az alap listázásra)
		let schoolConditions: Prisma.Sql[] = [];

		if (isActive === true) {
			schoolConditions.push(Prisma.sql`s.active = TRUE`);
		}

		if (isCoop === true) {
			schoolConditions.push(Prisma.sql`s.coop = TRUE`);
		}

		// 2. ESEMÉNY SZŰRŐK (Csak a statisztikák számolásához)
		let eventConditions: Prisma.Sql[] = [];

		// Iskola szintű szűrők hozzáadása
		if (selectedCountry && selectedCountry !== 'ALL') {
			schoolConditions.push(Prisma.sql`s.country_id = ${Number(selectedCountry)}`);
		}
		if (selectedRegion && selectedRegion !== 'ALL') {
			schoolConditions.push(Prisma.sql`s.region_id = ${Number(selectedRegion)}`);
		}
		if (selectedDuty && selectedDuty !== 'ALL') {
			// Ellenőrizzük, hogy a kért szint benne van-e az iskola duty_levels tömbjében
			schoolConditions.push(Prisma.sql`${Number(selectedDuty)} = ANY(s.duty_levels)`);
		}

		// Esemény szintű szűrők hozzáadása (évekre, szemeszterre)
		if (selectedYear && selectedYear !== 'ALL') {
			eventConditions.push(Prisma.sql`e.event_year = ${Number(selectedYear)}`);
		}
		if (selectedSemester && selectedSemester !== 'ALL') {
			eventConditions.push(Prisma.sql`e.semester = ${selectedSemester}`);
		}

		const schoolWhere = buildWhereClause(schoolConditions);
		const eventWhere = buildWhereClause(eventConditions);

		const isYearFiltered = selectedYear !== 'ALL' && !!selectedYear;

		// 3. A KOMPLEX LEKÉRDEZÉS
		const schoolsData = await db.$queryRaw<any[]>`
      WITH FilteredEvents AS (
        SELECT e.event_id, e.school_id, e.estimated_student
        FROM events e
        WHERE ${eventWhere}
      ),
      -- 1. ESEMÉNY SZINTŰ ÖSSZESÍTÉS (hogy ne legyen duplikáció az interested-ből)
      EventInterests AS (
        SELECT
          i.event_id,
          -- Akinek FALSE a jelentkezése, az CSAK az "Interested" (s0) oszlopba kerülhet
          CAST(SUM(CASE WHEN i.applied = FALSE THEN i.intrest_count ELSE 0 END) AS INTEGER) AS s0,

          -- A többi státusz oszlopnál SZIGORÚAN kikötjük az applied = TRUE feltételt
          CAST(SUM(CASE WHEN i.applied = TRUE AND i.status = 1 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS s1,
          CAST(SUM(CASE WHEN i.applied = TRUE AND i.status = 2 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS s2,
          CAST(SUM(CASE WHEN i.applied = TRUE AND i.status = 3 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS s3,

          -- A Total Applied pedig csak a tiszta TRUE értékeket mutatja
          CAST(SUM(CASE WHEN i.applied = TRUE THEN i.intrest_count ELSE 0 END) AS INTEGER) AS appl
        FROM interested i
        WHERE i.event_id IN (SELECT event_id FROM FilteredEvents)
        GROUP BY i.event_id
      ),
      -- 2. ISKOLA SZINTŰ STATISZTIKÁK (Események + Érdeklődők összevonva)
      SchoolStats AS (
        SELECT
          fe.school_id,
          CAST(COUNT(fe.event_id) AS INTEGER) AS event_count,
          CAST(SUM(COALESCE(fe.estimated_student, 0)) AS INTEGER) AS sum_estimated_student,
          CAST(SUM(COALESCE(ei.s0, 0)) AS INTEGER) AS total_s0,
          CAST(SUM(COALESCE(ei.s1, 0)) AS INTEGER) AS total_s1,
          CAST(SUM(COALESCE(ei.s2, 0)) AS INTEGER) AS total_s2,
          CAST(SUM(COALESCE(ei.s3, 0)) AS INTEGER) AS total_s3,
          CAST(SUM(COALESCE(ei.appl, 0)) AS INTEGER) AS total_appl
        FROM FilteredEvents fe
        LEFT JOIN EventInterests ei ON fe.event_id = ei.event_id
        GROUP BY fe.school_id
      ),
      UserAggregates AS (
        SELECT stu."A" AS school_id, STRING_AGG(u.user_name, ', ') AS user_names
        FROM "_SchoolToUser" stu
        JOIN users u ON stu."B" = u.user_id
        GROUP BY stu."A"
      )
      SELECT
        s.school_id,
        s.school_name,
        s.zip_code,
        s.address,
        s.school_type,
        s.duty_levels,
        country.country_name,
        country.country_code,
        r.region_name,
        city.city_name,
        ua.user_names,
        COALESCE(ss.event_count, 0) AS event_count,
        COALESCE(ss.sum_estimated_student, 0) AS sum_estimated_student,
        COALESCE(ss.total_s0, 0) AS total_intrest_count_status_0,
        COALESCE(ss.total_s1, 0) AS total_intrest_count_status_1,
        COALESCE(ss.total_s2, 0) AS total_intrest_count_status_2,
        COALESCE(ss.total_s3, 0) AS total_intrest_count_status_3,
        COALESCE(ss.total_appl, 0) AS total_applied
      FROM schools s
      JOIN country ON s.country_id = country.country_id
      JOIN region r ON s.region_id = r.region_id
      JOIN county ON s.county_id = county.county_id
      JOIN city ON s.city_id = city.city_id
      LEFT JOIN UserAggregates ua ON s.school_id = ua.school_id
      LEFT JOIN SchoolStats ss ON s.school_id = ss.school_id
      WHERE ${schoolWhere}
        AND (
          ${!isYearFiltered}
          OR (COALESCE(ss.event_count, 0) > 0)
        )
      ORDER BY s.school_name
    `;

		return json({ schoolsData });
	} catch (error) {
		console.error('SQL Error:', error);
		return json({ error: 'Database error' }, { status: 500 });
	}
}
