<script lang="ts">
	import { enhance } from '$app/forms';
	import DutyLevelSelector from '$lib/components/DutyLevelSelector.svelte';
	import SchoolTypeSelector from '$lib/components/SchoolTypeSelector.svelte';

	let { data, form } = $props() as { data: any; form: any };

	let selectedSchoolTypes = $state<number[]>([]);
	let selectedDutyIds = $state<number[]>([]);

	let yesCOOP = $state(true);
	let yesACT = $state(true);

	// Az adatok betöltésekor feltöltjük a tömböket
	$effect(() => {
		if (data?.school) {
			const rawDuty = data.school.duty_levels || [];
			const rawTypes = data.school.school_type || [];

			// Számmá alakítjuk, hogy a Selector felismerje (1, 2, 3)
			selectedDutyIds = rawDuty.map(Number);
			selectedSchoolTypes = rawTypes.map(Number);

			yesCOOP = data.school.coop ?? true;
			yesACT = data.school.active ?? true;
		}
	});

	function handleCancel() {
		history.back();
	}
	let pageName = 'School Update';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div class="grid">
	<div class="rei">
		<p>School Update</p>
	</div>
	<br />
	<form action="?/school" method="post" use:enhance>
		<!-- SCOOL INFO -->
		<div class="pad-bot-plus">
			<div>
				<label for="name">School Name</label>
				<input type="text" value={data.school.school_name} name="name" id="name" required />
			</div>
			<div>
				<label for="zip">ZIP Code</label>
				<input type="text" value={data.school.zip_code} name="zip" id="zip" required />
			</div>
			<div>
				<label for="address">Address</label>
				<input type="text" value={data.school.address} name="address" id="address" required />
			</div>
			<div>
				<label for="dirname">Head of School</label>
				<input type="text" value={data.school.dir_name} name="dirname" id="dirname" required />
			</div>
			<div>
				<label for="dirphone">School Phone</label>
				<input type="text" value={data.school.dir_phone} name="dirphone" id="dirphone" required />
			</div>
			<div>
				<label for="email">School Email</label>
				<input type="email" value={data.school.school_email} name="email" id="email" required />
			</div>
			<div>
				<label for="website">Website</label>
				<input type="text" value={data.school.website} name="website" id="website" required />
			</div>
		</div>

		<!-- SCOOL TYPES -->
		<div class="pad-bot-plus">
			<fieldset>
				<legend>School Types</legend>
				<SchoolTypeSelector bind:selectedIds={selectedSchoolTypes} />
			</fieldset>
		</div>

		<!-- DUTY TYPES -->
		<div>
			<DutyLevelSelector bind:selectedLevels={selectedDutyIds} variant="column" />
		</div>
		<br />

		<!-- NOTE & COOP -->
		<fieldset>
			<legend>Note on School</legend>

			<label class="checkbox-container pad-bot-plus">
				<input type="checkbox" name="coop" bind:checked={yesCOOP} />
				<span>COOPERATION</span>
			</label>
			<label class="checkbox-container pad-bot-plus">
				<input type="checkbox" name="active" bind:checked={yesACT} />
				<span>ACTIVE</span>
			</label>

			<textarea id="message" name="note" rows="4" cols="50">{data.school.note}</textarea>
		</fieldset>

		{#if form?.errors}
			<p class="error">Wrong credentials.</p>
		{/if}

		{#if selectedSchoolTypes.length === 0}
			<p class="error">One school type must be chosen.</p>
		{/if}

		{#if selectedDutyIds.length === 0}
			<p class="error">One duty must be chosen.</p>
		{/if}

		<button class="btn" id="btn" type="submit">Update</button>
		<button class="btn btn-cancel" id="cancel" type="button" onclick={handleCancel}>
			Cancel ❖ Jump Back
		</button>
	</form>
</div>
