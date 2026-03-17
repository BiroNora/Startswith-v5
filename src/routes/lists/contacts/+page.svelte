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

<div class="main">
	<h1>My Contact List</h1>

	<div class="input-container">
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
	<br />
	<a href="#top" class="flower">&#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046</a>
</div>

<style>

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
		line-height: 1.35;
	}

	strong {
		font-weight: 500;
		color: tomato;
	}
</style>
