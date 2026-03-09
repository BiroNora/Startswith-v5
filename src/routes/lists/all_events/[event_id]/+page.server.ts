import { error, redirect } from '@sveltejs/kit'
import { db } from '$lib/database'
import { getName, channelMap, gradeMap, statusMap, dutyMap, eventMap } from './../../../stores/dataStore'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user || locals.user.active === false) {
		throw redirect(302, '/auth/login')
	}

	const ev_id = Number(params.event_id)

	const event = await db.event.findUnique({
		where: { event_id: ev_id },
		include: {
			User: true,
			School: {
				include: {
					city: true // Az iskolához tartozó várost is hozzácsapjuk
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

	// Adatok előkészítése a frontendnek
	const countries = await db.country.findMany({})
	const regions = await db.region.findMany({})
	
	const formattedEvent = {
		...event,
		on_duty_name: getName(dutyMap, event.on_duty),
		event_type_name: getName(eventMap, event.event_type)
	};

	const formattedInters = event.InterestedStudents.map(ints => ({
		...ints,
		grade: getName(gradeMap, ints.grade),
		channel: getName(channelMap, ints.channel),
		status: getName(statusMap, ints.status)
	}));

	return {
		event: formattedEvent,
		school: event.School,
		cityname: event.School?.city?.city_name || 'Ismeretlen város',
		countries,
		regions,
		inters: formattedInters
	}
}
