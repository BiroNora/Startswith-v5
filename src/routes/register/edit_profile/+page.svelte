<script lang="ts">
	import { enhance } from '$app/forms';
	import { dutyMap, eyeClosed, eyeOpen, LEVEL_LABELS } from '../../stores/dataStore';
	import type { ActionData, PageData } from './$types';
	import { fade } from 'svelte/transition';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showPassword = $state(false);

	let showDelModal = $state(false);
	let showAddModal = $state(false);
	let selectedDutyId = $state<number | null>(null);
	let isInput = $state(true);

	function confirmDelete(id: number) {
		selectedDutyId = id;
		showDelModal = true;
	}

	function toggleIsInput() {
		isInput = !isInput;
	}

	// REAKTÍV ALAPOK: Ha a data frissül, ezek is frissülnek

	let pageName = 'Edit Profile';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div class="grid">
	<div class="rei">
		<p class="black">Account Settings</p>
	</div>
	<br />
	<form action="?/user" method="post" use:enhance>
		<div>
			<label for="name">Name</label>
			<input type="text" name="name" id="name" value={data.user?.name} required />
		</div>
		<div>
			<label for="phone">Phone</label>
			<input type="text" name="phone" id="phone" value={data.user?.phone} required />
		</div>

		<div>
			<label for="password1">Password</label>
			<div class="password-wrapper">
				<input id="password1" name="password1" type={showPassword ? 'text' : 'password'} required />
				<button
					type="button"
					class="eye-toggle"
					onclick={() => (showPassword = !showPassword)}
					tabindex="-1"
				>
					{@html showPassword ? eyeOpen : eyeClosed}
				</button>
			</div>
		</div>
		<div>
			<label for="password2">Confirm Password</label>
			<div class="password-wrapper">
				<input id="password2" name="password2" type={showPassword ? 'text' : 'password'} required />
				<button
					type="button"
					class="eye-toggle"
					onclick={() => (showPassword = !showPassword)}
					tabindex="-1"
				>
					{@html showPassword ? eyeOpen : eyeClosed}
				</button>
			</div>
		</div>

		{#if form?.invalid}
			<p class="error">Confirm password.</p>
		{/if}

		{#if form?.passw}
			<p class="error">
				Password must be at least 8 characters long, must include at least one lowercase and
				uppercase letter, and at least one numeric digit and at least one special character (such as
				!, @, #, $, %, ^, &, *).
			</p>
		{/if}

		<button class="btn" id="btn" type="submit">Update</button>
	</form>
</div>

{#if showDelModal}
	<dialog open>
		<article>
			<header>
				<a href="#close" aria-label="Close" class="close" onclick={() => (showDelModal = false)}
				></a>
				<h5>Confirm Deletion</h5>
			</header>
			<form action="?/delRole" method="post" use:enhance>
				<input type="hidden" name="dutyId" value={selectedDutyId} />
				<div>
					<h6>Az esemény adatai véglegesen törlődnek.</h6>
					<footer>
						<button type="submit" class="btn" data-target="modal-example"> Confirm </button>
						<button
							type="button"
							class="btn btn-cancel btn-outline"
							data-target="modal-example"
							onclick={() => (showDelModal = false)}
						>
							Cancel
						</button>
					</footer>
				</div>
			</form>
		</article>
	</dialog>
{/if}

{#if showAddModal}
	<dialog open>
		<article>
			<header>
				<h5>Add New Duty</h5>
			</header>

			<form
				action="?/addRole"
				method="post"
				use:enhance={() => {
					// Ez fut le a kérés INDÍTÁSAKOR
					return async ({ result, update }) => {
						// Ez fut le, ha a SZERVER VÁLASZOLT
						if (result.type === 'success' || result.type === 'redirect') {
							showAddModal = false; // Csak siker esetén zárjuk be
							if (!isInput) toggleIsInput(); // Szín visszaállítása
						}
						await update();
					};
				}}
			>
				<label for="new_level">Level</label>
				<select name="level" id="new_level" required>
					<option value="1">{LEVEL_LABELS[1]}</option>
					<option value="2">{LEVEL_LABELS[2]}</option>
					<option value="3">{LEVEL_LABELS[3]}</option>
				</select>

				<label for="new_region">Region</label>
				<select name="region_id" id="new_region" required>
					<option value="" disabled selected>Select a region...</option>
					{#each data.regions as r}
						<option value={r.region_id}>{r.region_name}</option>
					{/each}
				</select>

				<footer>
					<button type="submit" class="btn" formnovalidate>Add Duty</button>
					<button type="button" class="btn btn-cancel" onclick={() => (showAddModal = false)}
						>Cancel</button
					>
				</footer>
			</form>
		</article>
	</dialog>
{/if}

<style>
	.a {
		color: #32bea6;
		font-weight: bolder;
	}

	.b {
		color: #141717;
		font-weight: normal;
	}

	.active-color {
		background-color: #32bea6;
		color: white;
	}
</style>
