<script lang="ts">
	import { FilterForm, fuzzySearch, StickyFilterBar, SearchInput } from '$lib/components/filters';
	import { tick } from 'svelte';
	import { DUTY_TYPES, highlight, schType, semester, smoothScroll } from '../../stores/dataStore';
	import type { PageData } from './$types';

	// 1. ADATOK ÉS ÁLLAPOTOK (States)
	let {
		data
	}: {
		data: PageData & {
			schoolsCount: number;
			totalEvents: number;
			totalEstStudents: number;
			totalApplied: number;
			totalIntrest0: number;
			totalIntrest1: number;
			totalIntrest2: number;
			totalIntrest3: number;
			countries: any[];
			regions: any[];
		};
	} = $props();
	let schoolsData = $state<any[]>([]); // A szerver válasza (Confirm után)
	let searchTerm = $state('');
	let debouncedTerm = $state(''); // Ez alapján szűrünk (késleltetett)
	let timeoutId: any;

	// Sticky line állapotok
	let isActive = $state(false);
	let isCoop = $state(false);
	let selYear = $state('');
	let selSemest = $state('');
	let selDuty = $state('ALL');
	let selRegion = $state('ALL');
	let selCountry = $state('ALL');
	let isElementVisible = $state(false);
	let err_mess = $state(false);

	let enhancedSchools = $derived(
		schoolsData.map((school) => ({
			...school,
			isBasic: school.duty_levels?.includes(1),
			isMedior: school.duty_levels?.includes(2),
			isHigh: school.duty_levels?.includes(3)
		}))
	);

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
		fuzzySearch(enhancedSchools, debouncedTerm, (s) => {
			return [
				s.user_names, // Startswith Contact
				s.school_name, // Iskola neve
				s.city_name, // Város
				s.county_name, // Megye
				s.region_name, // Régió
				s.country_code, // Ország kód (HU, stb.)
				getType(s.school_type), // A típus SZÖVEGESEN (pl. "Gimnázium")
				s.isBasic ? 'BAS' : '', // Ha van pipa, kereshető a 'BAS' szóra
				s.isMedior ? 'MED' : '', // Ha van pipa, kereshető a 'MED' szóra
				s.isHigh ? 'HIGH' : '' // Ha van pipa, kereshető a 'HIGH' szóra
			].join(' ');
		})
	);

	// SZERVER-SZINTŰ ÖSSZESÍTÉS (A törtvonal alatti értékek - mit hozott le a Confirm)
	let serverTotals = $derived({
		schools: schoolsData.length,
		events: sum(schoolsData, 'event_count'),
		students: sum(schoolsData, 'sum_estimated_student'),
		applied: sum(schoolsData, 'total_applied'),
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
			applied: sum(filteredSchools, 'total_applied'),
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
			percApplied: calcPerc(s.applied, serverTotals.applied),
			percIntr0: calcPerc(s.intr0, serverTotals.intr0),
			percIntr1: calcPerc(s.intr1, serverTotals.intr1),
			percIntr2: calcPerc(s.intr2, serverTotals.intr2),
			percIntr3: calcPerc(s.intr3, serverTotals.intr3),

			// Százalékok a Globális Maximumhoz képest (Load data)
			globalPercSchools: calcPerc(s.schools, data.schoolsCount),
			globalPercEvents: calcPerc(s.events, data.totalEvents),
			globalPercStudents: calcPerc(s.students, data.totalEstStudents),
			globalPercApplied: calcPerc(s.applied, data.totalApplied),
			globalPercIntr0: calcPerc(s.intr0, data.totalIntrest0),
			globalPercIntr1: calcPerc(s.intr1, data.totalIntrest1),
			globalPercIntr2: calcPerc(s.intr2, data.totalIntrest2),
			globalPercIntr3: calcPerc(s.intr3, data.totalIntrest3)
		};
	});

	// Segéd rúnák a Sticky sávhoz
	const countriesArray = $derived(data.countries || []);
	const regionsArray = $derived(data.regions || []);
	const selectedCountryObj = $derived(
		countriesArray.find((c: any) => c.country_id === Number(selCountry))
	);
	const selectedRegionObj = $derived(
		regionsArray.find((r: any) => r.region_id === Number(selRegion))
	);

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
		isActive: boolean;
		isCoop: boolean;
		selectedYear: string;
		selectedSemester: string;
		selectedDuty: any;
		selectedCountry: any;
		selectedRegion: any;
	}

	async function handleFilterUpdate(filters: FilterCriteria) {
		isActive = filters.isActive;
		isCoop = filters.isCoop;
		selYear = filters.selectedYear || 'ALL';
		selSemest =
			filters.selectedSemester === 'ALL' ? 'ALL' : semester[Number(filters.selectedSemester)];
		selDuty = filters.selectedDuty || 'ALL';
		selCountry = filters.selectedCountry;
		selRegion = filters.selectedRegion;

		isElementVisible = true;
		err_mess = false;

		const cleanFilters = {
			isActive: filters.isActive,
			isCoop: filters.isCoop,
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

			await tick();

			setTimeout(() => {
				const target = document.getElementById('above-search-input');

				if (target) {
					// Kiszámoljuk a távolságot az oldal tetejétől
					const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;

					// Levonjuk a dinamikus magasságot, plusz hagyunk egy pici (pl. 10px) lélegzetvételt
					const offsetPosition = elementPosition - 10;

					window.scrollTo({
						top: offsetPosition,
						behavior: 'smooth'
					});
				}
			}, 200);
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
		<i>&emsp;*Can be filtered by selected school status (Active/Cooperative)</i>
		<i>&emsp;**Semesters: Spring — months between the 3th & 9th months inclusive; Autumn — others</i
		>
	</hgroup>
	<br />

	<div id="top">
		<FilterForm {data} onFilter={handleFilterUpdate} />
	</div>

	<div class="search-input" id="above-search-input">
		<SearchInput bind:searchTerm count={filteredSchools.length} placeholder="Search in events..." />
	</div>

	<StickyFilterBar
		{isElementVisible}
		{selYear}
		{selSemest}
		{selDuty}
		{DUTY_TYPES}
		{selectedCountryObj}
		{selectedRegionObj}
		{isActive}
		{isCoop}
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
						<span>Applied Students</span>
					</div>

					<div class="stats-grid">
						<span class="main-stats">
							{searchTotals.applied}/{serverTotals.applied}
						</span>
						<span class="percentage">{searchTotals.percApplied} %</span>

						<div class="summary-row">
							<strong class="i">&sum;: {data.totalApplied}</strong>
						</div>

						<div class="global-perc h">{searchTotals.globalPercApplied} %</div>
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
					<td id="nameCell" class="c z">{@html highlight(school.user_names, searchTerm)}</td>

					<td class="c w" title={school.country_name}>
						{@html highlight(school.country_code, searchTerm)}
					</td>

					<td class="c w">{@html highlight(school.region_name, searchTerm)}</td>
					<td class="c z">{@html highlight(school.city_name, searchTerm)}</td>
					<td class="centered-link h w">
						<a href="../lists/all_schools/{school.school_id}" target="_blank" class="h">
							{@html highlight(school.school_name, searchTerm)}
						</a>
					</td>
					<td class="c w">{getType(school.school_type)}</td>

					<td class="c g">
						{#if school.isBasic}
							<span class={searchTerm.toLowerCase().includes('bas') ? 'highlight-pipa' : ''}>
								&#10003;
							</span>
						{/if}
					</td>
					<td class="c g">
						{#if school.isMedior}
							<span class={searchTerm.toLowerCase().includes('med') ? 'highlight-pipa' : ''}>
								&#10003;
							</span>
						{/if}
					</td>
					<td class="c g">
						{#if school.isHigh}
							<span class={searchTerm.toLowerCase().includes('high') ? 'highlight-pipa' : ''}>
								&#10003;
							</span>
						{/if}
					</td>

					<td class="c nm">{school.event_count}</td>
					<td class="c nm">{school.sum_estimated_student}</td>
					<td class="c nm">{school.total_intrest_count_status_0}</td>
					<td class="c nm">{school.total_applied}</td>
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

	.highlight-pipa {
		background-color: #ffda44;
		color: #000;
		padding: 2px 5px;
		border-radius: 4px;
		font-weight: bold;
	}
</style>
