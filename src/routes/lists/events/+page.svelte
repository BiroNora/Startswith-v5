<script lang="ts">
	import { fuzzySearch, SearchInput } from '$lib/components/filters';
	import { dateSlugify } from '../../stores/dataStore';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchTerm = $state('');
	let filteredEvents = $derived(
		fuzzySearch(
			data.events,
			searchTerm,
			(ev) => `${ev.event_name} ${ev.school_name} ${ev.duty_name}`
		)
	);

	let count = $derived(data.events.length);

	let pageName = 'My Event List';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div id="top" class="main">
	<hgroup>
		<h3>My Event List</h3>
		<i>Number of events:&nbsp;{count}</i>
	</hgroup>

	<div class="search-input">
		<SearchInput bind:searchTerm count={filteredEvents.length} placeholder="Search in events..." />
	</div>

	<br />
	<ul>
		{#each filteredEvents as ev (ev.event_id)}
			{@const isInProgress = data.eventIdsInProgress.includes(ev.event_id)}
			<li class="li">
				<a href="../lists/events/{ev.event_id}" class="aa">
					{dateSlugify(String(ev.closing_date))}

					{#if isInProgress}
						<span> 🚧 </span>
					{:else}
						<span class="d"> ❧ </span>
					{/if}

					{ev.event_name}
					{' 🏠 '}
					{ev.school_name}
					<span class="d"> ❧ </span>
					{ev.duty_name}

					{#if isInProgress}
						<span class="b"> STUDENTS IN PROGRESS</span>
					{/if}
				</a>
			</li>
		{/each}
	</ul>
	<br />
	<a href="#top" class="flower">&#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046</a>
</div>

<style>
	.aa {
		color: #32bea6;
	}

	.b {
		color: rgb(144, 132, 132);
		font-size: medium;
		font-weight: 500;
		font-style: italic;
	}

	.d {
		color: #83918f;
	}
</style>
