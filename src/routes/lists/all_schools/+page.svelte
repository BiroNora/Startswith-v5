<script lang="ts">
	import { fuzzySearch, SearchInput } from '$lib/components/filters/index.js';

	let { data } = $props();

	let searchTerm = $state('');
	let filteredSchools = $derived(
		fuzzySearch(data.schools, searchTerm, (s) => {
			let searchStr = `${s.school_name} ${s.city?.city_name} ${s.region?.region_name} ${s.county?.county_name}`;

			if (s.basic) searchStr += ' basic';
			if (s.medior) searchStr += ' medior';
			if (s.high) searchStr += ' high';

			return searchStr;
		})
	);

	let pageName = 'School List';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div id="top" class="main">
	<hgroup>
		<h3>School List*</h3>
		<i>&emsp;*Grey colored schools have no Startswith connection</i>
		<i>&emsp;Number of schools: {data.schools.length}</i>
	</hgroup>

	<div class="search-input">
		<SearchInput bind:searchTerm count={filteredSchools.length} placeholder="Search in events..." />
	</div>

	<br />
	<ul>
		{#each filteredSchools as s}
			<li class="li">
				<a href="../lists/all_schools/{s.school_id}" class={s.User.length > 0 ? 'aa' : 'bb'}>
					{s.school_name} 🏠 {s.region?.region_name} &#10047; {s.county?.county_name} &#10047; {s.city?.city_name} ✺

					<strong class="s1">
						{s.basic ? ' BASIC ' : ''}
						{s.medior ? ' MEDIOR ' : ''}
						{s.high ? ' HIGH ' : ''}
					</strong>

					{#if !s.active || !s.coop}
						{' ⚠️ '}
						<strong class="s">
							{!s.active ? 'NOT ACTIVE' : 'NO COOPERATION'}
						</strong>
					{/if}
				</a>
			</li>
		{/each}
	</ul>

	<br />
	<a href="#top" class="flower"
		>&#10046; &nbsp; &#10046; &nbsp; &#10046; &nbsp; &#10046; &nbsp; &#10046;</a
	>
</div>

<style>
	.aa {
		color: #09c6a7;
	}

	.bb {
		color: rgb(144, 132, 132);
		line-height: normal;
		font-weight: 400;
		font-size: 20px;
		font-style: italic;
	}

	.s {
		font-size: 18px;
		font-weight: 500;
		color: tomato;
	}

	.s1 {
		font-size: 18px;
		font-weight: 500;
		color: rgb(144, 132, 132);
	}
</style>
