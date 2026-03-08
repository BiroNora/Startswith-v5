import { fail, redirect } from '@sveltejs/kit'
import { db } from '$lib/database'
import type { Actions, PageServerLoad } from './$types'
import bcrypt from 'bcryptjs'
import { isStrongPassword } from '../../stores/dataStore'

export const load: PageServerLoad = async ({ url }) => {
  const token = url.searchParams.get('token') || url.search.slice(1);

  if (!token) {
    return redirect(302, '../reset-password-error')
  }

  const user = await db.user.findFirst({
    where: { resetToken: token },
  })

  if (user && user.active === true && user.resetTokenExpiry && new Date(user.resetTokenExpiry) >= new Date()) {
    return {
      isValid: true,
      userEmail: user.user_email,
      token: token // Visszaadjuk a tokent is a biztonság kedvéért
    }
  }

  return { isValid: false, userEmail: '' }
}

export const actions: Actions = {
  reset: async ({ request }) => {
    const data = await request.formData()
    const email = String(data.get('email'))
    const password = String(data.get('password'))
    const password1 = String(data.get('password1'))

    if (!email || !password || password !== password1 || !isStrongPassword(password)) {
      return fail(400, { credentials: true })
    }

    // generate new auth token just in case
    await db.user.update({
      where: { user_email: email },
      data: {
        user_password: await bcrypt.hash(password, 10), // Figyelj a mezőnévre a sémádban!
        userAuthToken: crypto.randomUUID(),
        resetToken: null, // Töröljük a tokent, hogy ne lehessen újra felhasználni
        resetTokenExpiry: null
      }
    })

    throw redirect(302, '/auth/login')
  }
}
