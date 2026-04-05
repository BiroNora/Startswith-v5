<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';

	function handleCancel() {
		history.back();
	}
	let { data } = $props();

	const canBas = $state(data.user?.allowedLevels.includes(1) ?? false);
	const canMed = $state(data.user?.allowedLevels.includes(2) ?? false);
	const canHigh = $state(data.user?.allowedLevels.includes(3) ?? false);

	let yesB = $state(canBas),
		yesM = $state(canMed),
		yesH = $state(canHigh);

	let selRegB = $state(100),
		selRegM = $state(200),
		selRegH = $state(300);

	let submitting = $state(false);

	// A függvényed, amit megbeszéltünk (mindig számot ad vissza)
	function formatRegionValue(num: number, id: number): number {
		if (id < 10) return num * 10 + id;
		return Number(`${num}${id}`);
	}

	let pageName = 'Central Message';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div class="grid">
	<div class="rei">
		<p class="black">Central Message Register</p>
	</div>

	{#if data.user?.isDirector}
		<form
			action="?/dir_message"
			method="post"
			use:enhance={() => {
				submitting = true;
				return async ({ result }) => {
					if (result.type === 'redirect') {
						alert('Üzenet sikeresen elküldve!');
						goto(result.location);
					} else if (result.type === 'error' || result.type === 'failure') {
						submitting = false;
						alert('Hiba történt a küldés során!');
					}
				};
			}}
		>
			<input type="hidden" name="user_id" value={data.user_id} />
			<div>
				<label for="memo">Memo</label>
				<input type="text" name="memo" id="memo" placeholder="Beeing active" required />
			</div>
			<div>
				<label for="meeting-time">Show Message till this Date</label>
				<input
					type="datetime-local"
					id="meeting-time"
					name="meeting-time"
					value="YYYY-MM-DDT00:00"
					min="2021-06-07T00:00"
					max="2060-06-14T00:00"
					required
				/>
			</div>

			{#if canBas}
				<div class="input-group">
					<label class="check-label">
						<input type="checkbox" name="basic" bind:checked={yesB} />
						<span>BASIC</span>
					</label>
					<div class="select-wrapper">
						{#if yesB}
							<select
								name="regB"
								id="sel-B"
								bind:value={selRegB}
								transition:fade={{ duration: 200 }}
							>
								<option value={100}>--- ALL REGIONS ---</option>
								{#each data.regions ?? [] as regio}
									<option value={formatRegionValue(1, regio.region_id)}>{regio.region_name}</option>
								{/each}
							</select>
						{/if}
					</div>
				</div>
			{/if}

			{#if canMed}
				<div class="input-group">
					<label class="check-label">
						<input type="checkbox" name="medior" bind:checked={yesM} />
						<span>MEDIOR</span>
					</label>
					<div class="select-wrapper">
						{#if yesM}
							<select
								name="regM"
								id="sel-M"
								bind:value={selRegM}
								transition:fade={{ duration: 200 }}
							>
								<option value={200}>--- ALL REGIONS ---</option>
								{#each data.regions ?? [] as regio}
									<option value={formatRegionValue(2, regio.region_id)}>{regio.region_name}</option>
								{/each}
							</select>
						{/if}
					</div>
				</div>
			{/if}

			{#if canHigh}
				<div class="input-group">
					<label class="check-label">
						<input type="checkbox" name="high" bind:checked={yesH} />
						<span>HIGH</span>
					</label>
					<div class="select-wrapper">
						{#if yesH}
							<select
								name="regH"
								id="sel-H"
								bind:value={selRegH}
								transition:fade={{ duration: 200 }}
							>
								<option value={300}>--- ALL REGIONS ---</option>
								{#each data.regions ?? [] as regio}
									<option value={formatRegionValue(3, regio.region_id)}>{regio.region_name}</option>
								{/each}
							</select>
						{/if}
					</div>
				</div>
			{/if}

			<label for="message">Message</label>
			<textarea id="message" name="message" rows="4" cols="50"></textarea>

			<button class="btn" id="btn" type="submit"
				>{#if submitting}
					Sending...
				{:else}
					Send Message
				{/if}</button
			>
			<button
				class="btn btn-cancel"
				id="cancel"
				type="button"
				disabled={submitting}
				onclick={handleCancel}
			>
				Cancel ❖ Jump Back
			</button>
		</form>
	{:else}
		<div>
			<p class="black">Sorry, message writing is not possible.</p>
		</div>
	{/if}
</div>

<style>
	select {
		max-width: 100%;
	}
</style>
