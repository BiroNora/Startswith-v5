<script lang="ts">
	import { FilterForm, fuzzySearch, StickyFilterBar, SearchInput } from '$lib/components/filters';
	import { duty, schType, semester } from '../../stores/dataStore';
	import type { PageData } from './$types';

	// 1. ADATOK ÉS ÁLLAPOTOK (States)
	let { data }: { data: PageData & { schoolsCount: number } } = $props();
	let schoolsData = $state<any[]>([]); // A szerver válasza (Confirm után)
	let searchTerm = $state('');
	let debouncedTerm = $state(''); // Ez alapján szűrünk (késleltetett)
	let timeoutId: any;

	// Sticky line állapotok
	let selYear = $state('');
	let selSemest = $state('');
	let selDuty = $state('ALL');
	let selRegion = $state('ALL');
	let selCountry = $state('ALL');
	let isElementVisible = $state(false);
	let err_mess = $state(false);

	// 2. SEGÉDFÜGGVÉNYEK
	const sum = (arr: any[], key: string) => arr.reduce((acc, curr) => acc + (curr[key] || 0), 0);
	const calcPerc = (x: number, y: number) => (y === 0 ? 0 : Math.round((x * 100) / y));

	function getType(arr: string[]): string {
		return arr
			.map((value) => parseInt(value, 10) - 1)
			.filter((index) => index >= 0 && index < schType.length)
			.map((index) => schType[index])
			.join(', ');
	}

	// 3. SZÁRMAZTATOTT ÉRTÉKEK (Derived)

	// Kliensoldali keresés logikája
	let filteredSchools = $derived(
		fuzzySearch(schoolsData, debouncedTerm, (s) => {
			return [s.user_names, s.school_name, s.city_name, s.county_name, s.address, s.zip_code].join(
				' '
			);
		})
	);

	// SZERVER-SZINTŰ ÖSSZESÍTÉS (A törtvonal alatti értékek - mit hozott le a Confirm)
	let serverTotals = $derived({
		schools: schoolsData.length,
		events: sum(schoolsData, 'event_count'),
		students: sum(schoolsData, 'sum_estimated_student'),
		intr0: sum(schoolsData, 'total_intrest_count_status_0'),
		intr1: sum(schoolsData, 'total_intrest_count_status_1'),
		intr2: sum(schoolsData, 'total_intrest_count_status_2'),
		intr3: sum(schoolsData, 'total_intrest_count_status_3')
	});

	// KERESŐ-SZINTŰ ÖSSZESÍTÉS (A törtvonal feletti értékek + minden százalék)
	let searchTotals = $derived.by(() => {
		const s = {
			schools: filteredSchools.length,
			events: sum(filteredSchools, 'event_count'),
			students: sum(filteredSchools, 'sum_estimated_student'),
			intr0: sum(filteredSchools, 'total_intrest_count_status_0'),
			intr1: sum(filteredSchools, 'total_intrest_count_status_1'),
			intr2: sum(filteredSchools, 'total_intrest_count_status_2'),
			intr3: sum(filteredSchools, 'total_intrest_count_status_3')
		};

		return {
			...s,
			// Százalékok a Szerver válaszához képest (Confirm)
			percSchools: calcPerc(s.schools, serverTotals.schools),
			percEvents: calcPerc(s.events, serverTotals.events),
			percStudents: calcPerc(s.students, serverTotals.students),
			percIntr0: calcPerc(s.intr0, serverTotals.intr0),
			percIntr1: calcPerc(s.intr1, serverTotals.intr1),
			percIntr2: calcPerc(s.intr2, serverTotals.intr2),
			percIntr3: calcPerc(s.intr3, serverTotals.intr3),

			// Százalékok a Globális Maximumhoz képest (Load data)
			globalPercSchools: calcPerc(s.schools, data.schoolsCount),
			globalPercEvents: calcPerc(s.events, data.totalEvents),
			globalPercStudents: calcPerc(s.students, data.totalEstStudents),
			globalPercIntr0: calcPerc(s.intr0, data.totalIntrest0),
			globalPercIntr1: calcPerc(s.intr1, data.totalIntrest1),
			globalPercIntr2: calcPerc(s.intr2, data.totalIntrest2),
			globalPercIntr3: calcPerc(s.intr3, data.totalIntrest3)
		};
	});

	// Segéd rúnák a Sticky sávhoz
	const countriesArray = $derived(data.distinctCountries || []);
	const regionsArray = $derived(data.distinctRegions || []);
	const selectedCountryObj = $derived(
		countriesArray.find((c: any) => c.country_id === Number(selCountry))
	);
	const selectedRegionObj = $derived(regionsArray.find((r: any) => r.region_id === Number(selRegion)));

	// 4. EFFEKTEK (Késleltetés/Debounce)
	$effect(() => {
		searchTerm;
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			debouncedTerm = searchTerm;
		}, 250);
		return () => clearTimeout(timeoutId);
	});

	// 5. INTERFÉSZEK ÉS FÜGGVÉNYEK
	interface FilterCriteria {
		selectedYear: string;
		selectedSemester: string;
		selectedDuty: any;
		selectedCountry: any;
		selectedRegion: any;
	}

	async function handleFilterUpdate(filters: FilterCriteria) {
		selYear = filters.selectedYear;
		selSemest = filters.selectedSemester || 'ALL';
		selDuty = filters.selectedDuty || 'ALL';
		selCountry = filters.selectedCountry;
		selRegion = filters.selectedRegion;

		isElementVisible = true;
		err_mess = false;

		const cleanFilters = {
			selectedSemester: filters.selectedSemester === 'ALL' ? null : filters.selectedSemester,
			selectedDuty: filters.selectedDuty === 'ALL' ? null : filters.selectedDuty,
			selectedYear: filters.selectedYear === 'ALL' ? null : Number(filters.selectedYear),
			selectedCountry: filters.selectedCountry === 'ALL' ? null : Number(filters.selectedCountry),
			selectedRegion: filters.selectedRegion === 'ALL' ? null : Number(filters.selectedRegion)
		};

		try {
			const response = await fetch('/tables/school_event', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(cleanFilters)
			});

			if (!response.ok) throw new Error('Szerver hiba');

			const result = await response.json();
			schoolsData = result.schoolsData || [];
		} catch (error) {
			console.error('Error:', error);
			err_mess = true;
		}
	}

	let pageName = 'SCHOOL_EVENT';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div class="main-chart">
	<hgroup>
		<h3>Search on the Base of Schools* and their Events**</h3>
		<i>&emsp;*Active and cooperative schools only with Startswith contact</i>

		<i>&emsp;**Semesters: Spring — months between the 3th & 9th months inclusive; Autumn — others</i
		>
	</hgroup>
	<br />

	<div id="top">
		<FilterForm {data} onFilter={handleFilterUpdate} />
	</div>

	<div class="search-input">
		<SearchInput bind:searchTerm count={filteredSchools.length} placeholder="Search in events..." />
	</div>

	<br />
	<StickyFilterBar
		{isElementVisible}
		{selYear}
		{selSemest}
		{selDuty}
		{duty}
		{selectedCountryObj}
		{selectedRegionObj}
	>
		<i class="black">Filtering: </i>
		<span class={searchTerm !== '' ? 'filter-on' : 'filter-off'}>
			&nbsp;{searchTerm !== '' ? 'ON' : 'OFF'}
		</span>
	</StickyFilterBar>

	<table class="table">
		<thead>
			<tr>
				<th class="c v">Startswith Contact</th>
				<th class="c v">Code</th>
				<th class="c v">Region</th>
				<th class="c v">County</th>
				<th class="c v">City</th>

				<th class="c v tight-header">
					<div class="title-row">
						<small>&#8470; of</small>
						<span>Schools</span>
					</div>

					<div class="stats-grid">
						<span class="main-stats">
							{searchTotals.schools}/{serverTotals.schools}
						</span>

						<div style="height: 0.7rem;">&nbsp;</div>

						<div class="summary-row1">
							<strong class="i">&sum;: {data.schoolsCount}</strong>
						</div>

						<div class="global-perc h">{searchTotals.globalPercSchools} %</div>
					</div>
				</th>

				<th class="c v">School Type</th>
				<th class="c b">BAS</th>
				<th class="c b">MED</th>
				<th class="c d">HIGH</th>

				<th class="c v tight-header">
					<div class="title-row">
						<small>&#8470; of</small>
						<span>Events</span>
					</div>

					<div class="stats-grid">
						<span class="main-stats">
							{searchTotals.events}/{serverTotals.events}
						</span>
						<span class="percentage">{searchTotals.percEvents} %</span>

						<div class="summary-row">
							<strong class="i">&sum;: {data.totalEvents}</strong>
						</div>

						<div class="global-perc h">{searchTotals.globalPercEvents} %</div>
					</div>
				</th>

				<th class="c v tight-header">
					<div class="title-row">
						<small>&#8470; of</small>
						<span>Est./Pres. Students</span>
					</div>

					<div class="stats-grid">
						<span class="main-stats">
							{searchTotals.students}/{serverTotals.students}
						</span>
						<span class="percentage">{searchTotals.percStudents} %</span>

						<div class="summary-row">
							<strong class="i">&sum;: {data.totalEstStudents}</strong>
						</div>

						<div class="global-perc h">{searchTotals.globalPercStudents} %</div>
					</div>
				</th>

				<th class="c v tight-header">
					<div class="title-row">
						<small>&#8470; of</small>
						<span>Interested Students</span>
					</div>

					<div class="stats-grid">
						<span class="main-stats">
							{searchTotals.intr0}/{serverTotals.intr0}
						</span>
						<span class="percentage">{searchTotals.percIntr0} %</span>

						<div class="summary-row">
							<strong class="i">&sum;: {data.totalIntrest0}</strong>
						</div>

						<div class="global-perc h">{searchTotals.globalPercIntr0} %</div>
					</div>
				</th>

				<th class="c v tight-header">
					<div class="title-row">
						<small>&#8470; of</small>
						<span>ADMITTED</span>
					</div>

					<div class="stats-grid">
						<span class="main-stats">
							{searchTotals.intr1}/{serverTotals.intr1}
						</span>
						<span class="percentage">{searchTotals.percIntr1} %</span>

						<div class="summary-row">
							<strong class="i">&sum;: {data.totalIntrest1}</strong>
						</div>

						<div class="global-perc h">{searchTotals.globalPercIntr1} %</div>
					</div>
				</th>

				<th class="c v tight-header">
					<div class="title-row">
						<small>&#8470; of</small>
						<span>REJECTED</span>
					</div>

					<div class="stats-grid">
						<span class="main-stats">
							{searchTotals.intr2}/{serverTotals.intr2}
						</span>
						<span class="percentage">{searchTotals.percIntr2} %</span>

						<div class="summary-row">
							<strong class="i">&sum;: {data.totalIntrest2}</strong>
						</div>

						<div class="global-perc h">{searchTotals.globalPercIntr2} %</div>
					</div>
				</th>

				<th class="c v tight-header">
					<div class="title-row">
						<small>&#8470; of</small>
						<span>IN PROGRESS</span>
					</div>

					<div class="stats-grid">
						<span class="main-stats">
							{searchTotals.intr3}/{serverTotals.intr3}
						</span>
						<span class="percentage">{searchTotals.percIntr3} %</span>

						<div class="summary-row">
							<strong class="i">&sum;: {data.totalIntrest3}</strong>
						</div>

						<div class="global-perc h">{searchTotals.globalPercIntr3} %</div>
					</div>
				</th>
			</tr>
		</thead>

		<tbody>
			{#each filteredSchools as school}
				<tr>
					<td id="nameCell" class="c z">{school.user_names}</td>

					<td class="c w" title={school.country_name}>
						{school.country_code}
					</td>

					<td class="c w">{school.region_name}</td>
					<td class="c w">{school.county_name}</td>
					<td class="c z">{school.city_name}</td>
					<td class="centered-link h w">
						<a href="../lists/all_schools/{school.school_id}" target="_blank" class="h">
							{school.school_name}
						</a>
					</td>
					<td class="c w">{getType(school.school_type)}</td>

					{#if school.basic == true}
						<td class="c g">&#10003;</td>
					{:else}
						<td></td>
					{/if}
					{#if school.medior == true}
						<td class="c g">&#10003;</td>
					{:else}
						<td></td>
					{/if}
					{#if school.high == true}
						<td class="c g">&#10003;</td>
					{:else}
						<td></td>
					{/if}

					<td class="c nm">{school.event_count}</td>
					<td class="c nm">{school.sum_estimated_student}</td>
					<td class="c nm">{school.total_intrest_count_status_0}</td>
					<td class="c nm">{school.total_intrest_count_status_1}</td>
					<td class="c nm">{school.total_intrest_count_status_2}</td>
					<td class="c nm">{school.total_intrest_count_status_3}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<a href="#top" class="flower">&#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046</a>
</div>

<style>
	/* A fejléc cellák alapból kisebb betűvel */
	.tight-header {
		font-size: 0.75rem; /* 12px körül */
		line-height: 1.1;
		padding: 0.5rem 0.2rem !important; /* Kevesebb belső hely */
		vertical-align: top;
	}

	.title-row {
		margin-bottom: 0.4rem;
		min-height: 4em;
		display: flex;
		flex-direction: column;

		/* FÜGGŐLEGESEN FELÜLRE (mivel column az irány) */
		justify-content: flex-start;

		/* VÍZSZINTESEN KÖZÉPRE */
		align-items: center;

		/* Opcionális: ha a szöveg több soros, a szövegtörzs is legyen középen */
		text-align: center;
	}
	.stats-grid {
		display: flex;
		flex-direction: column;
		gap: 1px; /* Nagyon pici távolság az adatok között */
		flex: 1;
		justify-content: space-between;
		min-height: 4rem;
	}

	.main-stats {
		font-weight: 500;
		white-space: nowrap; /* Ne törje ketté a 1019/1019-et */
	}

	.percentage {
		color: var(--pico-muted-color);
		font-size: small;
	}

	.summary-row,
	.summary-row1 {
		width: 100%;
		margin-top: auto; /* Ez tolja le az aljára */
	}

	/* Ha eléri a képernyő szélét, még kisebb lehet */
	@media (max-width: 1200px) {
		.tight-header {
			font-size: 0.65rem;
		}
	}
	.c {
		text-align: center;
	}

	.b {
		width: 6%;
		font-size: x-small;
	}

	.d {
		width: 5%;
		font-size: x-small;
		font-stretch: condensed;
	}

	.g {
		color: #32bea6;
		font-weight: 900;
	}

	.h {
		color: #32bea6;
	}

	.i {
		color: #32bea6;
		font-weight: 600;
	}

	.v {
		font-size: 17px;
	}

	.nm {
		font-size: 0.6rem;
	}

	.z {
		font-size: 0.5rem;
	}

	.w {
		font-size: xx-small;
	}

	table {
		border-collapse: collapse;
		width: 100%;
	}

	th,
	td {
		padding: 0.25rem 0.5rem !important; /* Kisebb hely a cellák között */
		text-align: left;
	}

	th {
		background-color: #fafdfd;
		position: sticky;
		top: 40px;
		z-index: 2;
	}

	tr:nth-child(even) {
		background-color: #f2f2f2;
	}

	.centered-link {
		height: 100%; /* Optional: If you want the link to take up the full height of the cell */
		display: table-cell;
		align-items: center;
		justify-content: space-around;
		flex-direction: column;
		text-align: center;
		vertical-align: middle;
		width: 100%;

		outline: none; /* Remove focus outline (optional, for better accessibility) */
		text-decoration-color: #32bea6;
	}
</style>
