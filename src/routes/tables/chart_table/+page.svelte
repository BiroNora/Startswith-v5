<script lang="ts">
	import {
		duty,
		gradeMap,
		subjectMap
	} from '../../stores/dataStore';
	import { Chart } from 'chart.js/auto';
	import FilterForm from './FilterForm.svelte';

	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let pageName = 'CHART_TABLE';

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
	const selectedRegionObj = $derived(
		regionsArray.find((r) => r.region_id === Number(selRegion))
	);
	let isElementVisible = $state(false);

	let err_mess = $state(false);
	let err_mess1 = $state(false);

	// Chart rúnák (ezek hiányoztak a kódodból!)
	let chart1Labels = $state<string[]>([]);
	let chart1Data = $state<any[]>([]);
	let chart2Labels = $state<string[]>([]);
	let chart2Data = $state<any>(null);
	let chart3Labels = $state<string[]>([]);
	let chart3Data = $state<any>(null);
	let chart4Labels = $state<string[]>([]);
	let chart4Data = $state<any>(null);
	let chart5Labels = $state<string[]>([]);
	let chart5Data = $state<any>(null);
	let chart6Labels = $state<string[]>([]);
	let chart6Data = $state<any>(null);
	let chart7Labels = $state<string[]>([]);
	let chart7Data = $state<any>(null);

	let responseDataFormatted: any = null;

	const gradeMapLength: number = Object.keys(gradeMap).length;
	const subjectMapLength: number = Object.keys(subjectMap).length;
	const gradeNames = Array.from({ length: gradeMapLength }, (_, i) => gradeMap[i].name);
	const subjectNames = Array.from({ length: subjectMapLength }, (_, i) => subjectMap[i].name);

	function calcPerc(x: any, y: any): number {
		return x !== 0 ? Math.round((x * 100) / y) : 0;
	}

	// For JSON visualization
	function formatAndSetResponseData(responseData: any) {
		responseDataFormatted = JSON.stringify(responseData, null, 2);
	}

	interface FilterCriteria {
		selectedYear: string;
		selectedSemester: string;
		selectedDuty: any;
		selectedCountry: any;
		selectedRegion: any;
	}

	async function handleFilterUpdate(filters: FilterCriteria) {
		// 1. Frissítjük a Sticky sáv adatait
		selYear = filters.selectedYear;
		selSemest = filters.selectedSemester || 'ALL';
		selDuty = filters.selectedDuty || 'ALL';
		selCountry = filters.selectedCountry;
		selRegion = filters.selectedRegion;

		// 2. Megjelenítjük a sávot
		isElementVisible = true;
		err_mess = false;
		err_mess1 = false;

		const cleanFilters = {
			selectedSemester: filters.selectedSemester,
			// Csak akkor konvertálunk számra, ha nem 'ALL'
			selectedYear: filters.selectedYear === 'ALL' ? null : Number(filters.selectedYear),
			selectedDuty: filters.selectedDuty,
			selectedCountry: filters.selectedCountry === 'ALL' ? null : Number(filters.selectedCountry),
			selectedRegion: filters.selectedRegion === 'ALL' ? null : Number(filters.selectedRegion)
		};

		console.log('Ez megy a szerverre:', cleanFilters);

		try {
			// 2. FETCH az SQL adatokért (a te szerver végpontodra)
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
			chart1Labels = result.statusCountry.map((d: any) => d.country_name);
			chart1Data = [
				{
					label: 'Total Interest',
					data: result.statusCountry.map((d: any) => d.total_intrest_count),
					backgroundColor: '#32bea6'
				}
			];

			// --- Chart 2: Évfolyamok JAVÍTVA ---
			// A result.statusGrade egy tömb, aminek az első eleme az adat
			const gradeData = result.statusGrade && result.statusGrade[0] ? result.statusGrade[0] : {};

			const interestGradeArray = [
				gradeData.intrest_grade_status_1 || 0,
				gradeData.intrest_grade_status_2 || 0,
				gradeData.intrest_grade_status_3 || 0,
				gradeData.intrest_grade_status_4 || 0,
				gradeData.intrest_grade_status_5 || 0
			];

			const totalInterest = interestGradeArray.reduce((sum, val) => sum + val, 0);

			chart2Labels = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'];
			chart2Data = interestGradeArray.map((val) =>
				totalInterest !== 0 ? Math.round((val * 100) / totalInterest) : 0
			);

			// --- Chart 3: Subject JAVÍTVA ---
			const sData =
				result.subjectIntrest && result.subjectIntrest[0] ? result.subjectIntrest[0] : {};
			chart3Labels = Array.from({ length: 14 }, (_, i) => `Subject ${i + 1}`);
			chart3Data = Array.from({ length: 14 }, (_, i) => sData[`intrest_work_title_${i + 1}`] || 0);
			// --- Chart 3: Évfolyamok (Felvettek) százalékos számítása ---
			const subjectData = result.subjectIntrest[0] || {};
			const admittedGradeArray = [
				subjectData.admittedGrade.intrest_grade_status_1 || 0,
				subjectData.admittedGrade.intrest_grade_status_2 || 0,
				subjectData.admittedGrade.intrest_grade_status_3 || 0,
				subjectData.admittedGrade.intrest_grade_status_4 || 0,
				subjectData.admittedGrade.intrest_grade_status_5 || 0
			];
			const totalAdmitted = admittedGradeArray.reduce((sum, val) => sum + val, 0);

			chart3Labels = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'];
			chart3Data = admittedGradeArray.map((val) =>
				totalAdmitted !== 0 ? Math.round((val * 100) / totalAdmitted) : 0
			);
			// Chart 3: Munkakörök/Subject (Doughnut)
			chart3Labels = Array.from({ length: 14 }, (_, i) => `Subject ${i + 1}`);
			chart3Data = Array.from(
				{ length: 14 },
				(_, i) => result.subjectIntrest[`intrest_work_title_${i + 1}`]
			);

			// Chart 4: Régiók (Doughnut)
			chart4Labels = result.regionIntrest.map((r: any) => r.region_name);
			chart4Data = result.regionIntrest.map((r: any) => r.intrest_count);

			// Üres adat ellenőrzése
			if (chart1Labels.length === 0) {
				err_mess1 = true;
			}
		} catch (error) {
			err_mess = true;
			console.error('Hiba történt:', error);
		}
	}

	/* async function sendDataWithForm(event: any) {
		event.preventDefault()
		try {
			const formData: RequestPayload = {
				selectedYear: Number($selectedYear),
				selectedSemester: semesterFilter,
				selectedDuty: dutyFilter,
				selectedRegion: Number($selectedRegion),
				selectedCountry: Number($selectedCountry)
			}

			const response = await fetch('http://localhost:5173/tables/chart_table', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			})

			if (response.ok) {
				const responseData = await response.json()
				//formatAndSetResponseData(responseData)
				statusCountry = responseData.statusCountry
				statusGrade = responseData.statusGrade
				admittedGrade = responseData.admittedGrade
				subjectIntrest = responseData.subjectIntrest
				subjectAdmitted = responseData.subjectAdmitted
				regionIntrest = responseData.regionIntrest
				regionAdmitted = responseData.regionAdmitted
				channelIntrest = responseData.channelIntrest
				channelAdmitted = responseData.channelAdmitted

				console.log("%c >>> SZERVER VÁLASZA MEGÉRKEZETT <<<", "color: blue; font-size: 15px; font-weight: bold;");
        console.log("A kapott objektum kulcsai:", Object.keys(responseData));
        console.log("Adatok táblázatosan:");
        console.table(responseData.statusCountry); // Ez a leglátványosabb!
        console.dir(responseData); // Itt a teljes fa struktúra

				if (statusCountry.length === 0) {
					err_mess1 = true
					err_mess = false
					destroyChart()
				} else {
					err_mess1 = false
					err_mess = false
					createChart()
				}
			} else {
				console.error('Server error:', response.statusText)
				err_mess = true
				destroyChart()
			}
		} catch (error) {
			console.error('Error:', error)
		}
	}
 */
	/* function destroyChart() {

		const canvasIds: string[] = [
			'chartCanvas1',
			'chartCanvas2',
			'chartCanvas3',
			'chartCanvas4',
			'chartCanvas5',
			'chartCanvas6',
			'chartCanvas7'
		]
		const existingCharts: Chart[] = []

		// Destroy canvas if existing
		canvasIds.forEach((canvasId) => {
			const canvas: HTMLCanvasElement | null = document.getElementById(
				canvasId
			) as HTMLCanvasElement
			if (canvas) {
				const existingChart: Chart | undefined = Chart.getChart(canvas)
				if (existingChart) {
					existingCharts.push(existingChart)
					existingChart.destroy()
				}
			}
		})
  } */

	/* function createChart() {
		err_mess = false
		let chartCanvas1: HTMLCanvasElement | null = document.getElementById(
			'chartCanvas1'
		) as HTMLCanvasElement
		let chartCanvas2: HTMLCanvasElement | null = document.getElementById(
			'chartCanvas2'
		) as HTMLCanvasElement
		let chartCanvas3: HTMLCanvasElement | null = document.getElementById(
			'chartCanvas3'
		) as HTMLCanvasElement
		let chartCanvas4: HTMLCanvasElement | null = document.getElementById(
			'chartCanvas4'
		) as HTMLCanvasElement
		let chartCanvas5: HTMLCanvasElement | null = document.getElementById(
			'chartCanvas5'
		) as HTMLCanvasElement
		let chartCanvas6: HTMLCanvasElement | null = document.getElementById(
			'chartCanvas6'
		) as HTMLCanvasElement
		let chartCanvas7: HTMLCanvasElement | null = document.getElementById(
			'chartCanvas7'
		) as HTMLCanvasElement

		const canvasIds: string[] = [
			'chartCanvas1',
			'chartCanvas2',
			'chartCanvas3',
			'chartCanvas4',
			'chartCanvas5',
			'chartCanvas6',
			'chartCanvas7'
		]
		const existingCharts: Chart[] = []

		// Destroy canvas if existing
		canvasIds.forEach((canvasId) => {
			const canvas: HTMLCanvasElement | null = document.getElementById(
				canvasId
			) as HTMLCanvasElement
			if (canvas) {
				const existingChart: Chart | undefined = Chart.getChart(canvas)
				if (existingChart) {
					existingCharts.push(existingChart)
					existingChart.destroy()
				}
			}
		})

		// Data of chartCanvas1
		let countryNames = statusCountry.map((item: StatusCountry) => item.country_name)
		let dataVal = statusCountry.map((item: StatusCountry) => item.total_intrest_count)
		let dataAppl = statusCountry.map((item: StatusCountry) => item.intert)
		let dataValues0 = statusCountry.map((item: StatusCountry) => item.intrest_count_status_0)
		let dataValues1 = statusCountry.map((item: StatusCountry) => item.intrest_count_status_1)
		let dataValues2 = statusCountry.map((item: StatusCountry) => item.intrest_count_status_2)
		let dataValues3 = statusCountry.map((item: StatusCountry) => item.intrest_count_status_3)

		let datasets1 = [
			{
				label: 'INTERESTED TOTAL',
				backgroundColor: 'rgb(251, 2, 71)',
				data: dataVal
			},
			{
				label: 'INTERESTED / NOT APPLIED',
				backgroundColor: 'rgb(235, 120, 143)',
				data: dataValues0
			},
			{
				label: 'INTERESTED / APPLIED',
				backgroundColor: 'rgb(93, 43, 110)',
				data: dataAppl
			},
			{
				label: statusMap[0].name,
				backgroundColor: 'rgb(50, 190, 166)',
				data: dataValues1
			},
			{
				label: statusMap[1].name,
				backgroundColor: 'rgb(135, 167, 196)',
				data: dataValues2
			},
			{
				label: statusMap[2].name,
				backgroundColor: 'rgb(242, 196, 97)',
				data: dataValues3
			}
		]

		// Data of chartCanvas2, chartCanvas3
		function calculateGradeData(array: any): number[] {
			gradeData = []

			const statusValuesMap: { [key: string]: number } = {}
			for (let i = 1; i <= gradeMapLength; i++) {
				const grStatus = `intrest_grade_status_${i}`
				statusValuesMap[grStatus] = array[0][grStatus] || 0 // Use 0 as default if value is not present
			}

			const gradeTotal = Object.values(statusValuesMap).reduce((sum, value) => sum + value, 0)

			for (let i = 1; i <= gradeMapLength; i++) {
				const grade = `intrest_grade_status_${i}`
				gradeData.push(calcPerc(statusValuesMap[grade], gradeTotal))
			}
			return gradeData
		}

		// Data of chartCanvas4, chartCanvas5
		function calculateSubjectData(array: any): number[] {
			subjectData = []

			const subjectValuesMap: { [key: string]: number } = {}
			for (let i = 1; i <= subjectMapLength; i++) {
				const workTitle = `intrest_work_title_${i}`
				subjectValuesMap[workTitle] = array[0][workTitle] || 0 // Use 0 as default if value is not present
			}

			const subjectTotal = Object.values(subjectValuesMap).reduce((sum, value) => sum + value, 0)

			for (let i = 1; i <= subjectMapLength; i++) {
				const workTitle = `intrest_work_title_${i}`
				subjectData.push(calcPerc(subjectValuesMap[workTitle], subjectTotal))
			}
			return subjectData
		}

		// Data of chartCanvas6
		const regionNamesInt = regionIntrest.map((item: any) => item.region_name)
		const chartLabels: string[] = regionNamesInt

		function aggrIntrCounts(
			data: RegionIntrest[], admittedData: RegionAdmitted[]): [number[], number[]] {
			const intrCount: number[] = []
			const addmCount: number[] = []

			// Create a map of region_name to intrest_count from regionIntrest
			const intrestMap: Record<string, number> = {}
			for (const item of data) {
				intrestMap[item.region_name] = item.intrest_count
			}

			// Create arrays of intrest_counts for both regionIntrest and regionAdmitted
			for (const item of data) {
				intrCount.push(item.intrest_count)
				const admittedItem = admittedData.find((admitted) => admitted.region_name === item.region_name)
				addmCount.push(admittedItem ? admittedItem.intrest_count : 0)
			}

			return [intrCount, addmCount]
		}

		// Get the two arrays of intrest counts for RegionIntrest and RegionAdmitted
		const [countIntr, countAdm] =	aggrIntrCounts(regionIntrest, regionAdmitted)

		const chartData = [
			{
				label: 'INTERESTED STUDENTS',
				backgroundColor: 'rgb(251, 2, 71)',
				data: countIntr
			},
			{
				label: 'ADMITTED STUDENTS',
				backgroundColor: 'rgb(50, 190, 166)',
				data: countAdm
			}
		]

		// Data of chartCanvas7
		const channelNamesInt = channelIntrest.map((item: any) => item.channel)
		const channelNames = channelNamesInt.map((id: any) => {
			const channel = channelMap.find((item) => item.id === id)
			return channel ? channel.name : 'Unknown'
		})

		function aggrChannelCounts(
			data: ChannelIntrest[], admittedData: ChannelAdmitted[]): [number[], number[]] {
			const intrChCount: number[] = []
			const addmChCount: number[] = []

			// Create a map of region_name to intrest_count from regionIntrest
			const intrestMap: Record<string, number> = {}
			for (const item of data) {
				intrestMap[item.channel] = item.intrest_count
			}

			// Create arrays of intrest_counts for both regionIntrest and regionAdmitted
			for (const item of data) {
				intrChCount.push(item.intrest_count)
				const admittedItem = admittedData.find((admitted) => admitted.channel === item.channel)
				addmChCount.push(admittedItem ? admittedItem.intrest_count : 0)
			}

			return [intrChCount, addmChCount]
		}

		// Get the two arrays of intrest counts for RegionIntrest and RegionAdmitted
		const [countChIntr, countChAdm] =	aggrChannelCounts(channelIntrest, channelAdmitted)

		const chart7Data = [
			{
				label: 'INTERESTED STUDENTS',
				backgroundColor: 'rgb(251, 2, 71)',
				data: countChIntr
			},
			{
				label: 'ADMITTED STUDENTS',
				backgroundColor: 'rgb(50, 190, 166)',
				data: countChAdm
			}
		]

		new Chart(chartCanvas1, {
			type: 'bar', // Chart type (e.g., 'bar', 'doughnut', etc.)
			data: {
				labels: countryNames,
				datasets: datasets1
			},
			options: {
				plugins: {
					title: {
						display: true,
						text: 'Interested Students and their Status per Country',
						font: {
							size: 20
						}
					}
				}
			}
		})

		new Chart(chartCanvas2, {
			type: 'doughnut', // Doughnut chart type
			data: {
				labels: gradeNames,
				datasets: [
					{
						data: calculateGradeData(statusGrade),
						backgroundColor: gradeColors
					}
				]
			},
			options: {
				plugins: {
					title: {
						display: true,
						text: 'Grade Percentage Proportion of Interested Students',
						font: {
							size: 20
						}
					}
				}
			}
		})

		new Chart(chartCanvas3, {
			type: 'doughnut', // Doughnut chart type
			data: {
				labels: gradeNames,
				datasets: [
					{
						data: calculateGradeData(admittedGrade),
						backgroundColor: gradeColors
					}
				]
			},
			options: {
				plugins: {
					title: {
						display: true,
						text: 'Grade Percentage Proportion of Admitted Students',
						font: {
							size: 20
						}
					}
				}
			}
		})

		new Chart(chartCanvas4, {
			type: 'doughnut', // Doughnut chart type
			data: {
				labels: subjectNames,
				datasets: [
					{
						data: calculateSubjectData(subjectIntrest),
						backgroundColor: subjectColors
					}
				]
			},
			options: {
				plugins: {
					title: {
						display: true,
						text: 'Subject Percentage Proportion of Interested Students',
						font: {
							size: 20
						}
					}
				}
			}
		})

		new Chart(chartCanvas5, {
			type: 'doughnut', // Doughnut chart type
			data: {
				labels: subjectNames,
				datasets: [
					{
						data: calculateSubjectData(subjectAdmitted),
						backgroundColor: subjectColors
					}
				]
			},
			options: {
				plugins: {
					title: {
						display: true,
						text: 'Subject Percentage Proportion of Admitted Students',
						font: {
							size: 20
						}
					}
				}
			}
		})

		new Chart(chartCanvas6, {
			type: 'bar', // Chart type (e.g., 'bar', 'doughnut', etc.)
			data: {
				labels: chartLabels,
				datasets: chartData
			},
			options: {
				plugins: {
					title: {
						display: true,
						text: 'Interested / Admitted Students Are Informed by Which Center',
						font: {
							size: 20
						}
					}
				}
			}
		})

		new Chart(chartCanvas7, {
			type: 'bar', // Chart type (e.g., 'bar', 'doughnut', etc.)
			data: {
				labels: channelNames,
				datasets: chart7Data
			},
			options: {
				plugins: {
					title: {
						display: true,
						text: 'Interested / Admitted Students Are Informed by Which Channel',
						font: {
							size: 20
						}
					}
				}
			}
		})
	} */
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

	<!-- <div class="e" style="margin-bottom: 3rem;">
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
	</div> -->
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
