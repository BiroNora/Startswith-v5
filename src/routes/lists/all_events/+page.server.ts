import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db } from '$lib/database'
import { dutyMap } from '../../stores/dataStore'

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || locals.user.active === false) {
		throw redirect(302, '/auth/login')
	}

	const rawEvents = await db.event.findMany({
		orderBy: { closing_date: 'desc' },
		include: {
			School: {
				select: { school_name: true }
			}
		}
	})

	if (!rawEvents) {
		throw error(404, 'Events not found')
	}

	const events = rawEvents.map(ev => {
		const dutyName = dutyMap.find(d => d.id === ev.on_duty)?.name || ev.on_duty;

		return {
			...ev,
			slug: ev.School?.school_name || 'Ismeretlen iskola',
			on_duty: dutyName
		}
	})

	return { events }
}
