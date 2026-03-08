import { redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  // we only use this endpoint for the api
  // and don't need to see the page
  throw redirect(302, '/')
}

export const actions: Actions = {
  default: async ({ cookies, locals }) => {
    // eat the cookie
    cookies.delete('session', { path: '/' });

    locals.user = null;

    // redirect the user
    throw redirect(302, '/auth/login')
  },
}
