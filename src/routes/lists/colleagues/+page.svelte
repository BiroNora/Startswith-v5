<script lang="ts">
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

	// Szűrt lista - automatikusan újraszámolódik, ha a searchTerm vagy a data.users változik
	let filteredUsers = $derived(
		data.users.filter((user) => {
			if (!user.active) return false;

			const dutyText = getDutyLabel(user.on_duty);
			const searchStr =
				`${user.user_name} ${user.user_email} ${user.user_phone} ${dutyText}`.toLowerCase();
			return searchStr.includes(searchTerm.toLowerCase());
		})
	);

	let count = $derived(filteredUsers.length);
	let pageName = 'Colleagues';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div id="top" class="main">
	<h1>StartsWith Colleagues</h1>

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
	.main {
		padding-left: 5%;
		padding-top: 2%;
		padding-right: 5%;
	}

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

	.flower {
		font-size: 140%;
		color: #a0a9a8;
		padding-top: 1%;
		text-decoration: none; /* Remove underline */
	}

	.flower:hover {
		font-size: 140%;
		color: #32bea6;
		padding-top: 1%;
		text-decoration: none; /* Remove underline */
	}
</style>
