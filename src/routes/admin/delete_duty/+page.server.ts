import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types"
import { db } from "$lib/database";
import { generateSecurePassword } from "$lib/adminUtils";


export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || locals.user.active === false || locals.user.role !== 'SUPER_USER') throw redirect(302, '/auth/login')
}

export const actions: Actions = {
  deleteMultipleRoles: async ({ request }) => {
    const formData = await request.formData();
    const idsString = String(formData.get('ids') || '');
    const user_id = String(formData.get('userId') || '');

    if (!idsString || idsString === "") return fail(400, { message: "Nincs kijelölve semmi!" });

    if (!user_id) {
      return fail(400, { message: "Hiba: Hiányzó felhasználó azonosító!" });
    }

    const idsToDelete = idsString.split(',').map(id => Number(id));
    const { newPass, passwordHash } = await generateSecurePassword();

    try {
      await db.$transaction(async (tx) => {

        await tx.user.update({
          where: { user_id: user_id },
          data: { passwordHash: passwordHash }
        });

        await tx.userDuty.deleteMany({
          where: {
            id: { in: idsToDelete }
          }
        });
      });
      return { success: true, generatedPassword: newPass, newUser: true };
    } catch (e) {
      console.error(e);
      return fail(500, { message: "Adatbázis hiba történt a törlés során." });
    }
  }
};
