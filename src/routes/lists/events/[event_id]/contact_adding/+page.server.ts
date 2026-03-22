import { db } from "$lib/database"
import { fail, redirect } from "@sveltejs/kit"
import type { Actions } from "./$types"
import { checkEventAccess } from "$lib/validation";

export const actions: Actions = {
  eventU: async ({ request, params, locals }) => {
    const event_id = Number(params.event_id);
    const event = await checkEventAccess(locals, event_id);

    const data = await request.formData();
    const email = String(data.get('email'));

    const targetUser = await db.user.findUnique({
      where: { user_email: email },
      select: { user_id: true }
    });
    if (!targetUser) return fail(400, { userevent: true, alreadyevent: false });

    if (event.User.some(u => u.user_id === targetUser.user_id)) {
      return fail(400, { alreadyevent: true, userevent: false });
    }

    await db.event.update({
      where: { event_id },
      data: { User: { connect: { user_id: targetUser.user_id } } }
    });

    throw redirect(303, `/lists/events/${params.event_id}`);
  }
}
