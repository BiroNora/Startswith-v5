// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				user_id: string;
				email: string,
      	name: string,
      	duty: number[],
				active: boolean
			} | null;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
