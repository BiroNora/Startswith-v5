import { fail, redirect } from '@sveltejs/kit'
import { db } from '$lib/database'
import type { Actions, PageServerLoad } from './$types'
import { hash } from 'bcrypt-ts';
import { isStrongPassword } from '../../stores/dataStore'

export const load: PageServerLoad = async ({ url }) => {
  // A linkből kiszedjük a tokent: http://localhost:5173/auth/reset-password?token=XYZ
  const token = url.searchParams.get('token');

  if (!token) {
    return redirect(302, '/auth/forgot_password')
  }

  const user = await db.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() } // Csak akkor érvényes, ha a lejárati idő nagyobb, mint "most"
    }
  })

  if (!user) {
    return { isValid: false };
  }

  return {
    isValid: true,
    userEmail: user.user_email,
    token: token
  };
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

    // 2. Mentés
    try {
      await db.user.update({
        where: { user_email: email },
        data: {
          // JAVÍTÁS: A sémád szerint passwordHash a mező neve!
          passwordHash: await hash(password, 10),
          userAuthToken: crypto.randomUUID(), // Biztonság: minden más eszközről kiléptetjük
          resetToken: null,       // Felhasználtuk, töröljük
          resetTokenExpiry: null  // Lejárati időt is ürítjük
        }
      })
    } catch (err) {
      console.error("Hiba mentéskor:", err);
      return fail(500, { dbError: true });
    }

    // 3. Siker! Irány a login
    throw redirect(303, '/auth/login')
  }
}
