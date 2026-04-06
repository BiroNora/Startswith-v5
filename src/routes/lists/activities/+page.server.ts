import { error, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { db } from "$lib/database";

export const actions: Actions = {
  delAct: async ({ request }) => {
    const data = await request.formData();
    const act_id = Number(data.get('act_id'));

    if (!act_id) throw error(400, 'Invalid Activity ID');

    try {
      await db.activity.delete({
        where: { act_id: act_id }
      });

      throw redirect(303, '/lists/activities');
    } catch (err) {
      console.error(err);
      return { error: true, message: 'Hiba a törlés során.' };
    }
  }
}
