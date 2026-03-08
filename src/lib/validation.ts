import { db } from '$lib/database';
import { dutyType, schoolType } from '../routes/stores/dataStore';

// Közös adatbetöltő a legördülő menükhöz
export async function getLocationData() {
    const [countries, regions, counties, cities] = await Promise.all([
        db.country.findMany({ orderBy: { country_name: 'asc' } }),
        db.region.findMany({ orderBy: { region_name: 'asc' } }),
        db.county.findMany({ orderBy: { county_name: 'asc' } }),
        db.city.findMany({ orderBy: { city_name: 'asc' } })
    ]);
    return { countries, regions, counties, cities };
}

// Form adatok tisztítása és objektumba rendezése
export function parseSchoolFormData(data: FormData) {
    const school_type: string[] = [];
    schoolType.forEach((t, i) => {
        if (data.get(`isk${String.fromCharCode(65 + i)}`)) school_type.push(t[0]);
    });

    const duty: string[] = [];
    ['bas', 'med', 'hig'].forEach((key, i) => {
        if (data.get(key)) duty.push(dutyType[i][0]);
    });

    return {
        user_email: String(data.get('useremail')),
        country_id: Number(data.get('countr')),
        region_id: Number(data.get('region')),
        county_id: Number(data.get('county')),
        city_id: Number(data.get('city')),
        school_name: String(data.get('name')),
        school_email: String(data.get('email')),
        om_id: String(data.get('om')) || null,
        zip_code: String(data.get('zip')),
        address: String(data.get('address')),
        dir_name: String(data.get('dirname')),
        dir_phone: String(data.get('dirphone')),
        website: String(data.get('website')) || null,
        coop: Boolean(data.get('coop')),
        note: String(data.get('note')),
        basic: Boolean(data.get('bas')),
        medior: Boolean(data.get('med')),
        high: Boolean(data.get('hig')),
        isNotClassified: Boolean(data.get('iskO')),
        school_type,
        duty
    };
}
