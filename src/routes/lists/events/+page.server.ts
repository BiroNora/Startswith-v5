import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db } from '$lib/database'
import { DUTY_MAP } from '../../stores/dataStore'

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user?.active) {
    throw redirect(302, '/auth/login');
  }

  // 1. Minden adatot egyetlen lekéréssel hozunk el
  const userWithEvents = await db.user.findUnique({
    where: { user_id: locals.user.user_id },
    include: {
      Event: {
        orderBy: { closing_date: 'desc' },
        include: {
          School: {
            select: { school_name: true }
          }
        }
      }
    }
  });

  if (!userWithEvents) throw error(404, 'User not found');

  // 2. Formázzuk az adatokat (Duty nevek hozzáadása)
  const events = userWithEvents.Event.map(ev => ({
    ...ev,
    school_name: ev.School?.school_name || 'Unknown School',
    duty_name: DUTY_MAP.find(d => d.id === ev.duty_level)?.name || ev.duty_level
  }));

  // 3. In progress ID-k lekérése (ez maradhat külön, vagy beépíthető)
  const inProgressData = await db.event.findMany({
    where: {
      User: { some: { user_id: locals.user.user_id } },
      InterestedStudents: { some: { status: 3 } }
    },
    select: { event_id: true }
  });

  return {
    events, // Ez az összes event
    eventIdsInProgress: inProgressData.map(e => e.event_id)
  };
};
