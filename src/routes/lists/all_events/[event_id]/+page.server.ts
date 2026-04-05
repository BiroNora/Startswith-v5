import { error, redirect } from '@sveltejs/kit'
import { db } from '$lib/database'
import { getName, CHANNEL_MAP, GRADE_MAP, STATUS_MAP, DUTY_MAP, EVENT_MAP } from './../../../stores/dataStore'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login')
	}

	const ev_id = Number(params.event_id)

	const event = await db.event.findUnique({
		where: { event_id: ev_id },
		include: {
			User: true,
			School: {
				include: {
					city: true
				}
			},
			InterestedStudents: {
				orderBy: { intrest_id: 'desc' }
			}
		}
	})

	if (!event) {
		throw error(404, 'Event not found')
	}

	const formattedEvent = {
		...event,
		on_duty_name: getName(DUTY_MAP, event.duty_level),
		event_type_name: getName(EVENT_MAP, event.event_type)
	};

	const formattedInters = event.InterestedStudents.map(ints => ({
		...ints,
		grade: getName(GRADE_MAP, ints.grade),
		channel: getName(CHANNEL_MAP, ints.channel),
		status: getName(STATUS_MAP, ints.status)
	}));

	return {
		event: formattedEvent,
		school: event.School,
		cityname: event.School?.city?.city_name || 'Ismeretlen város',
		inters: formattedInters
	}
}
