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

<div class="main">
	<hgroup>
		<h1>School List* <i>&emsp;*Grey colored schools have no Startswith connection</i></h1>
		<h4 class="z">Number of schools: {data.schools.length}</h4>
	</hgroup>

	<div class="input-container">
		<SearchInput bind:searchTerm count={filteredSchools.length} placeholder="Search in events..." />
	</div>

	<br />
	<ul id="list">
		{#each filteredSchools as s}
			<li class="li">
				<a href="../lists/all_schools/{s.school_id}" class={s.User.length > 0 ? 'aa' : 'bb'}>
					{s.school_name} 🏠 {s.region?.region_name} ➔ {s.county?.county_name} ➔ {s.city?.city_name} ✺

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
		padding: 2%;
		font-weight: 480;
		font-size: 20px;
	}

	.bb {
		color: rgb(144, 132, 132);
		padding: 2%;
		font-weight: 400;
		font-size: 20px;
		font-style: italic;
	}

	.li {
		list-style-position: inside;
		list-style-type: disc;
		color: rgb(144, 132, 132);
		padding-left: 5%;
		text-indent: -6%;
		line-height: 1.35;
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

	.z {
		color: rgb(144, 132, 132);
		font-size: medium;
		font-weight: 400;
		font-style: italic;
	}

	i {
		font-size: medium;
		font-weight: 300;
	}
</style>
