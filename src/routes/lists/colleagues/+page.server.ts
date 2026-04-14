import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	const users = await db.user.findMany({
		where: {
			active: true
		},
		orderBy: {
			user_name: 'asc'
		},
		include: {
			user_duties: {
				orderBy: {
					type: 'desc'
				}
			}
		}
	});

	return { users };
};
