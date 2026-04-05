import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { db } from '$lib/database'

const formatLocationName = (name: string) => {
  if (!name) return '';

  let formatted = name
    .trim()
    .replace(/[!@#$%^&*~°?]/g, '')
    .split('-')
    .filter(Boolean)
    .map(val => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase())
    .join('-');

  // 2. Szétbontjuk a formázott nevet az első kötőjelnél
  // Pl. "Budapest-Xi-Kerulet" -> ["Budapest", "Xi", "Kerulet"]
  // Pl. "Algyő-Hatos" -> ["Algyő", "Hatos"]
  const parts = formatted.split('-');
  if (parts[0].toUpperCase() === 'BUDAPEST') {
    return 'Budapest';
  }

  return formatted;
}

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) throw redirect(302, '/auth/login');
}

export const actions: Actions = {
  location: async ({ request, locals }) => {
    if (!locals.user) { throw redirect(302, '/auth/login') }

    const data = await request.formData()

    const country_name = formatLocationName(String(data.get('country')))
    const country_code = String(data.get('country-code')).trim().toUpperCase()
    const region_name = formatLocationName(String(data.get('region')))
    const county_name = formatLocationName(String(data.get('county')))
    const city_name = formatLocationName(String(data.get('city')))

    try {
      // 1. Megnézzük, létezik-e már ez a város ebben a hierarchiában
      const existingCity = await db.city.findFirst({
        where: {
          city_name,
          county: {
            county_name,
            region: {
              region_name,
              country: { country_name }
            }
          }
        }
      })

      if (existingCity) {
        return fail(400, { error: true, message: 'Location already exists.' })
      }

      // 2. Hierarchikus mentés (Lépcsőzetes létrehozás)
      // Ország létrehozása vagy megkeresése
      const country = await db.country.upsert({
        where: { country_name },
        update: {},
        create: { country_name, country_code: country_code }
      });

      // Régió létrehozása vagy megkeresése
      const region = await db.region.upsert({
        where: {
          region_name
        },
        update: {},
        create: {
          region_name,
          country_id: country.country_id
        }
      });

      const county = await db.county.upsert({
        where: { county_name },
        update: {},
        create: {
          county_name,
          region_id: region.region_id
        }
      });

      await db.city.create({
        data: {
          city_name,
          county_id: county.county_id
        }
      });

      throw redirect(303, '/register/school')

    } catch (err) {
      // Ha redirect történt, azt engedjük tovább
      if (err instanceof Error && err.message.includes('redirect')) throw err;
      if (typeof err === 'object' && err !== null && 'status' in err) throw err;

      console.error('Hiba a mentés során:', err);
      return fail(500, { error: true, message: 'Database error.' })
    }
  }
}
