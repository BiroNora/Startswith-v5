import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/database';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user?.user_id) {
		throw redirect(302, '/auth/login');
	}

	const user = await db.user.findUnique({
		where: { user_id: locals.user.user_id },
		include: {
			School: {
				orderBy: { school_name: 'asc' },
				include: { city: true }
			}
		}
	});

	if (!user) throw error(404, 'User not found');

	return {
		schools: user.School
	};
};
