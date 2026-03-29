import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { db } from '$lib/database'

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || locals.user.active === false) throw redirect(302, '/auth/login')
}

export const actions: Actions = {
  addRole: async ({ request, locals }) => {
    if (!locals.user?.user_id) throw redirect(302, '/auth/login');

    const formData = await request.formData();
    const level = Number(formData.get('level'));
    const region_id = Number(formData.get('region_id'));
    const user_id = String(locals.user.user_id);

    if (!level || !region_id) return fail(400, { message: 'Minden mezőt ki kell tölteni!' });

    try {
      await db.userDuty.create({
        data: {
          user_id: user_id,
          level: level,
          region_id: region_id,
          type: 'USER'
        }
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return fail(400, { message: 'Ez a jogosultság már létezik!' });
      }
      return fail(500, { message: 'Adatbázis hiba történt.' });
    }

    throw redirect(303, '/register/duty_settings');
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
