<script lang="ts">
	import { duty, statusMap } from '../../stores/dataStore'; // Szükség lesz rá a chartnál
	import FilterForm from './FilterForm.svelte';
	let { data } = $props();

	// Ezek a reaktív változók a "gazdák"
	let selYear = $state('');
	let selSemest = $state('');
	let selDuty = $state<any>(null);
	let selCountry = $state<any>(null);
	let selRegion = $state<any>(null);
	let isElementVisible = $state(false);

	let err_mess = $state(false);
	let err_mess1 = $state(false);

	interface FilterCriteria {
		selectedYear: string;
		semesterFilter: string;
		dutyFilter: any;
		selectedCountry: any;
		selectedRegion: any;
	}

	function handleFilterUpdate(filters: FilterCriteria) {
		// 1. Frissítjük a Sticky sáv adatait
		selYear = filters.selectedYear;
		selSemest = filters.semesterFilter;
		selDuty = filters.dutyFilter;
		selCountry = filters.selectedCountry;
		selRegion = filters.selectedRegion;

		// 2. Megjelenítjük a sávot
		isElementVisible = true;

		err_mess = false;
		err_mess1 = false;

		console.log('Fetching with:', filters);

		// 2. Ez a függvény "kapja el" a Form adatait és küldi a serverre
		function handleFilterUpdate(filters: any) {
			// Itt rendeljük hozzá a Form értékeit a főoldal változóihoz
			selYear = filters.selectedYear;
			selSemest = filters.semesterFilter;
			selDuty = filters.dutyFilter;
			selCountry = filters.selectedCountry;
			selRegion = filters.selectedRegion;

			isElementVisible = true; // Megjelenítjük a szalagot

			console.log('Megérkeztek az adatok a Formból:', filters);

			// INNEN INDÍTHATOD MAJD A FETCH-ET AZ SQL FELÉ
		}
	}

	let pageName = 'CHART_TABLE';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div class="main">
	<hgroup>
		<h1>Chart Tables* of Events** and Interested Students</h1>
		<i>&emsp;*Events only with active and cooperative schools</i>
		<br />
		<i>&emsp;**Semesters: Spring — months between the 3th & 9th months inclusive; Autumn — others</i
		>
	</hgroup>
	<br />

	<FilterForm {data} onFilter={handleFilterUpdate} />
	<!--<div class="response-data">
		<pre>{responseDataFormatted}</pre>
	</div>-->

	{#if isElementVisible}
		<div class="sticky select1" id="stickyLine">
			<i class="h">Event Year: </i>{selYear} &nbsp;&nbsp;
			<i>Event Semester: </i>{selSemest} &nbsp;&nbsp;

			<i>Event Duty: </i>
			{#each duty as item}
				{#if selDuty === item.id}{item.name}{/if}
			{/each}
			&nbsp;&nbsp;

			<i>School Country: </i>
			{#if selCountry === 'ALL'}
				ALL
			{:else}
				{#each data.countries as country}
					{#if selCountry === country.country_id}{country.country_name}{/if}
				{/each}
			{/if}
			&nbsp;&nbsp;

			<i>School Region: </i>
			{#if selRegion === 'ALL'}
				ALL
			{:else}
				{#each data.regions as reg}
					{#if selRegion === reg.region_id}{reg.region_name}{/if}
				{/each}
			{/if}
		</div>
	{/if}
	{#if err_mess}
		<div class="container error-box">
			<p><i>Something went wrong. Please try it later.</i></p>
		</div>
	{:else if err_mess1}
		<div class="container warning-box">
			<p><i>No data available.</i></p>
		</div>
	{/if}

	<div class="e" style="margin-bottom: 3rem;">
		<canvas id="chartCanvas1" />
	</div>
	<div class="container" style="margin-bottom: 3rem;">
		<div class="f">
			<canvas id="chartCanvas2" />
		</div>
		<div class="f">
			<canvas id="chartCanvas3" />
		</div>
	</div>
	<div class="container" style="margin-bottom: 3rem;">
		<div class="f">
			<canvas id="chartCanvas4" />
		</div>
		<div class="f">
			<canvas id="chartCanvas5" />
		</div>
	</div>
	<div class="g" style="margin-bottom: 3rem;">
		<canvas id="chartCanvas6" />
	</div>
	<div class="e" style="margin-bottom: 3rem;">
		<canvas id="chartCanvas7" />
	</div>
	<a href="#top" class="flower">&#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046</a>
</div>

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
