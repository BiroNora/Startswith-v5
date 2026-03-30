import { db } from "$lib/database";
import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import bcrypt from 'bcryptjs';

export const actions: Actions = {
    // 1. KERESÉS FUNKCIÓ
    search: async ({ request }) => {
        const data = await request.formData();
        const email = String(data.get('email'));

        const foundUser = await db.user.findUnique({
            where: { user_email: email },
            include: { user_duties: true }
        });

        if (!foundUser) {
            return { newUser: true, email };
        }

        return {
            foundUser: {
                name: foundUser.user_name,
                email: foundUser.user_email,
                duties: foundUser.user_duties
            }
        };
    },

    // 2. MENTÉS / LÉTREHOZÁS (A formodban action="?/user")
    user: async ({ request }) => {
        const data = await request.formData();
        const email = String(data.get('email'));
        const name = String(data.get('name'));
        const password = String(data.get('password'));

        // Jogosultság adatok a formból
        const isSuperior = data.has('superior');
        const isDirector = data.has('director');
        const regS = Number(data.get('regS')); // Régió ID a Superiorhoz
        const regD = Number(data.get('regD')); // Level ID a Directorhoz (nálad regD néven jön a select-ből)

        const passwordHash = await bcrypt.hash(password, 10);

        try {
            // Felhasználó mentése/frissítése
            const user = await db.user.upsert({
                where: { user_email: email },
                update: {
                    user_name: name,
                    passwordHash: passwordHash,
                    userAuthToken: crypto.randomUUID()
                },
                create: {
                    user_email: email,
                    user_name: name,
                    passwordHash: passwordHash,
                    userAuthToken: crypto.randomUUID(),
                    active: true,
                    nationality: 'magyar',
                    user_phone: '',
                    active_by: 'admin'
                }
            });

            // --- JOGOSULTSÁGOK KEZELÉSE ---

            // SUPERIOR JOG
            if (isSuperior) {
                await db.userDuty.upsert({
                    where: {
                        // Feltételezve, hogy van egy egyedi indexed: user_id + type + region_id
                        user_id_type_region_id: {
                            user_id: user.user_id,
                            type: 'SUPERIOR',
                            region_id: regS
                        }
                    },
                    update: {}, // Ha már létezik, nem kell bántani
                    create: {
                        user_id: user.user_id,
                        type: 'SUPERIOR',
                        region_id: regS,
                        level: 0 // Vagy amit alapértelmezettnek szánsz
                    }
                });
            }

            // DIRECTOR JOG
            if (isDirector) {
                await db.userDuty.upsert({
                    where: {
                        user_id_type_level: { // Feltételezve az egyedi indexet
                            user_id: user.user_id,
                            type: 'DIRECTOR',
                            level: regD
                        }
                    },
                    update: {},
                    create: {
                        user_id: user.user_id,
                        type: 'DIRECTOR',
                        region_id: 1, // Director esetében pl. országos (1-es régió)
                        level: regD
                    }
                });
            }

            return { success: true };

        } catch (error) {
            console.error("Hiba a mentés során:", error);
            return fail(500, { message: 'Adatbázis hiba történt.' });
        }
    },

    // 3. EGY JOG TÖRLÉSE (A kis piros X-re)
    delUser: async ({ request }) => {
        const data = await request.formData();
        const dutyId = Number(data.get('dutyId')); // Ezt majd küldd el a modalból!

        try {
            await db.userDuty.delete({
                where: { id: dutyId }
            });
            return { success: true };
        } catch (error) {
            return fail(500, { message: 'Nem sikerült a törlés.' });
        }
    }
};
