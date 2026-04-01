<script lang="ts">
	import { fuzzySearch, SearchInput } from '$lib/components/filters/index.js';
	import { DUTY_LEVELS, getDutyObjects } from '../../stores/dataStore.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchTerm = $state('');

	let filteredUsers = $derived(
		fuzzySearch(
			data.users.filter((u) => u.active),
			searchTerm,
			(user) => {
				const searchStr = user.user_duties
					.map((d) => {
						const area = data.regions?.find((r) => r.region_id === d.region_id)?.region_name || '';

						const levelName =
							(Object.keys(DUTY_LEVELS) as Array<keyof typeof DUTY_LEVELS>).find(
								(key) => DUTY_LEVELS[key] === d.level
							) || '';

						return `${d.type} ${levelName} ${area}`;
					})
					.join(' ');

				return `${user.user_name} ${user.user_email} ${user.user_phone} ${searchStr}`;
			}
		)
	);

	let pageName = 'Colleagues';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div id="top" class="main">
	<hgroup>
		<h3>StartsWith Colleagues</h3>
		<i>Colleagues:&nbsp;{data.users.length}</i>
	</hgroup>

	<div class="search-input">
		<SearchInput bind:searchTerm count={filteredUsers.length} placeholder="Search for..." />
	</div>

	<br />
	<ul>
		{#each filteredUsers as user}
			{#if user.active}
				<li class="li">
					<strong>{user.user_name}</strong>
					{' 🏠 '}<span class="duties-container">
						{#if user.user_duties.length === 0}
							<span class="no-duty">Nincs jogosultság</span>
						{:else}
							{@const currentDuties = getDutyObjects(user, data.regions)}
							{#each currentDuties as duty, i}
								<span class="duty-item">
									<strong class="duty-type-{duty.type.toLowerCase()}">
										{duty.type}
									</strong>
									☞ {duty.fullText}
									{#if i < currentDuties.length - 1}
										|{' '}
									{/if}
								</span>
							{/each}
						{/if}
					</span>
					{' ☎️ '}
					{user.user_phone}
					{' 📝 '}
					<strong><small>{user.user_email}</small></strong>
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
		font-size: 0.8rem;
		font-weight: 400;
	}
</style>
