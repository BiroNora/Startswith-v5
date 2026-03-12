<script lang="ts">
	import { Chart } from 'chart.js/auto';

	// Svelte 5-ös props: ezeket kapja meg kívülről a komponenst
	let { data, labels, title } = $props<{
		data: number[];
		labels: string[];
		title: string;
	}>();

	// Referencia a canvas elemhez
	let canvasElement = $state<HTMLCanvasElement>();
	let chart: Chart | null = null;

	// Fix színskála, amit a korábbi kódodban használtál
	const gradeColors = [
		'rgb(251, 2, 71)',
		'rgb(255, 99, 132)',
		'rgb(100, 99, 132)',
		'rgb(54, 162, 235)',
		'rgb(75, 192, 192)',
		'rgb(252, 169, 3)'
	];

	// Ez a rúna figyeli az adatok változását és a canvas jelenlétét
	$effect(() => {
		if (canvasElement && data) {
			// Ha már van létező grafikon, először elpusztítjuk (nincs több ütközés!)
			if (chart) {
				chart.destroy();
			}

			// Új grafikon létrehozása
			chart = new Chart(canvasElement, {
				type: 'doughnut',
				data: {
					labels: $state.snapshot(labels),
					datasets: [
						{
							data: $state.snapshot(data),
							backgroundColor: gradeColors,
							borderWidth: 1
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: true,
					plugins: {
						legend: {
							position: 'top',
							labels: { boxWidth: 15, font: { size: 10 } }
						},
						title: {
							display: true,
							text: title,
							font: { size: 16, weight: 'bold' }
						}
					}
				}
			});
		}

		// "Cleanup" függvény: ha a komponens eltűnik az oldalról, törli a chartot a memóriából
		return () => {
			chart?.destroy();
		};
	});
</script>

<div class="chart-wrapper">
	<canvas bind:this={canvasElement}></canvas>
</div>

<style>
  .chart-wrapper {
    position: relative;
    height: 500px; /* Itt fixáljuk a magasságot, hogy ne nyúljon el */
    width: 100%;
    margin: 0 auto;
  }
</style>
