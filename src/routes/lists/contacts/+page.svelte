<script lang="ts">
	import { fuzzySearch, SearchInput } from '$lib/components/filters';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchTerm = $state('');
	let filteredContacts = $derived(
		fuzzySearch(
			data.contacts,
			searchTerm,
			(c) => `${c.contact_name} ${c.contact_email} ${c.contact_phone}`
		)
	);

	let pageName = 'My Contact List';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div id="top" class="main">
	<hgroup>
		<h3>My Contact List</h3>
	</hgroup>

	<div class="search-input">
		<SearchInput bind:searchTerm count={filteredContacts.length} placeholder="Search for..." />
	</div>

	<br />
	<ul>
		{#each filteredContacts as contact}
			<li class="li">
				<a href="../lists/contacts/{contact.contact_id}" class="aa">
					{contact.contact_name}
					<span class="icons">☎️</span>
					{contact.contact_phone}
					<span class="icons">📝</span>
					{contact.contact_email}

					{#if !contact.active}
						⚠️ <strong>NOT ACTIVE</strong>
					{/if}
				</a>
			</li>
		{/each}
	</ul>

	<a href="#top" class="flower">&#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046</a>
</div>
