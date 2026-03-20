import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { dutyType, schoolType } from '../../../../stores/dataStore';
import { db } from '$lib/database';

export const load = async ({ parent }) => {
    return await parent();
};

export const actions: Actions = {
  school: async ({ request, params, locals }) => {
    if (!locals.user) throw redirect(302, '/auth/login')

    const schoolId = Number(params.school_id)
    const data = await request.formData()

    // Típusok és szintek összeszedése
    const school_type: string[] = []
    const duty: string[] = []

    schoolType.forEach((type, index) => {
      if (data.get(`isk${String.fromCharCode(65 + index)}`)) {
        school_type.push(type[0])
      }
    })

    if (data.get('bas')) duty.push(dutyType[0][0])
    if (data.get('med')) duty.push(dutyType[1][0])
    if (data.get('hig')) duty.push(dutyType[2][0])

    await db.school.update({
      where: { school_id: schoolId },
      data: {
        school_name: String(data.get('name')),
        zip_code: String(data.get('zip')),
        address: String(data.get('address')),
        dir_name: String(data.get('dirname')),
        dir_phone: String(data.get('dirphone')),
        school_email: String(data.get('email')),
        website: String(data.get('website')) || null,
        school_type,
        duty,
        coop: data.has('coop'),   // Ha benne van a formban, akkor true, ha nincs, false
        active: data.has('active'),
        note: String(data.get('note')),
        active_by: locals.user.name || locals.user.email,
        basic: data.has('bas'),
        medior: data.has('med'),
        high: data.has('hig')
      }
    })

    throw redirect(303, '../../../lists/schools')
  }
};
