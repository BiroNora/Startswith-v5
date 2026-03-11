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

			// Ha bar chart, akkor több dataset is jöhet, ha doughnut, akkor csak egy
			const datasets = type === 'doughnut' ? [{ data, backgroundColor: colors }] : data; // Bar chartnál az adatstruktúrát készen kapja

			chart = new Chart(canvasElement, {
				type: type,
				data: { labels, datasets },
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
