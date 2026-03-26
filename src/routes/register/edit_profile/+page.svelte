<script lang="ts">
	import { enhance } from '$app/forms';
	import { dutyMap, eyeClosed, eyeOpen } from '../../stores/dataStore';
	import type { ActionData, PageData } from './$types';
	import { fade } from 'svelte/transition';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showPassword = $state(false);

	// REAKTÍV ALAPOK: Ha a data frissül, ezek is frissülnek
	let onDutyArray = $derived(
		(data.user?.on_duty ?? [])
			.filter((n: any) => !(n.toString().length === 2 && n % 10 === 0))
			.map((num) => num.toString())
	);

	// Form állapotok
	let yesB = $state(false),
		yesM = $state(false),
		yesH = $state(false),
		yesS = $state(false),
		yesD = $state(false);

	let yesBreg = $state(0),
		yesMreg = $state(0),
		yesHreg = $state(0),
		yesSreg = $state(0),
		yesDuty = $state('');

	$effect(() => {
		if (data.user && data.regions) {
			// Alaphelyzetbe állítás frissüléskor
			yesB = false;
			yesM = false;
			yesH = false;
			yesS = false;
			yesD = false;

			onDutyArray.forEach((val) => {
				const type = val.charAt(0);
				const regId = Number(val.slice(1));

				if (type === '1') {
					yesB = true;
					yesBreg = regId;
				}
				if (type === '2') {
					yesM = true;
					yesMreg = regId;
				}
				if (type === '3') {
					yesH = true;
					yesHreg = regId;
				}
				if (type === '4') {
					yesS = true;
					yesSreg = regId;
				}
				if (type === '5') {
					yesD = true;
					yesDuty = val.slice(1);
				}
			});
		}
	});
	
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
			<input type="text" name="name" id="name" value={data.user?.user_name} required />
		</div>
		<div>
			<label for="nationality">Nationality</label>
			<input
				type="text"
				name="nationality"
				id="nationality"
				value={data.user?.nationality}
				required
			/>
		</div>
		<div>
			<label for="phone">Phone</label>
			<input type="text" name="phone" id="phone" value={data.user?.user_phone} required />
		</div>

		<div class="input-group">
			<label class="check-label">
				<input type="checkbox" name="basic" bind:checked={yesB} />
				<span>BASIC</span>
			</label>
			<div class="select-wrapper">
				{#if yesB}
					<select bind:value={yesBreg} name="regB" id="sel-B" transition:fade={{ duration: 200 }}>
						{#each data.regions ?? [] as regio}
							<option value={regio.region_id}>{regio.region_name}</option>
						{/each}
					</select>
				{/if}
			</div>
		</div>

		<div class="input-group">
			<label class="check-label">
				<input type="checkbox" name="medior" bind:checked={yesM} />
				<span>MEDIOR</span>
			</label>
			<div class="select-wrapper">
				{#if yesM}
					<select bind:value={yesMreg} name="regM" id="sel-M" transition:fade={{ duration: 200 }}>
						{#each data.regions ?? [] as regio}
							<option value={regio.region_id}>{regio.region_name}</option>
						{/each}
					</select>
				{/if}
			</div>
		</div>

		<div class="input-group">
			<label class="check-label">
				<input type="checkbox" name="high" bind:checked={yesH} />
				<span>HIGH</span>
			</label>
			<div class="select-wrapper">
				{#if yesH}
					<select bind:value={yesHreg} name="regH" id="sel-H" transition:fade={{ duration: 200 }}>
						{#each data.regions ?? [] as regio}
							<option value={regio.region_id}>{regio.region_name}</option>
						{/each}
					</select>
				{/if}
			</div>
		</div>

		<div class="input-group">
			<label class="check-label">
				<input type="checkbox" name="superior" bind:checked={yesS} />
				<span>SUPERIOR</span>
			</label>
			<div class="select-wrapper">
				{#if yesS}
					<select bind:value={yesSreg} name="regS" id="sel-S" transition:fade={{ duration: 200 }}>
						{#each data.regions ?? [] as regio}
							<option value={regio.region_id}>{regio.region_name}</option>
						{/each}
					</select>
				{/if}
			</div>
		</div>

		<div class="input-group">
			<label class="check-label">
				<input type="checkbox" name="director" bind:checked={yesD} />
				<span>DIRECTOR</span>
			</label>
			<div class="select-wrapper">
				{#if yesD}
					<select bind:value={yesDuty} name="regD" id="sel-D" transition:fade={{ duration: 200 }}>
						{#each dutyMap as item (item.id)}
							<option value={item.id}>{item.name}</option>
						{/each}
					</select>
				{/if}
			</div>
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

		{#if form?.regions}
			<p class="error">One duty must be choosen.</p>
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

<style>
	.input-group {
		display: flex;
		flex-direction: row; /* Alapértelmezetten egymás mellett */
		align-items: center;
		height: 2.5rem !important;
		padding: 0 1rem !important;
		gap: 10px;
		margin-bottom: 5px;
	}

	.check-label {
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 160px;
		cursor: pointer;
	}

	select {
		max-width: 100%;
	}

	/* A select konténere, ami kitölti a maradék helyet */
	.select-wrapper {
		flex-grow: 1;
		display: flex;
		align-items: center;
	}
</style>
