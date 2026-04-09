<script lang="ts">
	import { enhance } from '$app/forms';
	import { LEVEL_LABELS } from '../../stores/dataStore';
	import type { ActionData, PageData } from './$types';

	let { data }: { data: PageData; form: ActionData } = $props();

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

	const sortedDuties = $derived(
		[...(data.user?.duty || [])].sort((a, b) => {
			const typeOrder: Record<string, number> = {
				USER: 1,
				SUPERIOR: 2,
				DIRECTOR: 3
			};

			const weightA = typeOrder[a.type] || 99;
			const weightB = typeOrder[b.type] || 99;

			// 1. Ha különböző a típus (pl. USER vs SUPERIOR), a súly dönt
			if (weightA !== weightB) {
				return weightA - weightB;
			}

			// 2. Ha azonos a típus (mindkettő USER), akkor a level (1, 2, 3) dönt
			return a.level - b.level;
		})
	);

	let pageName = 'Edit Duty Settings';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div class="grid">
	<div class="rei">
		<p class="black">Duty Settings</p>
	</div>
	
	<form action="?/user" method="post" use:enhance>
		<div class="duties-container">
			{#each sortedDuties as u}
				<article class="art-div">
					<div class="art">
						<div>
							{#if u.type === 'USER'}
								<div class="a">
									{LEVEL_LABELS[u.level]}
									<small class="b"
										>— {data.regions.find((r) => r.region_id === u.region_id)?.region_name}</small
									>
								</div>
							{:else if u.type === 'SUPERIOR'}
								{u.type}
								<small>— {data.regions.find((r) => r.region_id === u.region_id)?.region_name}</small
								>
							{:else if u.type === 'DIRECTOR'}
								<ins>{u.type}</ins>
								<small>— {LEVEL_LABELS[u.level]}</small>
							{/if}
						</div>

						{#if u.type === 'USER' && u.level <= 3}
							<button type="button" class="outline art-btn" onclick={() => confirmDelete(u.id)}>
								<div class="x-icon">x</div>
							</button>
						{/if}
					</div>
				</article>
			{:else}
				<p class="black">Nincsenek beosztások</p>
			{/each}
		</div>

		<div class="pad">
			<button
				type="button"
				onclick={() => {
					toggleIsInput();
					showAddModal = true;
				}}
				class="btn btn-cancel"
				class:active-color={!isInput}>+ Add New Duty</button
			>
		</div>
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
			<form
				action="?/delRole"
				method="post"
				use:enhance={() => {
					// Kérés indításakor
					return async ({ result, update }) => {
						// Ha a szerver sikeresen törölt vagy átirányított
						if (result.type === 'success' || result.type === 'redirect') {
							showDelModal = false; // Itt zárjuk be a modalt kézzel
						}
						await update(); // Frissíti a data-t (és így a sortedDuties listát)
					};
				}}
			>
				<input type="hidden" name="dutyId" value={selectedDutyId} />
				<div>
					<h6>Az adatok véglegesen törlődnek.</h6>
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
</style>
