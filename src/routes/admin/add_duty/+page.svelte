<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import { DUTY_MAP, LEVEL_LABELS } from '../../stores/dataStore';
	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form: any } = $props();

	// Állapotok
	let email = $state('');
	let name = $state('');

	let yesS = $state(false);
	let yesD = $state(false);
	let yesSreg = $state(0);
	let yesDuty = $state('');

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
		use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'failure') {
					// Megkeressük a message-et, amit a szerverről küldtünk
					const errorMsg = result.data?.message || result.data?.error || 'Hiba történt!';
					alert(errorMsg); // BUMM, itt az alert ablak!
					return; // Itt megállunk, nem futtatjuk az update-et
				}
				// 1. Lefuttatja az alapértelmezett frissítést (hogy a 'form' változó megkapja az adatokat)
				await update();

				// 2. Ha sikeres volt a mentés (a szerver success: true-val tért vissza)
				if (result.type === 'success' && result.data?.success) {
					// Állapotok visszaállítása alaphelyzetbe
					yesS = false;
					yesD = false;
					yesSreg = 0;
					yesDuty = '';
				}
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
							</div>
						</article>
					{:else}
						<p class="black">Nincsenek beosztások</p>
					{/each}
				</div>

				{#if !form?.success}
					<div class="input-group">
						<label class="check-label">
							<input type="checkbox" name="isSuperior" bind:checked={yesS} />
							<span>SUPERIOR</span>
						</label>
						{#if yesS}
							<div class="select-wrapper" transition:fade>
								<select name="regS" bind:value={yesSreg}>
									<option value={0} disabled>Válassz régiót...</option>
									{#each data.regions as r}
										<option value={r.region_id}>{r.region_name}</option>
									{/each}
								</select>
							</div>
						{/if}
					</div>

					<div class="input-group">
						<label class="check-label">
							<input type="checkbox" name="isDirector" bind:checked={yesD} />
							<span>DIRECTOR</span>
						</label>
						{#if yesD}
							<div class="select-wrapper" transition:fade>
								<select name="regD" bind:value={yesDuty}>
									<option value="" disabled>Válassz szintet...</option>
									{#each DUTY_MAP as item}
										<option value={item.id}>{item.name}</option>
									{/each}
								</select>
							</div>
						{/if}
					</div>

					<button class="btn" type="submit" formaction="/admin/add_duty?/addRole"
						>Update All Data</button
					>
				{/if}
			</div>
		{/if}
	</form>

	{#if form?.success}
		<div class="success-box" transition:fade>
			<p>✅ <strong>Sikeres létrehozás!</strong></p>
			<p>A felhasználó új jelszava: <span class="pass-display">{form.generatedPassword}</span></p>
			<small>Másold ki, mert az oldal elhagyása után nem lesz látható!</small>
		</div>
	{/if}
</div>
