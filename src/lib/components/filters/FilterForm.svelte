<script lang="ts">
	import { duty, semester } from '../../../routes/stores/dataStore';

	let { data, onFilter } = $props();

	// Belső állapotok (Rúnák) - Leváltjuk a Store-okat belső állapotra a komponensen belül
	let selectedYear = $state('ALL');
	let selectedSemester = $state('ALL');
	let selectedDuty = $state('ALL');
	let selectedCountry = $state('ALL');
	let selectedRegion = $state('ALL');

	function handleSubmit(event: Event) {
		event.preventDefault();

		// 2. Itt küldjük vissza az adatokat a szülőnek!
		onFilter({
			selectedYear,
			selectedSemester,
			selectedDuty,
			selectedCountry,
			selectedRegion
		});
	}
</script>

<form onsubmit={handleSubmit} id="top" class="width-25">
	<div>
		<label for="year"><i>Select </i> Event Year</label>
		<select bind:value={selectedYear} name="year" id="year" class="hidden-textbox">
			<option value="ALL">ALL</option>
			{#each data.distinctYears as year}
				<option value={year}>{year} </option>
			{/each}
		</select>
	</div>

	<div>
		<label for="semester"><i>Select </i> Event Semester</label>
		<select bind:value={selectedSemester} name="semester" id="semester" class="hidden-textbox">
			{#each semester as sem}
				<option value={sem}>{sem} </option>
			{/each}
		</select>
	</div>

	<div>
		<label for="duty"><i>Select </i> Event Duty</label>
		<select bind:value={selectedDuty} name="duty" id="duty" class="hidden-textbox">
			{#each duty as d}
				<option value={d.id}>{d.name} </option>
			{/each}
		</select>
	</div>

	<div>
		<label for="country"><i>Select </i> School Country</label>
		<select bind:value={selectedCountry} name="country" id="country" class="hidden-textbox">
			<option value="ALL">ALL</option>
			{#each data.distinctCountries as country}
				{#if country.country_id}
					<option value={country.country_id}>{country.country_name}</option>
				{/if}
			{/each}
		</select>
	</div>

	<div>
		<label for="region"><i>Select </i> School Region</label>
		<select bind:value={selectedRegion} name="region" id="region" class="hidden-textbox">
			<option value="ALL">ALL</option>
			{#each data.distictRegions as reg}
				{#if reg.region_id}
					<option value={reg.region_id}>{reg.region_name}</option>
				{/if}
			{/each}
		</select>
	</div>

	<button class="btn" type="submit"> Confirm </button>
</form>

<style>
	i {
		font-weight: 300;
	}

	select {
		border-radius: 100px;
		padding: 8px;
		margin: 10px 0;
		border: 1px solid #ccc;
	}

	label {
		padding-left: 1%;
		font-size: 22px;
		font-weight: 400;
		color: rgb(144, 132, 132);
	}

</style>
