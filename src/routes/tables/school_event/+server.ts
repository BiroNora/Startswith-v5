import { db } from '$lib/database';
import { Prisma } from '@prisma/client';
import { json } from '@sveltejs/kit';

function buildConditions(filters: any) {
  const { selectedYear, selectedSemester, selectedDuty, selectedCountry, selectedRegion } = filters;

  let eventConds: Prisma.Sql[] = [Prisma.sql`1=1` ];
  let schoolConds: Prisma.Sql[] = [
    Prisma.sql`s.active = true`,
    Prisma.sql`EXISTS (SELECT 1 FROM "_SchoolToUser" stu WHERE stu."A" = s.school_id)`
  ];

  if (selectedYear !== null)
    eventConds.push(Prisma.sql`e.event_year = ${Number(selectedYear)}`);

  if (selectedSemester !== null)
    eventConds.push(Prisma.sql`e.semester = ${selectedSemester}`);

  if (selectedDuty !== null)
    eventConds.push(Prisma.sql`e.on_duty = ${selectedDuty}`);

  if (selectedCountry !== null)
    schoolConds.push(Prisma.sql`s.country_id = ${Number(selectedCountry)}`);

  if (selectedRegion !== null)
    schoolConds.push(Prisma.sql`s.region_id = ${Number(selectedRegion)}`);

  return {
    eventWhere: Prisma.join(eventConds, ' AND '),
    schoolWhere: Prisma.join(schoolConds, ' AND ')
  };
}

export async function POST({ request }) {
  try {
    const formData = await request.json();
    const { eventWhere, schoolWhere } = buildConditions(formData);

    const schoolsData = await db.$queryRaw<any[]>`
      WITH FilteredEvents AS (
        SELECT e.* FROM events e
        JOIN schools s ON e.school_id = s.school_id
        WHERE ${eventWhere} AND ${schoolWhere}
      ),
      EventCounts AS (
        SELECT school_id, CAST(COUNT(*) AS INTEGER) AS event_count
        FROM FilteredEvents
        GROUP BY school_id
      ),
      UserAggregates AS (
        SELECT stu."A" AS school_id, STRING_AGG(u.user_name, ', ') AS user_names
        FROM "_SchoolToUser" stu
        JOIN users u ON stu."B" = u.user_id
        GROUP BY stu."A"
      ),
      IntrestCountStatus AS (
        SELECT
          fe.school_id,
          CAST(SUM(CASE WHEN i.status = '0' THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_count_status_0,
          CAST(SUM(CASE WHEN i.status = '1' THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_count_status_1,
          CAST(SUM(CASE WHEN i.status = '2' THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_count_status_2,
          CAST(SUM(CASE WHEN i.status = '3' THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_count_status_3
        FROM FilteredEvents fe
        LEFT JOIN interested i ON fe.event_id = i.event_id
        GROUP BY fe.school_id
      ),
      EstimatedStudent AS (
        SELECT school_id, CAST(SUM(estimated_student) AS INTEGER) AS sum_estimated_student
        FROM FilteredEvents
        GROUP BY school_id
      )
      SELECT
        ua.user_names,
        country.country_name,
        r.region_name,
        county.county_name,
        city.city_name,
        s.school_id,
        s.school_name,
        s.zip_code,
        s.address,
        s.school_type,
        s.basic, s.medior, s.high,
        COALESCE(ec.event_count, 0) AS event_count,
        COALESCE(es.sum_estimated_student, 0) AS sum_estimated_student,
        COALESCE(ic.intrest_count_status_0, 0) AS total_intrest_count_status_0,
        COALESCE(ic.intrest_count_status_1, 0) AS total_intrest_count_status_1,
        COALESCE(ic.intrest_count_status_2, 0) AS total_intrest_count_status_2,
        COALESCE(ic.intrest_count_status_3, 0) AS total_intrest_count_status_3
      FROM schools s
      JOIN country ON s.country_id = country.country_id
      JOIN region r ON s.region_id = r.region_id
      JOIN county ON s.county_id = county.county_id
      JOIN city ON s.city_id = city.city_id
      LEFT JOIN UserAggregates ua ON s.school_id = ua.school_id
      LEFT JOIN EventCounts ec ON s.school_id = ec.school_id
      LEFT JOIN IntrestCountStatus ic ON s.school_id = ic.school_id
      LEFT JOIN EstimatedStudent es ON s.school_id = es.school_id
      WHERE ${schoolWhere}
        AND (ec.event_count > 0 OR ${formData.selectedYear === null ? Prisma.sql`TRUE` : Prisma.sql`FALSE`})
      ORDER BY s.school_name
    `;

    return json({ schoolsData });
  } catch (error) {
    console.error('SQL Error:', error);
    return json({ error: 'Database error' }, { status: 500 });
  }
}
