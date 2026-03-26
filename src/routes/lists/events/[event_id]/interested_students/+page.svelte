<script>
	import { enhance } from '$app/forms';
	import { channelMap, gradeMap, statusMap, subjectMap } from '../../../../stores/dataStore.js';

	let isInput = $state(true);

	function handleCancel() {
		history.back();
	}

	function toggleIsInput() {
		isInput = !isInput;
	}

	let { data } = $props();

	let pageName = 'Interested Students Register';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div class="grid">
	<div class="rei">
		<p class="black">Interested Students Register</p>
	</div>
	<p class="black">{data.event.event_name}</p>
	<form action="?/interested" method="post" use:enhance>
		<div>
			<label for="number">Number of Students</label>
			<input type="number" name="number" id="number" required />
		</div>
		<div>
			<label for="country">Country</label>
			<select name="country" id="country">
				{#each data.countries as country}
					<option value={country.country_id} selected={country.country_id === data.schoolCountry}
						>{country.country_name}</option
					>
				{/each}
			</select>
		</div>
		<div>
			<label for="grade">Grade</label>
			<select name="grade" id="grade" class="hidden-textbox">
				{#each gradeMap as grade (grade.id)}
					<option value={grade.id}>{grade.name}</option>
				{/each}
			</select>
		</div>
		<div>
			<label for="connect">Connected by / Region</label>
			<select name="connect" id="connect">
				{#each data.regions as region}
					<option value={region.region_id} selected={region.region_id === data.schoolRegion}
						>{region.region_name}</option
					>
				{/each}
			</select>
		</div>
		<div>
			<label for="channel">Channeled by</label>
			<select name="channel" id="channel" class="hidden-textbox">
				{#each channelMap as channel (channel.id)}
					<option value={channel.id}>{channel.name}</option>
				{/each}
			</select>
		</div>
		<button
			type="button"
			onclick={toggleIsInput}
			class="btn btn-cancel"
			class:active-color={!isInput}>Apply</button
		>
		<input type="hidden" name="apply" value={isInput} />
		<fieldset disabled={isInput}>
			<div>
				<label for="subject">Subject</label>
				<select name="subject" id="subject" class="hidden-textbox">
					{#each subjectMap as subject (subject.id)}
						<option value={subject.id}>{subject.name}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="status">Status</label>
				<select name="status" id="status" class="hidden-textbox">
					{#each statusMap as status (status.id)}
						<option value={status.id}>{status.name}</option>
					{/each}
				</select>
			</div>
			<br />
		</fieldset>
		<button class="btn" id="btn" type="submit">Register</button>
		<button class="btn btn-cancel" id="cancel" type="button" onclick={handleCancel}>
			Cancel ❖ Jump Back
		</button>
	</form>
</div>

<style>
	.active-color {
		background-color: #32bea6;
		color: white;
	}
</style>
