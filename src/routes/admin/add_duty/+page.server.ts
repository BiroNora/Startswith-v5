import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { db } from '$lib/database'
import { LEVEL_LABELS } from '../../stores/dataStore'
import { generateSecurePassword } from '$lib/adminUtils'

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || locals.user.active === false) throw redirect(302, '/auth/login')
}

export const actions: Actions = {
  addRole: async ({ request, locals }) => {
    if (!locals.user?.user_id) throw redirect(302, '/auth/login');

    const formData = await request.formData();
    const user_id = String(formData.get('userId') || '');

    const { newPass, passwordHash } = await generateSecurePassword();

    const isSuperior = formData.get('isSuperior') === 'on';
    const isDirector = formData.get('isDirector') === 'on';

    const type = isSuperior ? 'SUPERIOR' : 'DIRECTOR';

    const superiorRegionId = isSuperior ? Number(formData.get('regS')) : 0;
    const directorLevel = isDirector ? Number(formData.get('regD')) : 0;

    if (isSuperior && (!superiorRegionId || superiorRegionId === 0)) {
      return fail(400, { message: 'Kérlek válassz régiót a SUPERIOR joghoz!' });
    }

    if (isDirector && !directorLevel) {
      return fail(400, { message: 'Kérlek válassz szintet a DIRECTOR joghoz!' });
    }

    try {
      await db.$transaction(async (tx) => {

        await tx.user.update({
          where: { user_id: user_id },
          data: { passwordHash: passwordHash }
        });

        await tx.userDuty.create({
          data: {
            user_id: user_id,
            level: directorLevel,
            region_id: superiorRegionId,
            type: type as any
          }
        });
      });

      return { success: true, generatedPassword: newPass, newUser: true };

    } catch (error: any) {
      console.error(error);
      if (error.code === 'P2002') {
        return fail(400, { error: "Ez a beosztás már létezik ennél a felhasználónál!" });
      }
      return fail(500, { error: "Hiba történt a mentés során." });
    }
  },

  delRole: async ({ request }) => {
    const formData = await request.formData();
    const dutyId = Number(formData.get('dutyId'));

    if (!dutyId) {
      return fail(400, { message: 'Hiányzó azonosító!' });
    }

    try {
      await db.userDuty.delete({ where: { id: dutyId } });
    } catch (error) {
      console.error("Hiba a jog törlésekor:", error);
      return fail(500, { message: 'Adatbázis hiba történt a törlés során.' });
    }

    throw redirect(303, '/register/duty_settings');
  }
};
