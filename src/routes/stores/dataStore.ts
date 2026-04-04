import type { User, UserDuty, Region } from '@prisma/client';

export function slugify(text: string) {
	return text
		.replace(/\s/g, '-')
		.replace(/[öőóÖŐÓ]/g, 'o')
		.replace(/[úüűÚÜŰ]/g, 'u')
		.replace(/[áÁ]/g, 'a')
		.replace(/[éÉ]/g, 'e')
		.replace(/[íÍ]/g, 'i')
		.replace(/[^a-zA-Z0-9-]/g, '')
		.toLowerCase()
}

export function dateSlugify(text: string) {
	const date = new Date(text)
	const y = date.getFullYear()
	const m = date.getMonth() + 1
	const d = date.getDate()
	let day = ''
	let month = ''

	if (d < 10) {
		day = `0${d}`
	} else {
		day = String(d)
	}

	if (m < 10) {
		month = `0${m}`
	} else {
		month = String(m)
	}

	const slugDate = `${y}-${month}-${day}`
	return slugDate
}

export function seasonSlugify(text: string) {
	const date = new Date(text)
	const year = date.getFullYear()
	const month = date.getMonth() + 1

	const semester = month >= 3 && month <= 9 ? 'SPRING' : 'FALL'

	const seasony = `${year}/${semester}`
	return seasony
}

export function timeSlugify(date: Date) {
	const timeComponents = [date.getHours(), date.getMinutes()]
	return timeComponents
		.map((component) => {
			const pad = component < 10 ? '0' : ''
			return pad + component
		})
		.join(':')
}

export function formatDate(date: Date) {
	const formatter = new Intl.DateTimeFormat('hu', { dateStyle: 'full' })
	return formatter.format(date)
}

export function isStrongPassword(password: string): boolean {
	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

	return regex.test(password);
}

// duty / regio segéd fg-e
function getRegionIdMath(num: number): number {
	if (num < 10) return num;

	const count = String(Math.abs(num)).length;
	const multiplier = Math.pow(10, count - 1);
	const firstDigit = Math.floor(num / multiplier);

	return num - (firstDigit * multiplier);
}

export function parseDutyAndRegion(arr: number[], regions: any[]) {
	const activeIndex = arr.findIndex(val => val > 0);

	if (activeIndex === -1) return "Unknown";

	const activeValue = arr[activeIndex];

	const currentDuty = DUTY_TYPES.find(d => d.id === String(activeIndex + 1));
	const levelName = currentDuty ? currentDuty.name : "Unknown";

	const regionId = getRegionIdMath(activeValue);

	if (regionId === 0) {
		return `${levelName}: all regions`;
	}

	const region = regions.find(r => r.region_id === regionId);

	return `${levelName}:  ${region?.region_name || `ID:${regionId}`}`;
}

export function parseDutyAndRegionAct(num: number, regions: any[]) {
	if (!num) return "Nincs adat";

	const firstDigit = parseInt(String(num)[0]);
	const levelName = DUTY_TYPES[firstDigit]?.name || "Unknown";

	const regionId = getRegionIdMath(num);
	const region = regions?.find(r => r.region_id === regionId);

	return `${levelName}:  ${region?.region_name || `ID:${regionId}`}`;
}

// Meghatározzuk, hogy a User-nek tartalmaznia kell a user_duties tömböt is
type UserWithDuties = User & {
	user_duties: UserDuty[];
};

// Segédfüggvény a tisztségek szöveges megjelenítéséhez
export const getDutyObjects = (user: UserWithDuties, regions: any[]) => {
	if (!user.user_duties || user.user_duties.length === 0) return [];

	// Csoportosítunk típus szerint
	const grouped = new Map<string, string[]>();

	user.user_duties.forEach((duty) => {
		if (!grouped.has(duty.type)) {
			grouped.set(duty.type, []);
		}

		const group = grouped.get(duty.type)!;
		const area =
			regions?.find((r) => r.region_id === duty.region_id)?.region_name || 'Ismeretlen';
		const levelName =
			(Object.keys(DUTY_LEVELS) as Array<keyof typeof DUTY_LEVELS>).find(
				(key) => DUTY_LEVELS[key] === duty.level
			) || 'Ismeretlen';

		// Formázás típus szerint
		if (duty.type === 'DIRECTOR') {
			if (!group.includes(levelName)) group.push(levelName);
		} else if (duty.type === 'SUPERIOR') {
			if (!group.includes(area)) group.push(area);
		} else {
			// USER esetén: "BASIC: Közép-Dunántúl" páros
			group.push(`${levelName}: ${area}`);
		}
	});

	// Az eredménytömb összeállítása
	return Array.from(grouped.entries()).map(([type, list]) => {
		if (type === 'USER') {
			// USER esetén a szint (level) száma szerint rendezünk
			list.sort((a, b) => {
				// Kikeressük a szintet a string elejéről (pl. "BASIC: Budapest" -> "BASIC")
				const levelA = a.split(':')[0] as keyof typeof DUTY_LEVELS;
				const levelB = b.split(':')[0] as keyof typeof DUTY_LEVELS;

				// A DUTY_LEVELS-ben lévő számok alapján hasonlítjuk össze (1, 2, 3...)
				return DUTY_LEVELS[levelA] - DUTY_LEVELS[levelB];
			});
		} else {
			// DIRECTOR és SUPERIOR esetén marad a sima ABC sorrend
			list.sort((a, b) => a.localeCompare(b, 'hu'));
		}

		return {
			type,
			fullText: list.join(' / ')
		};
	});
};

export const schType = [
	'ÁLTALÁNOS ISKOLA',
	'GIMNÁZIUM',
	'SZAKGIMNÁZIUM',
	'SZAKKÖZÉPISKOLA',
	'SZAKISKOLA',
	'TECHNIKUM',
	'SZAKKÉPZŐ ISKOLA',
	'ALAPFOKÚ MŰVÉSZETOKTATÁS',
	'MŰVÉSZETI OKTATÁS',
	'KÉSZSÉGFEJLESZTÉS',
	'FEJLESZTŐ NEVELÉS-OKTATÁS',
	'KIEGÉSZÍTŐ NEMZETISÉGI NYELVOKTATÁS',
	'KOLLÉGIUM',
	'HÍDPROGRAMOK',
	'NEM BESOROLT'
] as const;

export const semester = ['ALL', 'SPRING', 'FALL'] as const;

export const LEVEL_LABELS = [
	"", 					// 0
	"BASIC",      // 1
	"MEDIOR",     // 2
	"HIGH",       // 3
	"SUPERIOR",   // 4
	"DIRECTOR"    // 5
];

export const DUTY_LEVELS = {
	BASIC: 1,
	MEDIOR: 2,
	HIGH: 3,
	SUPERIOR: 4,
	DIRECTOR: 5
} as const;

export const SEMESTERS = {
	SPRING: 1,
	FALL: 2
} as const;

export const SCHOOL_TYPES = [
	{ id: 1, label: 'ÁLTALÁNOS ISKOLA' },
	{ id: 2, label: 'GIMNÁZIUM' },
	{ id: 3, label: 'SZAKGIMNÁZIUM' },
	{ id: 4, label: 'SZAKKÖZÉPISKOLA' },
	{ id: 5, label: 'SZAKISKOLA' },
	{ id: 6, label: 'TECHNIKUM' },
	{ id: 7, label: 'SZAKKÉPZŐ ISKOLA' },
	{ id: 8, label: 'ALAPFOKÚ MŰVÉSZETOKTATÁS' },
	{ id: 9, label: 'MŰVÉSZETI OKTATÁS' },
	{ id: 10, label: 'KÉSZSÉGFEJLESZTÉS' },
	{ id: 11, label: 'FEJLESZTŐ NEVELÉS-OKTATÁS' },
	{ id: 12, label: 'KIEGÉSZÍTŐ NEMZETISÉGI NYELVOKTATÁS' },
	{ id: 13, label: 'KOLLÉGIUM' },
	{ id: 14, label: 'HÍDPROGRAMOK' },
	{ id: 15, label: 'NEM BESOROLT' }
] as const;

export const getSchoolTypeLabels = (schoolTypeIds: number[]): string => {
	if (!schoolTypeIds || !Array.isArray(schoolTypeIds)) return '';

	return SCHOOL_TYPES
		.filter(type => schoolTypeIds.includes(type.id))
		.map(type => type.label)
		.join(', ');
};

export const DUTY_MAP = [
	{ id: 1, name: 'BASIC' },
	{ id: 2, name: 'MEDIOR' },
	{ id: 3, name: 'HIGH' }
] as const;

export const DUTY_TYPES = [
	{ id: 'ALL', name: 'ALL' },
	{ id: 1, name: 'BASIC' },
	{ id: 2, name: 'MEDIOR' },
	{ id: 3, name: 'HIGH' }
] as const;

export const getDutyLevelLabels = (dutyIds: number[]): string => {
	if (!dutyIds || !Array.isArray(dutyIds)) return '';

	return DUTY_TYPES
		.filter(duty => typeof duty.id === 'number' && dutyIds.includes(duty.id))
		.map(duty => duty.name)
		.join(', ');
};

export const EVENT_MAP = [
	{ id: 1, name: 'PRESENTATION' },
	{ id: 2, name: 'OPEN DAY' },
	{ id: 3, name: 'BY PHONE' },
	{ id: 4, name: 'BY EMAIL' },
	{ id: 5, name: 'TV *' },
	{ id: 6, name: 'RADIO *' },
	{ id: 7, name: 'ONLINE *' },
	{ id: 8, name: 'MEDIOR LEAFLET' },
	{ id: 9, name: 'CORPORATE EVENT' },
	{ id: 10, name: 'ELSE *' }
] as const;

export const STATUS_MAP = [
	{ id: 1, name: 'ADMITTED' },
	{ id: 2, name: 'REJECTED' },
	{ id: 3, name: 'IN PROGRESS' }
] as const;

export const CHANNEL_MAP = [
	{ id: 1, name: 'SCHOOL PRESENTATION' },
	{ id: 2, name: 'FAMILY' },
	{ id: 3, name: 'TEACHER' },
	{ id: 4, name: 'FRIENDS' },
	{ id: 5, name: 'CMM MEMBER' },
	{ id: 6, name: 'CHLC' }, // OKTV
	{ id: 7, name: 'HIGH' },
	{ id: 8, name: 'FACEBOOK' },
	{ id: 9, name: 'ONLINE PUBLICITY' },
	{ id: 10, name: 'ONLINE ARTICLE' }
] as const;

export const GRADE_MAP = [
	{ id: 1, name: 'PREPARATORY' },
	{ id: 2, name: 'CLASS 9' },
	{ id: 3, name: 'CLASS 10' },
	{ id: 4, name: 'CLASS 11' },
	{ id: 5, name: 'CLASS 12' }
] as const;

export const SUBJECT_MAP = [
	{ id: 1, name: 'ART' },
	{ id: 2, name: 'BUSINESS' },
	{ id: 3, name: 'CLIMATE CHANGE' },
	{ id: 4, name: 'CULTURE' },
	{ id: 5, name: 'ECONOMICS' },
	{ id: 6, name: 'ENVIRONMENTAL PROTECTION' }, // OKTV
	{ id: 7, name: 'MEDIA' },
	{ id: 8, name: 'PHILOSOPHY' },
	{ id: 9, name: 'POLITICS' },
	{ id: 10, name: 'SCIENCE' },
	{ id: 11, name: 'SOCIETY' },
	{ id: 12, name: 'SPORT' },
	{ id: 13, name: 'TECHNOLOGY' },
	{ id: 14, name: 'ELSE*' }
] as const;

export const getName = (list: readonly any[], id: number | null | undefined): string => {
	if (!list || id === null || id === undefined) return 'Nincs megadva';

	const found = list.find(item => item.id === id);

	return found ? found.name : String(id);
};

export const eyeOpen = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
export const eyeClosed = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
