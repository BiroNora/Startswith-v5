import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { getFilterBaseData } from '$lib/server/filterUtils'

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || locals.user.active === false) {
		throw redirect(302, '/auth/login')
	}

	const filterData = await getFilterBaseData();

	return {
		...filterData,
	}
}
