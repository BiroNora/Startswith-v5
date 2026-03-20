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

<div id="top" class="main">
	<h3>Event List</h3>

	<div class="search-input">
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
