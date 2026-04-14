import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/database';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	const user = await db.user.findUnique({
		where: { user_id: locals.user.user_id },
		include: {
			Contact: {
				orderBy: { contact_name: 'asc' } // ABC sorrend már a szerveren
			}
		}
	});

	// Ha a user létezik, de nincs kontaktja, üres tömböt adunk vissza
	return {
		contacts: user?.Contact ?? []
	};
};
