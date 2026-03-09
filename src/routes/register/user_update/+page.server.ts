import { fail, redirect } from '@sveltejs/kit'
import type { Action, Actions, PageServerLoad } from './$types'
import bcrypt from 'bcryptjs'
import { db } from '$lib/database'
import { dutyType, isStrongPassword } from '../../stores/dataStore'

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || locals.user.active === false) throw redirect(302, '/auth/login')

  const [countries, regions, counties, cities, user] = await Promise.all([
    db.country.findMany({
      orderBy: { country_name: 'asc' }
    }),
    db.region.findMany({
      select: { region_id: true, region_name: true, country_id: true }, // country_id KELL!
      orderBy: { region_name: 'asc' }
    }),
    db.county.findMany({
      select: { county_id: true, county_name: true, region_id: true }, // region_id KELL!
      orderBy: { county_name: 'asc' }
    }),
    db.city.findMany({
      select: { city_id: true, city_name: true, county_id: true }, // county_id KELL!
      orderBy: { city_name: 'asc' }
    }),
    db.user.findUnique({
      where: { user_email: locals.user.email }
    })
  ]);

  if (!countries || !regions || !counties || !cities || !user) {
    return fail(400, { error: true, message: 'Adatbázis hiba történt.' })
  }

  return { countries, regions, counties, cities, user }
}

const user: Action = async ({ request, locals }) => {
  if (!locals.user?.email) throw redirect(302, '/auth/login');
  const sessionUserEmail = locals.user.email;

  const data = await request.formData()
  const user_email = String(data.get('email'))

  // 1. E-mail ütközés vizsgálata (csak ha változtatni akarja)
  if (user_email !== sessionUserEmail) {
    const existingUser = await db.user.findUnique({ where: { user_email } })
    if (existingUser) return fail(400, { user: true })
  }

  // 2. Alapadatok kinyerése
  const user_name = String(data.get('name'))
  const nationality = String(data.get('nationality'))
  const user_phone = String(data.get('phone'))

  const basic = Boolean(data.get('basic'))
  const reB = String(data.get('regB'))
  const medior = Boolean(data.get('medior'))
  const reM = String(data.get('regM'))
  const high = Boolean(data.get('high'))
  const reH = String(data.get('regH'))
  const superior = Boolean(data.get('superior'))
  const reS = String(data.get('regS'))
  const director = Boolean(data.get('director'))
  const reD = String(data.get('regD'))

  const on_duty = [
    Number(dutyType[0][0] + (basic ? reB : '0')),
    Number(dutyType[1][0] + (medior ? reM : '0')),
    Number(dutyType[2][0] + (high ? reH : '0')),
    Number(dutyType[3][0] + (superior ? reS : '0')),
    Number(dutyType[4][0] + (director ? reD : '0'))
  ];

  if (on_duty.every((val, i) => val === Number(dutyType[i][0] + '0'))) {
    return fail(400, { regions: true })
  }

  // 3. Jelszó kezelése (opcionális: csak ha kitöltötte)
  const password1 = data.get('password1')
  const password2 = data.get('password2')
  let passwordUpdateData = {};

  if (password1) {
    if (password1 !== password2) return fail(400, { invalid: true });
    if (!isStrongPassword(String(password1))) return fail(400, { passw: true });

    passwordUpdateData = {
      passwordHash: await bcrypt.hash(String(password1), 10),
      userAuthToken: crypto.randomUUID() // Kijelentkeztetés máshonnan jelszócserekor
    };
  }

  // 4. Frissítés
  await db.user.update({
    where: { user_email: sessionUserEmail },
    data: {
      user_name,
      user_email, // Itt frissül az új emailre, ha változott
      nationality,
      user_phone,
      on_duty,
      ...passwordUpdateData,
      active: true,
      active_by: 'self'
    }
  })

  // Ha megváltozott az e-mail, érdemes lehet a session-t is frissíteni vagy újra beléptetni,
  // de egyelőre dobjuk a listára.
  throw redirect(303, '/lists/activities')
}

const user_active_change: Action = async ({ request, locals }) => {
  if (!locals.user) throw redirect(302, '/auth/login');

  const data = await request.formData()
  const target_email = String(data.get('email'))
  const active_by = locals.user.email

  const targetUser = await db.user.findUnique({ where: { user_email: target_email } })
  if (!targetUser) return fail(400, { user: true })

  await db.user.update({
    where: { user_email: target_email },
    data: {
      active: !targetUser.active,
      active_by
    }
  })

  return { success: true };
}

export const actions: Actions = { user, user_active_change }
