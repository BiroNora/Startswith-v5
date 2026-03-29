// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit'
import { db } from '$lib/database'

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get('session')

  if (!session) {
    event.locals.user = null
    return await resolve(event)
  }

  const user = await db.user.findUnique({
    where: { userAuthToken: session },
    select: {
      user_id: true,
      user_email: true,
      user_name: true,
      user_phone: true,
      active: true,
      role: true,
      user_duties: true
    },
  })

  // Csak akkor engedjük be, ha létezik ÉS aktív a felhasználó
  if (user && user.active) {
    event.locals.user = {
      user_id: user.user_id,
      email: user.user_email,
      phone: user.user_phone,
      name: user.user_name,
      active: user.active,
      role: user.role,
      duty: user.user_duties,

      // EXTRÁK, amik aranyat érnek a frontend oldalon:
      // Így nem kell mindig a role-t stringként csekkolni
      isSuper: user.role === 'SUPER_USER',
      isDirector: user.role === 'DIRECTOR',
      isSuperior: user.role === 'SUPERIOR',

      // Egy gyors lista az összes régióról, amihez joga van
      // Ha SUPER_USER, akkor ez később egy külön logikát kaphat,
      // de egyelőre kigyűjtjük a meglévőket:
      allowedRegions: user.user_duties.map(d => d.region_id)
    }
  } else {
    event.locals.user = null
  }

  return await resolve(event)
}
