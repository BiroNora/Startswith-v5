import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/database.js';
import {
  eventMap,
  dutyMap,
  schType,
  duType,
} from '../../../stores/dataStore.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals }) => {
  // 1. Jogosultság ellenőrzése
  if (!locals.user || locals.user.active === false) {
    throw redirect(302, '/auth/login');
  }

  // 2. ID kinyerése és ellenőrzése
  const schoolId = Number(params.school_id);
  if (isNaN(schoolId)) {
    throw error(400, 'Érvénytelen iskola azonosító');
  }

  // 3. Adatok lekérése párhuzamosan (gyorsabb)
  const [school, contacts, events] = await Promise.all([
    db.school.findUnique({
      where: { school_id: schoolId },
      include: {
        city: true,
        region: true,
        county: true,
        country: true
      }
    }),
    db.contact.findMany({
      where: { school_id: schoolId },
      orderBy: { contact_id: 'desc' }
    }),
    db.event.findMany({
      where: { school_id: schoolId },
      orderBy: { closing_date: 'desc' }
    })
  ]);

  // 4. Ha nincs ilyen iskola, 404
  if (!school) {
    throw error(404, 'School not found');
  }

  // 5. Adatok formázása/mappelése (amit korábban a page-ben csináltál)
  const resS = schType
    .filter((_, i) => school.school_type.includes(String(i + 1)))
    .join(', ');

  const resD = duType
    .filter((_, i) => school.duty.includes(String(i + 1)))
    .join(', ');

  const mappedEvents = events.map(obj => ({
    ...obj,
    on_duty: dutyMap.find(d => d.id === obj.on_duty)?.name || obj.on_duty,
    event_type: eventMap.find(e => e.id === obj.event_type)?.name || obj.event_type
  }));

  // 6. Minden adat visszaküldése, amit a gyerek oldalak látni fognak
  return {
    school,
    resS,
    resD,
    contact: contacts,
    event: mappedEvents,
    city: school.city,
    region: school.region,
    county: school.county,
    country: school.country
  };
};
