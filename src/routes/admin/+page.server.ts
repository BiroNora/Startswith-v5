import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/database';
import { generateSecurePassword, getValidatedUser } from '$lib/adminUtils';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || locals.user.active === false || locals.user.role !== 'SUPER_USER') throw redirect(302, '/auth/login')
}

export const actions: Actions = {
  // 1. Átirányítás a jogosultság hozzáadáshoz
  "search-add": async ({ request }) => {
    const { email, user } = await getValidatedUser(await request.formData());

    if (!user) return { error: "Nincs ilyen felhasználó!" };
    if (!email) return { error: "Email megadása kötelező!" };

    throw redirect(303, `/admin/add_duty?email=${email}`);
  },

  // 2. Átirányítás a törléshez (Figyelj a mappa nevére: delete_duty vagy del-duty?)
  "search-del": async ({ request }) => {
    const { email, user } = await getValidatedUser(await request.formData());

    if (!user) return { error: "Nincs ilyen felhasználó!" };
    if (!email) return { error: "Email megadása kötelező!" };

    throw redirect(303, `/admin/delete_duty?email=${email}`);
  },

  "add-new-user": async ({ request }) => {
    const { email, user } = await getValidatedUser(await request.formData());

    if (user) return fail(500, { message: "Ezzel az email címmel felhasználó már létezik." });
    if (!email) return fail(500, { message: "Váratlan hiba történt a mentéskor." });

    const { newPass, passwordHash } = await generateSecurePassword();

    try {
      await db.user.create({
        data: {
          user_email: email,
          user_name: email.split('@')[0],
          passwordHash,
          active: true,
          user_phone: "",
          active_by: "admin",
          userAuthToken: crypto.randomUUID()
        }
      });

      // Siker esetén visszaküldjük a generált jelszót
      return { success: true, generatedPassword: newPass, newUser: true };
    } catch (e) {
      console.error("Hiba a létrehozás során:", e);
      return fail(500, { message: "Váratlan hiba történt a mentéskor." });
    }
  }
};
