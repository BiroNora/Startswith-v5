import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/database';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';

export const actions: Actions = {
  // 1. Átirányítás a jogosultság hozzáadáshoz
  "search-add": async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email');
    throw redirect(303, `/admin/add_duty?email=${email}`);
  },

  // 2. Átirányítás a törléshez (Figyelj a mappa nevére: delete_duty vagy del-duty?)
  "search-del": async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email');
    throw redirect(303, `/admin/delete_duty?email=${email}`);
  },

  "add-new-user": async ({ request }) => {
    const data = await request.formData();
    const email = String(data.get('email')).trim();

    if (!email || !email.includes('@')) {
      return { error: "Érvénytelen email cím!" };
    }

    const existingUser = await db.user.findUnique({
      where: { user_email: email }
    });

    if (existingUser) {
      return { error: "Ez a felhasználó már létezik az adatbázisban!" };
    }

    const newPass = randomBytes(4).toString('hex');
    const passwordHash = await bcrypt.hash(newPass, 10);

    try {
      await db.user.create({
        data: {
          user_email: email,
          user_name: email.split('@')[0],
          passwordHash,
          active: true,
          nationality: 'magyar',
          user_phone: "",
          active_by: "admin",
          userAuthToken: crypto.randomUUID()
        }
      });

      // Siker esetén visszaküldjük a generált jelszót
      return { success: true, generatedPassword: newPass, newUser: true };
    } catch (e) {
      console.error("Hiba a létrehozás során:", e);
      return { error: "Váratlan hiba történt a mentéskor." };
    }
  }
};
