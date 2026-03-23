import { checkEventAccess } from "$lib/validation";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { db } from "$lib/database";

export const actions: Actions = {
  delInterest: async ({ request, locals }) => {
    const data = await request.formData();
    const intrest_id = Number(data.get('int_id'));
    const event_id = Number(data.get('event_id'));

    const event = await checkEventAccess(locals, event_id);

    const belongsToEvent = event.InterestedStudents.some(
      (s) => s.intrest_id === intrest_id
    );

    if (!belongsToEvent) {
      return fail(403, { interest: true, message: "Ez az adat nem ehhez az eseményhez tartozik." });
    }

    try {
      await db.interestedStudents.delete({ where: { intrest_id } });
      return { success: true };
    } catch (e) {
      return fail(400, { interest: true });
    }
  }
};
