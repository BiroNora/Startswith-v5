import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db } from '$lib/database'
import { dutyMap } from '../../stores/dataStore'

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || locals.user.active === false) {
		throw redirect(302, '/auth/login')
	}

	const my_email = locals.user.email!;

	const user = await db.user.findUnique({
		where: { user_email: my_email },
		include: {
			Event: {
				orderBy: { closing_date: 'desc' }
			}
		}
	})

	if (!user || !user.Event) {
		throw error(404, 'Events not found')
	}

	const events = await Promise.all(user.Event.map(async (ev) => {
		// Iskola név lekérése
		const school = await db.school.findUnique({
			where: { school_id: ev.school_id, active: true },
			select: { school_name: true }
		});

		// Tisztség név kikeresése a dutyMap-ből
		const dutyLabel = dutyMap.find(d => d.id === ev.on_duty)?.name || ev.on_duty;

		return {
			...ev,
			school_name: school?.school_name || 'Unknown School',
			duty_name: dutyLabel
		};
	}));

	// Kigyűjtjük azoknak az eseményeknek az ID-it, amik "folyamatban" vannak (status: '3')
	// Kigyűjtjük azoknak az eseményeknek az ID-it, amik "folyamatban" vannak
  const inProgressData = await db.event.findMany({
    where: {
      // Itt a javítás: a User kapcsolaton belül szűrünk a user_email-re
      User: {
        some: {
          user_email: my_email
        }
      },
      InterestedStudents: {
        some: {
          status: '3'
        }
      }
    },
    select: {
      event_id: true
    }
  });

  const eventIdsInProgress = inProgressData.map(e => e.event_id);

	return {
		events,
		eventIdsInProgress
	}
}
