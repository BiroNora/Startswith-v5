import { db } from '$lib/database';
import { Prisma } from '@prisma/client';

function buildWhereClause(filters: any): Prisma.Sql {
  const conditions: Prisma.Sql[] = [Prisma.sql`s.coop = TRUE`, Prisma.sql`s.active = TRUE`];

  // Csak akkor adjuk hozzá, ha NEM null, NEM undefined és NEM NaN
  if (filters.selectedYear !== null && !isNaN(Number(filters.selectedYear)))
    conditions.push(Prisma.sql`e.event_year = ${Number(filters.selectedYear)}`);

  if (filters.selectedSemester !== null && !isNaN(Number(filters.selectedSemester)))
    conditions.push(Prisma.sql`e.semester = ${Number(filters.selectedSemester)}`);

  if (filters.selectedDuty !== null && !isNaN(Number(filters.selectedDuty)))
    conditions.push(Prisma.sql`e.duty_level = ${Number(filters.selectedDuty)}`);

  if (filters.selectedCountry !== null && !isNaN(Number(filters.selectedCountry)))
    conditions.push(Prisma.sql`i.country_id = ${Number(filters.selectedCountry)}`);

  if (filters.selectedRegion !== null && !isNaN(Number(filters.selectedRegion)))
    conditions.push(Prisma.sql`i.region_id = ${Number(filters.selectedRegion)}`);

  return Prisma.join(conditions, ' AND ');
}

export async function POST({ request }) {
  try {
    const formData = await request.json();
    const whereClause = buildWhereClause(formData);

    const [
      statusCountry, statusGrade, admittedGrade, subjectIntrest, subjectAdmitted,
      regionIntrest, regionAdmitted, channelIntrest, channelAdmitted
    ] = await Promise.all([
      // 1. Status Country (Minden grade és intert)
      db.$queryRaw<any[]>`
        SELECT c.country_name,
          CAST(SUM(CASE WHEN i.status = 0 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_count_status_0,
          CAST(SUM(CASE WHEN i.status = 1 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_count_status_1,
          CAST(SUM(CASE WHEN i.status = 2 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_count_status_2,
          CAST(SUM(CASE WHEN i.status = 3 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_count_status_3,
          CAST(SUM(i.intrest_count) AS INTEGER) AS total_intrest_count,
          CAST(SUM(CASE WHEN i.grade = 1 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_grade_status_1,
          CAST(SUM(CASE WHEN i.grade = 2 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_grade_status_2,
          CAST(SUM(CASE WHEN i.grade = 3 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_grade_status_3,
          CAST(SUM(CASE WHEN i.grade = 4 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_grade_status_4,
          CAST(SUM(CASE WHEN i.grade = 5 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_grade_status_5,
          CAST(SUM(CASE WHEN i.status != 0 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intert
        FROM interested i
        JOIN Country c ON i.country_id = c.country_id
        JOIN events e ON e.event_id = i.event_id
        JOIN schools s ON e.school_id = s.school_id
        WHERE ${whereClause} GROUP BY c.country_name
      `,

      // 2. Status Grade (Összesített)
      db.$queryRaw<any[]>`
        SELECT
          CAST(SUM(CASE WHEN i.grade = 1 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_grade_status_1,
          CAST(SUM(CASE WHEN i.grade = 2 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_grade_status_2,
          CAST(SUM(CASE WHEN i.grade = 3 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_grade_status_3,
          CAST(SUM(CASE WHEN i.grade = 4 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_grade_status_4,
          CAST(SUM(CASE WHEN i.grade = 5 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_grade_status_5
        FROM interested i JOIN events e ON e.event_id = i.event_id JOIN schools s ON e.school_id = s.school_id
        WHERE ${whereClause}
      `,

      // 3. Admitted Grade (Összesített)
      db.$queryRaw<any[]>`
        SELECT
          CAST(SUM(CASE WHEN i.grade = 1 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_grade_status_1,
          CAST(SUM(CASE WHEN i.grade = 2 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_grade_status_2,
          CAST(SUM(CASE WHEN i.grade = 3 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_grade_status_3,
          CAST(SUM(CASE WHEN i.grade = 4 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_grade_status_4,
          CAST(SUM(CASE WHEN i.grade = 5 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_grade_status_5
        FROM interested i JOIN events e ON e.event_id = i.event_id JOIN schools s ON e.school_id = s.school_id
        WHERE ${whereClause} AND i.status = 1
      `,

      // 4. Subject Interest
      db.$queryRaw<any[]>`
        SELECT
          CAST(SUM(CASE WHEN i.subject = 1 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_1,
          CAST(SUM(CASE WHEN i.subject = 2 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_2,
          CAST(SUM(CASE WHEN i.subject = 3 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_3,
          CAST(SUM(CASE WHEN i.subject = 4 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_4,
          CAST(SUM(CASE WHEN i.subject = 5 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_5,
          CAST(SUM(CASE WHEN i.subject = 6 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_6,
          CAST(SUM(CASE WHEN i.subject = 7 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_7,
          CAST(SUM(CASE WHEN i.subject = 8 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_8,
          CAST(SUM(CASE WHEN i.subject = 9 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_9,
          CAST(SUM(CASE WHEN i.subject = 10 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_10,
          CAST(SUM(CASE WHEN i.subject = 11 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_11,
          CAST(SUM(CASE WHEN i.subject = 12 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_12,
          CAST(SUM(CASE WHEN i.subject = 13 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_13,
          CAST(SUM(CASE WHEN i.subject = 14 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_14
        FROM interested i JOIN events e ON e.event_id = i.event_id JOIN schools s ON e.school_id = s.school_id
        WHERE ${whereClause}
      `,

      // 5. Subject Admitted - KIFEJTVE
      db.$queryRaw<any[]>`
        SELECT
          CAST(SUM(CASE WHEN i.subject = 1 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_1,
          CAST(SUM(CASE WHEN i.subject = 2 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_2,
          CAST(SUM(CASE WHEN i.subject = 3 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_3,
          CAST(SUM(CASE WHEN i.subject = 4 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_4,
          CAST(SUM(CASE WHEN i.subject = 5 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_5,
          CAST(SUM(CASE WHEN i.subject = 6 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_6,
          CAST(SUM(CASE WHEN i.subject = 7 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_7,
          CAST(SUM(CASE WHEN i.subject = 8 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_8,
          CAST(SUM(CASE WHEN i.subject = 9 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_9,
          CAST(SUM(CASE WHEN i.subject = 10 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_10,
          CAST(SUM(CASE WHEN i.subject = 11 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_11,
          CAST(SUM(CASE WHEN i.subject = 12 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_12,
          CAST(SUM(CASE WHEN i.subject = 13 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_13,
          CAST(SUM(CASE WHEN i.subject = 14 THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_14
        FROM interested i JOIN events e ON e.event_id = i.event_id JOIN schools s ON e.school_id = s.school_id
        WHERE ${whereClause} AND i.status = 1
      `,

      // 6-9. Régiók és Csatornák (Változatlanul)
      db.$queryRaw<any[]>`SELECT r.region_name, CAST(SUM(i.intrest_count) AS INTEGER) AS intrest_count FROM interested i JOIN region r ON i.region_id = r.region_id JOIN events e ON e.event_id = i.event_id JOIN schools s ON e.school_id = s.school_id WHERE ${whereClause} GROUP BY r.region_name`,
      db.$queryRaw<any[]>`SELECT r.region_name, CAST(SUM(i.intrest_count) AS INTEGER) AS intrest_count FROM interested i JOIN region r ON i.region_id = r.region_id JOIN events e ON e.event_id = i.event_id JOIN schools s ON e.school_id = s.school_id WHERE ${whereClause} AND i.status = 1 GROUP BY r.region_name`,
      db.$queryRaw<any[]>`SELECT i.channel, CAST(SUM(i.intrest_count) AS INTEGER) AS intrest_count FROM interested i JOIN events e ON e.event_id = i.event_id JOIN schools s ON e.school_id = s.school_id WHERE ${whereClause} GROUP BY i.channel ORDER BY CAST(i.channel AS INTEGER) ASC`,
      db.$queryRaw<any[]>`SELECT i.channel, CAST(SUM(i.intrest_count) AS INTEGER) AS intrest_count FROM interested i JOIN events e ON e.event_id = i.event_id JOIN schools s ON e.school_id = s.school_id WHERE ${whereClause} AND i.status = 1 GROUP BY i.channel ORDER BY CAST(i.channel AS INTEGER) ASC`
    ]);

    return new Response(JSON.stringify({
      statusCountry, statusGrade: statusGrade[0], admittedGrade: admittedGrade[0],
      subjectIntrest: subjectIntrest[0], subjectAdmitted: subjectAdmitted[0],
      regionIntrest, regionAdmitted, channelIntrest, channelAdmitted
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error("Hiba:", error);
    return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
  }
}
