<script lang="ts">
	import { duty } from '../../stores/dataStore';
	import {
		mapChannelData,
		mapCountryStatusData,
		mapGradeData,
		mapRegionData,
		mapSubjectData,
		type ChartDataDatasets,
		type ChartDataSimple
	} from '$lib/components/chartMappers';

	import FilterForm from './FilterForm.svelte';
	import GenericChart from '$lib/components/GenericChart.svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let pageName = 'CHART_TABLE';

	// Sticky line rúnák
	let selYear = $state('');
	let selSemest = $state('');
	let selDuty = $state('ALL');
	let selRegion = $state('ALL');
	let selCountry = $state('ALL');
	const countriesArray = $derived(data.distinctCountries || []);
	const regionsArray = $derived(data.distictRegions || []);

	const selectedCountryObj = $derived(
		countriesArray.find((c) => c.country_id === Number(selCountry))
	);
	const selectedRegionObj = $derived(regionsArray.find((r) => r.region_id === Number(selRegion)));
	let isElementVisible = $state(false);

	let err_mess = $state(false);
	let err_mess1 = $state(false);

	// Chart rúnák
	let chart1Data = $state<ChartDataDatasets>({
		labels: [],
		datasets: []
	});

	let chart2Data = $state<ChartDataSimple>({
		labels: [],
		data: [],
		colors: []
	});

	let chart3Data = $state<ChartDataSimple>({
		labels: [],
		data: [],
		colors: []
	});

	let chart4Data = $state<ChartDataSimple>({
		labels: [],
		data: [],
		colors: []
	});

	let chart5Data = $state<ChartDataSimple>({
		labels: [],
		data: [],
		colors: []
	});

	let chart6Data = $state<ChartDataDatasets>({
		labels: [],
		datasets: []
	});

	let chart7Data = $state<ChartDataDatasets>({
		labels: [],
		datasets: []
	});

	interface FilterCriteria {
		selectedYear: string;
		selectedSemester: string;
		selectedDuty: any;
		selectedCountry: any;
		selectedRegion: any;
	}

	// ASYNC FUNCTION
	async function handleFilterUpdate(filters: FilterCriteria) {
		// Frissítjük a Sticky sáv adatait
		selYear = filters.selectedYear;
		selSemest = filters.selectedSemester || 'ALL';
		selDuty = filters.selectedDuty || 'ALL';
		selCountry = filters.selectedCountry;
		selRegion = filters.selectedRegion;
		// Megjelenítés
		isElementVisible = true;
		err_mess = false;
		err_mess1 = false;

		// Server adatok konvertálása (csak akkor konvertálunk számra, ha nem 'ALL')
		const cleanFilters = {
			selectedSemester: filters.selectedSemester,
			selectedYear: filters.selectedYear === 'ALL' ? null : Number(filters.selectedYear),
			selectedDuty: filters.selectedDuty,
			selectedCountry: filters.selectedCountry === 'ALL' ? null : Number(filters.selectedCountry),
			selectedRegion: filters.selectedRegion === 'ALL' ? null : Number(filters.selectedRegion)
		};

		console.log('Ez megy a szerverre:', cleanFilters);

		try {
			const response = await fetch('/tables/chart_table', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(cleanFilters)
			});

			if (!response.ok) throw new Error('Szerver hiba');

			const result = await response.json();
			console.log('A SZERVER ILYEN ADATOKAT KÜLDÖTT:', result);

			console.log(
				'%c >>> SZERVER VÁLASZA MEGÉRKEZETT <<<',
				'color: blue; font-size: 15px; font-weight: bold;'
			);
			console.log('A kapott objektum kulcsai:', Object.keys(result));
			console.log('Adatok táblázatosan:');
			console.table(result.statusCountry); // Ez a leglátványosabb!
			console.dir(result); // Itt a teljes fa struktúra

			// --- Chart 1: Országos statisztika (Bar) ---
			if (result.statusCountry) {
				chart1Data = mapCountryStatusData(result.statusCountry);
			}

			// --- Chart 2: Grade (Interested) ---
			if (result.statusGrade) {
				chart2Data = mapGradeData(result.statusGrade);
			}

			// --- Chart 3: Grade (Admitted) ---
			if (result.admittedGrade) {
				chart3Data = mapGradeData(result.admittedGrade);
			}

			// --- Chart 4: Subject (Interested) ---
			if (result.subjectIntrest) {
				chart4Data = mapSubjectData(result.subjectIntrest);
			}

			// --- Chart 5: Subject (Admitted) ---
			if (result.subjectAdmitted) {
				chart5Data = mapSubjectData(result.subjectAdmitted);
			}

			// --- Chart 6: Region (Bar) ---
			if (result.regionIntrest)
				chart6Data = mapRegionData(result.regionIntrest, result.regionAdmitted);

			// --- Chart 7: Channel (Bar) ---
			if (result.channelIntrest)
				chart7Data = mapChannelData(result.channelIntrest, result.channelAdmitted);

			if (chart1Data.labels.length === 0) {
				err_mess1 = true;
			}
		} catch (error) {
			err_mess = true;
			console.error('Hiba történt:', error);
		}
	}
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

	{#if isElementVisible}
		<div class="sticky select1" id="stickyLine">
			<i class="h">Event Year: </i>{selYear} &nbsp;&nbsp;
			<i>Event Semester: </i>{selSemest} &nbsp;&nbsp;
			<i>Event Duty: </i>
			{#each duty as item (item.id)}
				{#if selDuty === item.id}
					{item.name}
				{/if}
			{/each}
			&nbsp;&nbsp;
			<i>School Country: </i>
			{#if selectedCountryObj}
				{selectedCountryObj.country_name}
			{:else}
				ALL
			{/if}
			&nbsp;&nbsp;
			<i>School Region: </i>
			{#if selectedRegionObj}
				{selectedRegionObj.region_name}
			{:else}
				ALL
			{/if}
			&nbsp;&nbsp;
		</div>
	{/if}

	{#if err_mess}
		<div class="container" style="margin-bottom: 8rem;">
			<p><i>Something went wrong. Please try it later.</i></p>
		</div>
	{/if}

	{#if err_mess1}
		<div class="container" style="margin-bottom: 8rem;">
			<p><i>No data available.</i></p>
		</div>
	{/if}

	<div class="e" style="margin-bottom: 3rem;">
		<GenericChart
			labels={chart1Data.labels}
			data={chart1Data.datasets}
			title="Interested Students and their Status per Country"
			type="bar"
		/>
	</div>
	<div class="container" style="margin-bottom: 3rem;">
		<div class="f">
			<GenericChart
				labels={chart2Data.labels}
				data={chart2Data.data}
				colors={chart2Data.colors}
				title="Grade Proportion of Interested Students"
				type="doughnut"
			/>
		</div>
		<div class="f">
			<GenericChart
				labels={chart3Data.labels}
				data={chart3Data.data}
				colors={chart3Data.colors}
				title="Grade Proportion of Admitted Students"
				type="doughnut"
			/>
		</div>
	</div>
	<div class="container" style="margin-bottom: 3rem;">
		<div class="f">
			<GenericChart
				labels={chart4Data.labels}
				data={chart4Data.data}
				colors={chart4Data.colors}
				title="Subject Proportion of Interested Students"
				type="doughnut"
			/>
		</div>
		<div class="f">
			<GenericChart
				labels={chart5Data.labels}
				data={chart5Data.data}
				colors={chart5Data.colors}
				title="Subject Proportion of Admitted Students"
				type="doughnut"
			/>
		</div>
	</div>
	<div class="e" style="margin-bottom: 3rem;">
		<GenericChart
			labels={chart6Data.labels}
			data={chart6Data.datasets}
			title="Interested / Admitted Students Are Informed by Which Center"
			type="bar"
		/>
	</div>
	<div class="e" style="margin-bottom: 3rem;">
		<GenericChart
			labels={chart7Data.labels}
			data={chart7Data.datasets}
			title="Interested / Admitted Students Are Informed by Which Channel"
			type="bar"
		/>
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

	.select1 {
		border-top-left-radius: 100px;
		border-top-right-radius: 100px;
		border-bottom-left-radius: 100px;
		border-bottom-right-radius: 100px;
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
