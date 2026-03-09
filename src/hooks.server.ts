import type { Handle } from '@sveltejs/kit'
import { db } from '$lib/database'

export const handle: Handle = async ({ event, resolve }) => {
  // get cookies from browser
  const session = event.cookies.get('session')

  if (!session) {
    event.locals.user = null;
    // if there is no session load page as normal
    return await resolve(event)
  }

  // find the user based on the session
  const user = await db.user.findUnique({
    where: { userAuthToken: session },
    select: { user_id: true, user_email: true, user_name: true, on_duty: true, active: true },
  })

  if (user) {
    event.locals.user = {
      user_id: user.user_id,
      email: user.user_email,
      name: user.user_name,
      duty: user.on_duty,
      active: user.active
    }
  } else {
    event.locals.user = null;
  }

  return await resolve(event)
}
