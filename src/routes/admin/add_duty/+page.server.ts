import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { db } from '$lib/database'
import { generateSecurePassword } from '$lib/adminUtils'
import { Role } from '@prisma/client'

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || !locals.user.isSuper) throw redirect(302, '/auth/login')
}

export const actions: Actions = {
  addRole: async ({ request, locals }) => {
    const formData = await request.formData();
    const user_id = String(formData.get('userId') || '');

    // 1. Meglévő felhasználó adatainak lekérése (fontos a rang ellenőrzéséhez!)
    const currentUser = await db.user.findUnique({
      where: { user_id: user_id },
      select: { role: true }
    });

    if (!currentUser) {
      return fail(404, { message: 'Felhasználó nem található!' });
    }

    const { newPass, passwordHash } = await generateSecurePassword();

    const isSuperior = formData.get('isSuperior') === 'on';
    const isDirector = formData.get('isDirector') === 'on';

    let finalRole: Role = currentUser.role as Role;

    if (currentUser.role === 'SUPER_USER') {
      finalRole = 'SUPER_USER';
    } else if (isDirector) {
      finalRole = 'DIRECTOR';
    } else if (isSuperior) {
      finalRole = 'SUPERIOR';
    } else {
      finalRole = 'USER';
    }

    const superiorRegionId = isSuperior ? Number(formData.get('regS')) : 0;
    const directorLevel = isDirector ? Number(formData.get('regD')) : 0;

    const currentDutyType: Role = isDirector ? Role.DIRECTOR : Role.SUPERIOR;

    if (isSuperior && (!superiorRegionId || superiorRegionId === 0)) {
      return fail(400, { message: 'Kérlek válassz régiót a SUPERIOR joghoz!' });
    }

    if (isDirector && !directorLevel) {
      return fail(400, { message: 'Kérlek válassz szintet a DIRECTOR joghoz!' });
    }

    if (!isSuperior && !isDirector) {
      return fail(400, { message: 'Legalább egy beosztást (SUPERIOR vagy DIRECTOR) ki kell választanod!' });
    }

    try {
      await db.$transaction(async (tx) => {

        await tx.user.update({
          where: { user_id: user_id },
          data: { role: finalRole, passwordHash: passwordHash }
        });

        await tx.userDuty.create({
          data: {
            user_id: user_id,
            level: directorLevel,
            region_id: superiorRegionId,
            type: currentDutyType
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
