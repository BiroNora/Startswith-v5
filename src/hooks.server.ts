// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');

	if (!session) {
		event.locals.user = null;
		return await resolve(event);
	}

	const user = await db.user.findUnique({
		where: { userAuthToken: session },
		select: {
			user_id: true,
			user_email: true,
			user_name: true,
			user_phone: true,
			active: true,
			role: true,
			user_duties: true,
			user_serial: true
		}
	});

	// Csak akkor engedjük be, ha létezik ÉS aktív a felhasználó
	if (user && user.active) {
		const dutyTypes = user.user_duties.map((d) => d.type);

		event.locals.user = {
			user_id: user.user_id,
			email: user.user_email,
			phone: user.user_phone,
			name: user.user_name,
			active: user.active,
			role: user.role,
			duty: user.user_duties,
			serial: user.user_serial,

			// EXTRÁK, amik aranyat érnek a frontend oldalon:
			// Így nem kell mindig a role-t stringként csekkolni
			isSuper: user.role === 'SUPER_USER',
			isDirector: user.role === 'DIRECTOR' || dutyTypes.includes('DIRECTOR'),
			isSuperior: user.role === 'SUPERIOR' || dutyTypes.includes('SUPERIOR')
		};
	} else {
		event.locals.user = null;
	}

	return await resolve(event);
};
