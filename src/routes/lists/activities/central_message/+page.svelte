<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';

	function handleCancel() {
		history.back();
	}
	let { data } = $props();

	let yesB = $state(false),
		yesM = $state(false),
		yesH = $state(false);

	let pageName = 'Central Message';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div class="grid">
	<div class="rei">
		<p class="black">Central Message Register</p>
	</div>

	{#if data.dir_flag}
		<form action="?/dir_message" method="post" use:enhance>
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

			<div class="input-group">
				<label class="check-label">
					<input type="checkbox" name="basic" bind:checked={yesB} />
					<span>BASIC</span>
				</label>
				<div class="select-wrapper">
					{#if yesB}
						<select name="regB" id="sel-B" transition:fade={{ duration: 200 }}>
							<option value="100">--- ALL REGIONS ---</option>
							{#each data.regions ?? [] as regio}
								<option value={100 + regio.region_id}>{regio.region_name}</option>
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
						<select name="regM" id="sel-M" transition:fade={{ duration: 200 }}>
							<option value="200">--- ALL REGIONS ---</option>
							{#each data.regions ?? [] as regio}
								<option value={200 + regio.region_id}>{regio.region_name}</option>
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
						<select name="regH" id="sel-H" transition:fade={{ duration: 200 }}>
							<option value="300">--- ALL REGIONS ---</option>
							{#each data.regions ?? [] as regio}
								<option value={300 + regio.region_id}>{regio.region_name}</option>
							{/each}
						</select>
					{/if}
				</div>
			</div>

			<!-- <div>
			 <pre>{JSON.stringify(data.regions, null, 2)}</pre>
				<label for="region">Select Region</label>
				<select name="region" id="region" class="hidden-textbox">
					<option value="ALL">ALL</option>
					{#each data.regio as reg}
						<option value={reg.region_id}>{reg.region_name} </option>
					{/each}
				</select>
			</div> -->

			<label for="message">Message</label>
			<textarea id="message" name="message" rows="4" cols="50"></textarea>

			<button class="btn" id="btn" type="submit">Send Message</button>
			<button class="btn btn-cancel" id="cancel" type="button" onclick={handleCancel}>
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
