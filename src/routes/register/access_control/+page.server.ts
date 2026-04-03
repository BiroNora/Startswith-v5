import { db } from "$lib/database";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || locals.user.active === false) {
    throw redirect(302, '/auth/login');
  }

  const user = await db.user.findUnique({
    where: { user_email: locals.user.email },
    select: {
      user_id: true,
      role: true
    }
  });

  if (!user || (user.role !== 'DIRECTOR') ) {
    throw redirect(302, '/');
  }

  return { user };
};

export const actions: Actions = {
  user_active_change: async ({ request, locals }) => {
    if (!locals.user?.email) throw redirect(302, '/auth/login');
    const sessionUserNum = locals.user.serial;

    const formData = await request.formData();
    const targetEmail = String(formData.get('email'));

    const targetUser = await db.user.findUnique({
      where: { user_email: targetEmail }
    });

    if (!targetUser) {
      return fail(404, { userNotFound: true });
    }

    try {
      await db.user.update({
        where: { user_email: targetEmail },
        data: {
          active: !targetUser.active,
          active_by: sessionUserNum
        }
      });
    } catch (err) {
      return fail(500, { dbError: true });
    }

    throw redirect(303, '/lists/colleagues');
  }
};
