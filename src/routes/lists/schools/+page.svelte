<script lang="ts">
	import { fuzzySearch, SearchInput } from '$lib/components/filters/index.js';

	let { data } = $props();

	let schools = $derived(data.schools ?? []);

	let searchTerm = $state('');
	let filteredSchools = $derived(
		fuzzySearch(data.schools, searchTerm, (s) => {
			let searchStr = `${s.school_name} ${s.city?.city_name} ${s.address} ${s.school_email}`;

			return searchStr;
		})
	);

	let pageName = 'My School List';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

{#snippet statusBadge(active: boolean | null | undefined, coop: boolean | null | undefined)}
	{#if active === false}
		<span class="err"> ⚠️ <strong>NOT ACTIVE</strong></span>
	{/if}
	{#if coop === false}
		<span class="err"> ⚠️ <strong>NO COOPERATION</strong></span>
	{/if}
{/snippet}

<div class="main">
	<hgroup>
		<h1>My School List</h1>
		<h4 class="z">Number of schools:&nbsp;{schools.length}</h4>
	</hgroup>

	<div class="input-container">
		<SearchInput bind:searchTerm count={filteredSchools.length} placeholder="Search in events..." />
	</div>

	<br />
	<ul>
		{#each filteredSchools as school (school.school_id)}
			<li class="li">
				<a href="../lists/schools/{school.school_id}" class="aa">
					{school.school_name}
					<span class="icon">🏠</span>
					{school.city?.city_name}
					{', '}
					{school.address}
					<span class="icon">📝</span>
					{school.school_email}

					{@render statusBadge(school.active, school.coop)}
				</a>
			</li>
		{/each}
	</ul>

	<br />
	<a href="#top" class="flower">
		{#each Array(5) as _}
			&#10046; &nbsp;
		{/each}
	</a>
</div>

<style>

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

	.z {
		color: rgb(144, 132, 132);
		font-size: medium;
		font-weight: 400;
		font-style: italic;
	}

	strong {
		font-size: 18px;
		font-weight: 500;
		color: tomato;
	}
</style>
