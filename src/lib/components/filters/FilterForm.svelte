<script lang="ts">
	import { duty, semester } from '../../../routes/stores/dataStore';

	let { data, onFilter } = $props();

	let selectedYear = $state('ALL');
	let selectedSemester = $state('ALL');
	let selectedDuty = $state('ALL');
	let selectedCountry = $state('ALL');
	let selectedRegion = $state('ALL');

	function handleSubmit(event: Event) {
		event.preventDefault();

		onFilter({
			selectedYear,
			selectedSemester,
			selectedDuty,
			selectedCountry,
			selectedRegion
		});
	}
</script>

<form onsubmit={handleSubmit} id="top" class="width-400">
	<div>
		<label for="year"><i>Select </i> &nbsp;&nbsp;Event Year</label>
		<select bind:value={selectedYear} name="year" id="year" class="hidden-textbox">
			<option value="ALL">ALL</option>
			{#each data.years as year}
				<option value={year}>{year} </option>
			{/each}
		</select>
	</div>

	<div>
		<label for="semester"><i>Select </i> &nbsp;&nbsp;Event Semester</label>
		<select bind:value={selectedSemester} name="semester" id="semester" class="hidden-textbox">
			{#each semester as sem}
				<option value={sem}>{sem} </option>
			{/each}
		</select>
	</div>

	<div>
		<label for="duty"><i>Select </i> &nbsp;&nbsp;Event Duty</label>
		<select bind:value={selectedDuty} name="duty" id="duty" class="hidden-textbox">
			{#each duty as d}
				<option value={d.id}>{d.name} </option>
			{/each}
		</select>
	</div>

	<div>
		<label for="country"><i>Select</i> &nbsp;&nbsp;School Country</label>
		<select bind:value={selectedCountry} name="country" id="country" class="hidden-textbox">
			<option value="ALL">ALL</option>
			{#each data.countries as country}
				{#if country.country_id}
					<option value={country.country_id}>{country.country_name}</option>
				{/if}
			{/each}
		</select>
	</div>

	<div>
		<label for="region"><i>Select </i> &nbsp;&nbsp;School Region</label>
		<select bind:value={selectedRegion} name="region" id="region" class="hidden-textbox">
			<option value="ALL">ALL</option>
			{#each data.regions as reg}
				{#if reg.region_id}
					<option value={reg.region_id}>{reg.region_name}</option>
				{/if}
			{/each}
		</select>
	</div>

	<button class="btn" type="submit"> Confirm </button>
</form>
