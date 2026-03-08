import { fail, redirect } from '@sveltejs/kit'
import { db } from '$lib/database'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user || locals.user.active === false) {
		throw redirect(302, '/auth/login')
	}

	const act_id = Number(params.act_id)

	const activity = await db.activity.findUnique({
		where: { act_id: act_id }
	})

	if (!activity) {
		throw redirect(302, '/lists/activities')
	}

	const reg_id = activity.on_duty.charAt(1)

	const region = await db.region.findUnique({
		where: { region_id: Number(reg_id) },
		select: { region_id: true, region_name: true }
	})

	return { activity, region }
}

export const actions: Actions = {
  delAct: async ({ params, locals }) => {
    if (!locals.user) return fail(401);

    // Biztosítsuk, hogy az ID szám, és nem NaN
    const id_to_delete = parseInt(params.act_id as string);

    if (isNaN(id_to_delete)) {
      return fail(400, { message: "Érvénytelen azonosító" });
    }

    try {
      // Első lépés: létezik-e egyáltalán?
      const existing = await db.activity.findUnique({
        where: { act_id: id_to_delete }
      });

      if (!existing) {
        console.log("Hiba: A rekord nem található az adatbázisban:", id_to_delete);
        return fail(404, { message: "A rekord már nem létezik" });
      }

      await db.activity.delete({
        where: { act_id: id_to_delete }
      });

      console.log("Sikeres törlés ID:", id_to_delete);
    } catch (error) {
      console.error("Adatbázis hiba törlés közben:", error);
      return fail(500, { message: "Adatbázis hiba történt" });
    }

    // A redirect-et MINDIG a try-catch-en KÍVÜL kell dobni!
    throw redirect(303, '/lists/activities');
  }
};
