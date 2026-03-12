<script lang="ts">
	import { Chart } from 'chart.js/auto';

	let {
		data,
		labels,
		title,
		type = 'bar',
		colors
	} = $props<{
		data: any[];
		labels: string[];
		title: string;
		type?: 'bar' | 'doughnut';
		colors?: string[];
	}>();

	let canvasElement = $state<HTMLCanvasElement>();
	let chart: Chart | null = null;

	$effect(() => {
		if (canvasElement && data && data.length > 0) {
			if (chart) chart.destroy();

			// Először elkészítjük a tiszta (snapshotolt) adatokat
      // A $state.snapshot() gondoskodik róla, hogy a Chart.js ne vesszen össze a Svelte-tel
      const cleanLabels = $state.snapshot(labels);

      // Ha doughnut, akkor a 'data' egy sima számtömb, ha bar, akkor egy objektumtömb
      const cleanData = $state.snapshot(data);

			// Ha bar chart, akkor több dataset is jöhet, ha doughnut, akkor csak egy
			const datasets = type === 'doughnut' ? [{ cleanData, backgroundColor: colors }] : cleanData; // Bar chartnál az adatstruktúrát készen kapja

			chart = new Chart(canvasElement, {
				type: type,
				data: {
          labels: cleanLabels,
          datasets: datasets
        },
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						title: { display: true, text: title, font: { size: 16 } },
						legend: { position: 'top' }
					}
				}
			});
		}
		return () => chart?.destroy();
	});
</script>

<div class="chart-wrapper">
	<canvas bind:this={canvasElement}></canvas>
</div>

<style>
	.chart-wrapper {
		height: 400px;
		width: 100%;
		position: relative;
	}
</style>
