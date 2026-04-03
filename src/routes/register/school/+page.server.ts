import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { db } from '$lib/database'
import { getLocationData, parseSchoolFormData } from '$lib/validation'

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || locals.user.active === false) throw redirect(302, '/auth/login')

  // A közös függvény betölti az összes helyszínt
  return await getLocationData()
};

export const actions: Actions = {
  school: async ({ request, locals }) => {
    if (!locals.user?.email) throw redirect(302, '/auth/login');

    const formData = await request.formData()

    // 1. Adatok kinyerése és rendszerezése a közös függvénnyel
    const s = parseSchoolFormData(formData);

    // 2. User és Helyszín integritás ellenőrzése párhuzamosan
    const [myuser, regionCheck, countyCheck, cityCheck] = await Promise.all([
      db.user.findUnique({ where: { user_email: locals.user.email } }),
      db.region.findUnique({ where: { region_id: s.region_id } }),
      db.county.findUnique({ where: { county_id: s.county_id } }),
      db.city.findUnique({ where: { city_id: s.city_id } })
    ])

    if (!myuser) return fail(400, { user: true })

    if (
      regionCheck?.country_id !== s.country_id ||
      countyCheck?.region_id !== s.region_id ||
      cityCheck?.county_id !== s.county_id
    ) {
      return fail(400, { local: true })
    }

    // 3. Duplikáció ellenőrzés (OM ID és Email)
    const existingSchool = await db.school.findFirst({
      where: {
        OR: [
          s.om_id ? { om_id: String(s.om_id) } : {},
          { school_email: s.school_email }
        ].filter(condition => Object.keys(condition).length > 0)
      }
    })

    if (existingSchool) {
      if (existingSchool.school_email === s.school_email) return fail(400, { sch: true })
      return fail(400, { omid: true })
    }

    // 4. OM ID validáció (Magyarország = 1)
    const isHungary = s.country_id === 1;

    if (isHungary && !s.isNotClassified) {
      // Ha Magyarország és NEM "Egyéb" (15), akkor kötelező a 6 karakter
      if (!s.om_id || s.om_id.trim().length !== 6) {
        return fail(400, { omval: true })
      }
    }

    // 5. Prisma mentés előtt leválasztjuk a nem DB mezőket (user_email, isNotClassified)
    const { user_email, isNotClassified, ...prismaData } = s

    try {
      await db.school.create({
        data: {
          ...prismaData,
          active: true,
          active_by: locals.user.serial,
          User: { connect: { user_id: myuser.user_id } }
        }
      })
    } catch (err) {
      console.error(err)
      return fail(500, { error: true })
    }

    throw redirect(303, '/lists/schools')
  }
}
