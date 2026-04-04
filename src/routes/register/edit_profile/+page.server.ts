import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { hash } from 'bcrypt-ts';
import { db } from '$lib/database'
import { isStrongPassword } from '../../stores/dataStore'

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || locals.user.active === false) throw redirect(302, '/auth/login')
}

export const actions: Actions = {
  user: async ({ request, locals }) => {
    if (!locals.user?.email) throw redirect(302, '/auth/login');
    const sessionUserEmail = locals.user.email;
    const data = await request.formData()

    const user_name = data.get('name') ? String(data.get('name')) : undefined;
    const user_phone = data.get('phone') ? String(data.get('phone')) : undefined;

    // 3. Jelszó kezelése (opcionális: csak ha kitöltötte)
    const password1 = data.get('password1')
    const password2 = data.get('password2')

    let passwordUpdateData = {};

    if (password1 && String(password1).trim() !== "") {
      if (password1 !== password2) return fail(400, { invalid: true });
      if (!isStrongPassword(String(password1))) return fail(400, { passw: true });

      passwordUpdateData = {
        passwordHash: await hash(String(password1), 10),
        userAuthToken: crypto.randomUUID() // Kijelentkeztetés máshonnan jelszócserekor
      };
    }

    // 4. Frissítés
    await db.user.update({
      where: { user_email: sessionUserEmail },
      data: {
        user_name,    // Ha undefined, marad a régi
        user_phone,   // Ha undefined, marad a régi
        ...passwordUpdateData,
        active: true,
        active_by: locals.user.serial
      }
    })

    // Ha megváltozott az e-mail, érdemes lehet a session-t is frissíteni vagy újra beléptetni,
    // de egyelőre dobjuk a listára.
    throw redirect(303, '/lists/activities')
  }
}
