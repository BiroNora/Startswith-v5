import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/database';
import { DUTY_MAP } from '../../stores/dataStore';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	const rawEvents = await db.event.findMany({
		orderBy: { closing_date: 'desc' },
		include: {
			School: {
				select: { school_name: true }
			}
		}
	});

	if (!rawEvents) {
		throw error(404, 'Events not found');
	}

	const events = rawEvents.map((ev) => {
		const dutyName = DUTY_MAP.find((d) => d.id === ev.duty_level)?.name || ev.duty_level;

		return {
			...ev,
			slug: ev.School?.school_name || 'Ismeretlen iskola',
			on_duty: dutyName
		};
	});

	return { events };
};
