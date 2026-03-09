<script lang="ts">
	import { dateSlugify } from '../../stores/dataStore';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchTerm = $state('');

	// Reaktív szűrt lista
	let filteredEvents = $derived(
		data.events.filter((ev) =>
			`${ev.event_name} ${ev.school_name} ${ev.duty_name}`
				.toLowerCase()
				.includes(searchTerm.toLowerCase())
		)
	);

	let count = $derived(filteredEvents.length);

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
		<input type="search" bind:value={searchTerm} placeholder="Search for..." />
	</div>

	{#if searchTerm !== ''}
		<div class="z">
			{#if count === 0}
				&nbsp; No Result
			{:else}
				&nbsp; <span>{count}</span> {count === 1 ? 'Result' : 'Results'}
			{/if}
		</div>
	{/if}

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
		font-size: 23px;
	}

	.li {
		list-style-position: inside;
		list-style-type: disc;
		color: rgb(144, 132, 132);
		padding-left: 5%;
		text-indent: -6%;
		line-height: 2;
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
