<script lang="ts">
	import { fuzzySearch, SearchInput } from '$lib/components/filters';
	import { dateSlugify } from '../../stores/dataStore';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchTerm = $state('');
	let filteredEvents = $derived(
    fuzzySearch(data.events, searchTerm, (ev) =>
      `${ev.event_name} ${ev.school_name} ${ev.duty_name}`
    )
  );

	let count = $derived(data.events.length);

	let pageName = 'My Event List';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div class="main">
	<hgroup>
		<h1>My Event List</h1>
		<h4 class="z">Number of events:&nbsp;{count}</h4>
	</hgroup>

	<div class="input-container">
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
	.main {
		padding-left: 5%;
		padding-top: 2%;
		padding-right: 5%;
	}

	.aa {
		color: #32bea6;
		padding: 2%;
		font-weight: 400;
		line-height: normal;
		font-size: 20px;
	}

	.li {
		list-style-position: inside;
		list-style-type: disc;
		color: rgb(144, 132, 132);
		padding-left: 5%;
		text-indent: -6%;
		line-height: 1.35;
	}

	.b {
		color: rgb(144, 132, 132);
		font-size: medium;
		font-weight: 500;
		font-style: italic;
	}

	.d {
		color: #087361;
	}

	.z {
		color: rgb(144, 132, 132);
		font-size: medium;
		font-weight: 400;
		font-style: italic;
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
