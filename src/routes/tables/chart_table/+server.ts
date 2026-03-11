import { db } from '$lib/database'
import { json, redirect } from '@sveltejs/kit'

export async function POST({ request, locals }) {
  // 1. Jogosultság ellenőrzése
  if (!locals.user || locals.user.active === false) {
    throw redirect(302, '/auth/login')
  }

  const {
    selectedYear,
    selectedSemester,
    selectedDuty,
    selectedCountry,
    selectedRegion
  } = await request.json();

  // 2. DINAMIKUS SZŰRŐ ÉPÍTÉSE
  // Alapfeltételek, amik mindig kellenek
  let filters = ["s.coop = TRUE", "s.active = TRUE"];

  if (selectedYear && selectedYear !== 'ALL') {
    filters.push(`e.event_year = ${Number(selectedYear)}`);
  }
  if (selectedSemester && selectedSemester !== 'ALL') {
    filters.push(`e.semester = '${selectedSemester}'`);
  }
  // Itt a keresett Duty szűrő az e.on_duty oszlopon
  if (selectedDuty && selectedDuty !== 'ALL') {
    filters.push(`e.on_duty = '${selectedDuty}'`);
  }
  if (selectedCountry && selectedCountry !== 'ALL') {
    filters.push(`i.country_id = ${Number(selectedCountry)}`);
  }
  if (selectedRegion && selectedRegion !== 'ALL') {
    filters.push(`i.region_id = ${Number(selectedRegion)}`);
  }

  const whereClause = `WHERE ${filters.join(" AND ")}`;

  // 3. KÖZÖS SQL STRUKTÚRA (CTE és alap JOIN-ok)
  const commonCTE = `
        WITH UserAggregates AS (
            SELECT stu."A" AS school_id
            FROM "_SchoolToUser" stu
            JOIN users u ON stu."B" = u.user_id
            GROUP BY stu."A"
        )
    `;

  const commonJoins = `
        FROM interested i
        JOIN events e ON e.event_id = i.event_id
        JOIN schools s ON e.school_id = s.school_id
        JOIN UserAggregates ua ON s.school_id = ua.school_id
    `;

  try {
    // 4. LEKÉRDEZÉSEK PÁRHUZAMOS FUTTATÁSA
    const [
      statusCountry,
      statusGrade,
      admittedGrade,
      subjectIntrest,
      subjectAdmitted,
      regionIntrest,
      regionAdmitted,
      channelIntrest,
      channelAdmitted
    ] = await Promise.all([
      // 1. Ország szerinti bontás
      db.$queryRawUnsafe(`
                ${commonCTE} SELECT c.country_name,
                CAST(SUM(CASE WHEN i.status = '0' THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_count_status_0,
                CAST(SUM(CASE WHEN i.status = '1' THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_count_status_1,
                CAST(SUM(CASE WHEN i.status = '2' THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_count_status_2,
                CAST(SUM(CASE WHEN i.status = '3' THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_count_status_3,
                CAST(SUM(i.intrest_count) AS INTEGER) AS total_intrest_count,
                CAST(SUM(CASE WHEN i.status != '0' THEN i.intrest_count ELSE 0 end) AS INTEGER) AS intert
                ${commonJoins} JOIN Country c ON i.country_id = c.country_id
                ${whereClause} GROUP BY c.country_name
            `),

      // 2. Évfolyam (Grade) - Mind
      db.$queryRawUnsafe(`${commonCTE} SELECT ${getGradeSums()} ${commonJoins} ${whereClause}`),

      // 3. Évfolyam (Grade) - Csak felvettek
      db.$queryRawUnsafe(`${commonCTE} SELECT ${getGradeSums()} ${commonJoins} ${whereClause} AND i.status = '1'`),

      // 4. Munkakör (Subject) - Érdeklődés
      db.$queryRawUnsafe(`${commonCTE} SELECT ${getWorkTitleSums()} ${commonJoins} ${whereClause}`),

      // 5. Munkakör (Subject) - Felvettek
      db.$queryRawUnsafe(`${commonCTE} SELECT ${getWorkTitleSums()} ${commonJoins} ${whereClause} AND i.status = '1'`),

      // 6. Régió - Érdeklődés
      db.$queryRawUnsafe(`
    ${commonCTE}
    SELECT r.region_name, CAST(SUM(i.intrest_count) AS INTEGER) AS intrest_count
    ${commonJoins}
    JOIN region r ON i.region_id = r.region_id
    ${whereClause}
    GROUP BY r.region_name
`),

      // 7. Régió - Felvettek
      db.$queryRawUnsafe(`
    ${commonCTE}
    SELECT r.region_name, CAST(SUM(i.intrest_count) AS INTEGER) AS intrest_count
    ${commonJoins}
    JOIN region r ON i.region_id = r.region_id
    ${whereClause} AND i.status = '1'
    GROUP BY r.region_name
`),
      // 8. Csatorna - Érdeklődés
      db.$queryRawUnsafe(`${commonCTE} SELECT i.channel, CAST(SUM(i.intrest_count) AS INTEGER) AS intrest_count ${commonJoins} ${whereClause} GROUP BY i.channel ORDER BY CAST(i.channel AS INTEGER) ASC`),

      // 9. Csatorna - Felvettek
      db.$queryRawUnsafe(`${commonCTE} SELECT i.channel, CAST(SUM(i.intrest_count) AS INTEGER) AS intrest_count ${commonJoins} ${whereClause} AND i.status = '1' GROUP BY i.channel ORDER BY CAST(i.channel AS INTEGER) ASC`)
    ]);

    return json({
      statusCountry,
      statusGrade: (statusGrade as any[])[0],
      admittedGrade: (admittedGrade as any[])[0],
      subjectIntrest: (subjectIntrest as any[])[0],
      subjectAdmitted: (subjectAdmitted as any[])[0],
      regionIntrest,
      regionAdmitted,
      channelIntrest,
      channelAdmitted
    });

  } catch (error) {
    console.error('Kritikus hiba a lekérdezés során:', error);
    return json({ error: 'Adatbázis hiba történt' }, { status: 500 });
  }
}

// SEGÉDFÜGGVÉNYEK a kód olvashatóságáért
function getGradeSums() {
  return [1, 2, 3, 4, 5].map(g =>
    `CAST(SUM(CASE WHEN i.grade = '${g}' THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_grade_status_${g}`
  ).join(', ');
}

function getWorkTitleSums() {
  return Array.from({ length: 14 }, (_, i) => i + 1).map(w =>
    `CAST(SUM(CASE WHEN i.work_title = '${w}' THEN i.intrest_count ELSE 0 END) AS INTEGER) AS intrest_work_title_${w}`
  ).join(', ');
}
