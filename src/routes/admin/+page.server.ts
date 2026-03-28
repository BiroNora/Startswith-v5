import { db } from "$lib/database";
import { fail } from "@sveltejs/kit";

// src/routes/admin/+page.server.ts

//  >>>>>>>>>>>>>>>>> DANGER DANGER DANGER <<<<<<<<<<<<<<<<<<<<<<


export const actions = {
  syncUserRoles: async () => {
    try {
      // 1. Lekérjük a usereket az új duty-kkal
      const users = await db.user.findMany({
        include: { user_duties: true }
      });

      let updatedCount = 0;

      for (const user of users) {
        // Meghatározzuk az új rangot (Alapértelmezett: USER)
        // A típusnál felsoroljuk az összes Enum értéket a sémádból
        let newRole: 'USER' | 'SUPERIOR' | 'DIRECTOR' | 'SUPER_USER' = 'USER';

        // Ha véletlenül már most lenne valaki SUPER_USER, őt ne bántsuk
        if (user.role === 'SUPER_USER') {
          continue;
        }

        const duties = user.user_duties;
        const hasDirector = duties.some(d => d.type === 'DIRECTOR');
        const hasSuperior = duties.some(d => d.type === 'SUPERIOR');

        // Ranglétra sorrend: Director > Superior > User
        if (hasDirector) {
          newRole = 'DIRECTOR';
        } else if (hasSuperior) {
          newRole = 'SUPERIOR';
        }

        // Csak akkor frissítünk, ha tényleg változik a rang
        if (user.role !== newRole) {
          await db.user.update({
            where: { user_id: user.user_id },
            data: { role: newRole }
          });
          updatedCount++;
        }
      }

      return { success: true, message: `Kész! ${updatedCount} felhasználó rangja lett szinkronizálva.` };
    } catch (err) {
      console.error(err);
      return fail(500, { message: "Hiba történt a szinkronizálás során!" });
    }
  }
};
