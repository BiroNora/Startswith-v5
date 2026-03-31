<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import { LEVEL_LABELS } from '../../stores/dataStore';
	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form: any } = $props();

	// Állapotok
	let email = $state('');
	let name = $state('');

	// Szinkronizáció a backend válaszával
	$effect(() => {
		if (data?.foundUser) {
			name = data.foundUser.name;
			email = data.foundUser.email;
		}
	});

	const sortedDuties = $derived(
		(data?.foundUser?.duties || []).filter(
			(u: any) => u.type === 'SUPERIOR' || u.type === 'DIRECTOR'
		)
	);

	let selectedToDel = $state<number[]>([]); // Itt gyűjtjük a törlendő ID-kat
	let hasSelected = $derived(selectedToDel.length > 0);
</script>

<svelte:head>
	<title>ADMIN</title>
</svelte:head>

<div class="grid">
	<div class="rei">
		<p class="black">ADMIN Account Settings</p>
	</div>

	<form
		method="post"
		action="?/deleteMultipleRoles"
		use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'success') {
					selectedToDel = []; // Törlés után ürítjük a kijelölést
				}
				await update();
			};
		}}
		novalidate
	>
		{#if data.foundUser}
			<div transition:fade>
				<label for="name">Name</label>
				<input type="text" name="name" id="name" bind:value={name} />

				<label for="email">Email</label>
				<input type="hidden" name="userId" value={data.foundUser?.user_id} />
				<input type="email" name="email" id="email" bind:value={email} required />

				<div class="duties-container">
					{#each sortedDuties as u}
						<article class="art-div">
							<div class="art">
								<div>
									{#if u.type === 'SUPERIOR'}
										{u.type}
										<small
											>— {data.regions.find((r) => r.region_id === u.region_id)?.region_name}</small
										>
									{:else if u.type === 'DIRECTOR'}
										<ins>{u.type}</ins>
										<small>— {LEVEL_LABELS[u.level]}</small>
									{/if}
								</div>
								<input type="checkbox" value={u.id} bind:group={selectedToDel} />
							</div>
						</article>
					{:else}
						<p class="black">Nincsenek beosztások</p>
					{/each}
				</div>

				{#if hasSelected}
					<input type="hidden" name="ids" value={selectedToDel.join(',')} />
					<button
						type="submit"
						class="btn btn-danger"
						onclick={(e) =>
							!confirm(`Biztosan törölni akarod ezt a ${selectedToDel.length} beosztást?`) &&
							e.preventDefault()}
					>
						Delete {selectedToDel.length}
						{#if selectedToDel.length === 1}
							item
						{:else}
							items
						{/if}
					</button>
				{:else if form?.success}
					<div class="success-box" transition:fade>
						<p>✅ <strong>Sikeres létrehozás!</strong></p>
						<p>
							A felhasználó új jelszava: <span class="pass-display">{form.generatedPassword}</span>
						</p>
						<small>Másold ki, mert az oldal elhagyása után nem lesz látható!</small>
					</div>
				{:else}
					<button type="button" class="btn btn-cancel" disabled> No Item to Delete </button>
				{/if}
			</div>
		{/if}
	</form>
</div>

<style>
	.btn {
		margin-top: 1rem;
		margin-bottom: 1rem;
	}
</style>
