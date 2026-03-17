<script lang="ts">
	import { fuzzySearch, SearchInput } from '$lib/components/filters/index.js';
	import { dutyMap, dutyType } from '../../stores/dataStore.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchTerm = $state('');

	// Segédfüggvény a tisztségek szöveges megjelenítéséhez
	function getDutyLabel(onDutyArray: number[]): string {
		return onDutyArray
			.filter((n) => n % 10 !== 0)
			.map((n) => {
				const s = n.toString();
				const typeChar = s.charAt(0);
				const targetChar = s.charAt(1);

				const type = dutyType.find((t) => t[0] === typeChar)?.[1] || 'Unknown';
				let area = '';

				if (typeChar === '5') {
					area = dutyMap.find((m) => m.id === targetChar)?.name || 'Unknown';
				} else {
					area =
						data.regions.find((r) => r.region_id === Number(targetChar))?.region_name || 'Unknown';
				}
				return `${type}: ${area}`;
			})
			.join(', ');
	}

	let filteredUsers = $derived(
    fuzzySearch(
      data.users.filter(u => u.active), // Csak az aktívakat nézzük
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
	<h1>StartsWith Colleagues</h1>

	<div class="input-container">
		<SearchInput bind:searchTerm count={filteredUsers.length} placeholder="Search for..." />
	</div>

	<br />
	<ul id="list">
		{#each filteredUsers as user}
			{#if user.active}
				<li class="li aa">
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

	.aa {
		color: #32bea6;
		font-weight: 400;
		line-height: normal;
		font-size: 23px;
	}

	.z {
		color: rgb(144, 132, 132);
		font-size: medium;
		font-weight: 400;
		font-style: italic;
	}

	.li {
		list-style-position: inside;
		list-style-type: disc;
		padding-left: 5%;
		text-indent: -6%;
		line-height: 2;
	}
</style>
