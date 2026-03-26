<script lang="ts">
	import { fuzzySearch, SearchInput } from '$lib/components/filters/index.js';
	import { dutyMap, dutyType } from '../../stores/dataStore.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchTerm = $state('');

	// Segédfüggvény a tisztségek szöveges megjelenítéséhez
	function getDutyLabel(onDutyArray: number[]): string {
		return onDutyArray
			.filter((n) => !(n.toString().length === 2 && n % 10 === 0)) // Itt csak checkolunk
			.map((n) => {
				const s = n.toString();
				const typeChar = s[0];
				const targetChar = s.slice(1);

				const type = dutyType.find((t) => t[0] === typeChar)?.[1] || 'Unknown';
				let area = '';

				if (typeChar === '5') {
					area = dutyMap.find((m) => m.id === targetChar)?.name || 'Unknown';
				} else {
					const regionId = Number(targetChar);
					area = data.regions.find((r) => r.region_id === regionId)?.region_name || 'Unknown';
				}
				return `${type}: ${area}`;
			})
			.join(', ');
	}

	let filteredUsers = $derived(
		fuzzySearch(
			data.users.filter((u) => u.active), // Csak az aktívakat nézzük
			searchTerm,
			(user) => {
				const dutyText = getDutyLabel(user.on_duty);
				return `${user.user_name} ${user.user_email} ${user.user_phone} ${dutyText}`;
			}
		)
	);

	let pageName = 'Colleagues';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div id="top" class="main">
	<h3>StartsWith Colleagues</h3>

	<div class="search-input">
		<SearchInput bind:searchTerm count={filteredUsers.length} placeholder="Search for..." />
	</div>

	<br />
	<ul>
		{#each filteredUsers as user}
			{#if user.active}
				<li class="li">
					{user.user_name}
					{' 🏠 '}
					{getDutyLabel(user.on_duty)}
					{' ☎️ '}
					{user.user_phone}
					{' 📝 '}
					{user.user_email}
				</li>
			{/if}
		{/each}
	</ul>

	<br />
	<a href="#top" class="flower">&#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046</a>
</div>

<style>
	.li {
		color: #09c6a7;
		font-size: 20px;
		font-weight: 400;
	}
</style>
