import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db } from '$lib/database'

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login')
	}
	const schools = await db.school.findMany({
		include: {
			User: true,
			city: true,
			region: true,
			county: true
		},
		orderBy: { school_name: 'asc' }
	})

	if (!schools) {
		throw error(404, 'School not found')
	}

	return { schools }
}
