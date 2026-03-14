<script lang="ts">
	import { dateSlugify } from '../../stores/dataStore';
	import { SearchInput, fuzzySearch } from '$lib/components/filters';

	let { data } = $props();

	let searchTerm = $state('');
	let filteredEvents = $derived(
		fuzzySearch(
			data.events,
			searchTerm,
			(ev) => `${dateSlugify(String(ev.closing_date))} ${ev.event_name} ${ev.slug} ${ev.on_duty}`
		)
	);

	let pageName = 'Event List';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div class="main">
	<h1>Event List</h1>

	<div class="input-container">
		<SearchInput bind:searchTerm count={filteredEvents.length} placeholder="Search in events..." />
	</div>

	<br />
	<ul>
		{#each filteredEvents as ev}
			<li class="li">
				<a href="../lists/all_events/{ev.event_id}" class="aa">
					{dateSlugify(String(ev.closing_date))}
					&#9753
					{ev.event_name}
					{' 🏠 '}
					{ev.slug}
					&#10087
					{ev.on_duty}
				</a>
			</li>
		{/each}
	</ul>
	<br />
	<a href="#top" class="flower">&#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046</a>
</div>

<style>
	.main {
		padding-left: 5%;
		padding-top: 2%;
		padding-right: 5%;
	}

	.aa {
		color: #147263;
		padding: 2%;
		font-weight: 480;
		font-size: 20px;
	}

  .input-container {
		position: relative;
	}

	.li {
		list-style-position: inside;
		list-style-type: disc;
		color: rgb(144, 132, 132);
		padding-left: 5%;
		text-indent: -6%;
		line-height: 1.35;
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
