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
	.main {
		padding-left: 5%;
		padding-top: 2%;
		padding-right: 5%;
	}

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

	.input-container {
		position: relative;
	}

	.clear-button {
		position: absolute;
		width: auto;
		top: 35%;
		right: 38px;
		transform: translateY(-50%);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		font-size: 1.2rem;
		color: #32bea6;
	}

	i {
		font-size: medium;
		font-weight: 300;
	}
</style>
