import type { Role, DutyType, UserDuty } from '@prisma/client';

declare global {
	namespace App {
		interface Locals {
			user: {
				user_id: string;
				email: string;
      	name: string;
				phone: string;
				role: Role;
      	duty: UserDuty[];
				serial: number;
				isSuper: boolean;
				isDirector: boolean;
				isSuperior: boolean;
				allowedRegions: number[];
				active: boolean
			} | null;
		}
	}
}

export {};
