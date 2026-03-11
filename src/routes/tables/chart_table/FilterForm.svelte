<script lang="ts">
	import { duty, semester } from '../../stores/dataStore';
	import type { PageServerData } from './$types';

	let { data, onFilter } = $props();

	// Belső állapotok (Rúnák) - Leváltjuk a Store-okat belső állapotra a komponensen belül
	let selectedYear = $state('ALL');
	let semesterFilter = $state('ALL');
	let dutyFilter = $state('ALL');
	let selectedCountry = $state('ALL');
	let selectedRegion = $state('ALL');

	let regionIntAdm = $state<any[]>([]);
	let isElementVisible = $state(false);
	let err_mess = $state(false);
	let err_mess1 = $state(false);

	function handleSubmit(event: Event) {
		event.preventDefault();

		// 2. Itt küldjük vissza az adatokat a szülőnek!
		onFilter({
			selectedYear,
			semesterFilter,
			dutyFilter,
			selectedCountry,
			selectedRegion
		});
	}
</script>

<form onsubmit={handleSubmit} id="top">
	<div>
		<label for="year"><i>Select </i> Event Year</label>
		<select bind:value={selectedYear} name="year" id="year" class="hidden-textbox">
			{#each data.distinctYears as year}
				<option value={year}>{year} </option>
			{/each}
		</select>
	</div>

	<div>
		<label for="semester"><i>Select </i> Event Semester</label>
		<select bind:value={semesterFilter} name="semester" id="semester" class="hidden-textbox">
			{#each semester as sem}
				<option value={sem}>{sem} </option>
			{/each}
		</select>
	</div>

	<div>
		<label for="duty"><i>Select </i> Event Duty</label>
		<select bind:value={dutyFilter} name="duty" id="duty" class="hidden-textbox">
			{#each duty as d}
				<option value={d.id}>{d.name} </option>
			{/each}
		</select>
	</div>

	<div>
		<label for="country"><i>Select </i> School Country</label>
		<select bind:value={selectedCountry} name="country" id="country" class="hidden-textbox">
			<option value="ALL">ALL</option>
			{#each data.countries as country}
				<option value={country.country_id}>{country.country_name} </option>
			{/each}
		</select>
	</div>

	<div>
		<label for="region"><i>Select </i> School Region</label>
		<select bind:value={selectedRegion} name="region" id="region" class="hidden-textbox">
			<option value="ALL">ALL</option>
			{#each data.regions as reg}
				<option value={reg.region_id}>{reg.region_name} </option>
			{/each}
		</select>
	</div>

	<button class="btn" id="btn" type="submit"> Confirm </button>
</form>

<style>
	.main {
		padding-left: 0.5%;
		padding-top: 2%;
		padding-right: 0.5%;
	}

	.container {
		display: flex; /* or inline-flex */
		width: 100%;
		flex-direction: row;
		justify-content: space-around;
		gap: 8%;
		padding-top: 2%;
		padding-bottom: 4%;
	}

	.e {
		width: 90%;
		padding-top: 4%;
		padding-bottom: 3%;
		padding-left: 3%;
	}

	.f {
		width: 90%;
	}

	.g {
		width: 90%;
		padding-top: 4%;
		padding-bottom: 3%;
		padding-left: 3%;
	}

	.h {
		padding-left: 2%;
	}

	i {
		font-weight: 300;
	}

	.sticky {
		background-color: rgb(246, 242, 242);
		position: sticky;
		top: 0;
		z-index: 1;
		height: 40px;
		width: 100%;
		padding: 5px;
		color: #32bea6;
	}

	select {
		border-top-left-radius: 100px;
		border-top-right-radius: 100px;
		border-bottom-left-radius: 100px;
		border-bottom-right-radius: 100px;
		width: 25%;
	}

	.select1 {
		border-top-left-radius: 100px;
		border-top-right-radius: 100px;
		border-bottom-left-radius: 100px;
		border-bottom-right-radius: 100px;
	}

	label {
		padding-left: 1%;
		font-size: 22px;
		font-weight: 400;
		color: rgb(144, 132, 132);
	}

	.btn {
		border-top-left-radius: 100px;
		border-top-right-radius: 100px;
		border-bottom-left-radius: 100px;
		border-bottom-right-radius: 100px;
		width: 25%;
		background-color: #32bea6;
	}

	.btn:hover {
		background-color: #11a58c;
	}

	.flower {
		font-size: 140%;
		color: #a0a9a8;
		padding-bottom: 3%;
		text-decoration: none; /* Remove underline */
	}

	.flower:hover {
		font-size: 140%;
		color: #32bea6;
		padding-bottom: 3%;
		text-decoration: none; /* Remove underline */
	}
</style>
