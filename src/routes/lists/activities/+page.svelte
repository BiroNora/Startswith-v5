<script lang="ts">
	import {
		dateSlugify,
		parseDutyAndRegionAct,
		parseDutyLevelArray
	} from '../../stores/dataStore.js';
	import { SearchInput, fuzzySearch } from '$lib/components/filters';
	import { enhance } from '$app/forms';

	let { data, form } = $props<{ data: any; form: any }>();

	let searchTerm = $state('');
	let allItems = $derived(
		[...(data.activities ?? []), ...(data.c_messages ?? [])].sort((a, b) => {
			return new Date(b.end_date).getTime() - new Date(a.end_date).getTime();
		})
	);

	let filteredItems = $derived(
		fuzzySearch(allItems, searchTerm, (item: any) => {
			const name = item.act_name || item.cm_name || '';
			const note = item.act_note || item.cm_note || '';
			const date = item.end_date ? dateSlugify(String(item.end_date)) : '';

			let dutyText = '';

			if (item.duty_level && Array.isArray(item.duty_level)) {
				// Ha CentralMessage (tömb)
				dutyText = parseDutyLevelArray(item.duty_level, data.regions);
			} else if (item.duty_level) {
				// Ha Activity (szám)
				dutyText = parseDutyAndRegionAct(item.duty_level, data.regions);
			}

			return `${name} ${note} ${date} ${dutyText}`.toLowerCase();
		})
	);

	let showDeleteModal = $state(false);
	let activityToDelete = $state(null);

	function openDeleteModal() {
		form = null;
		showDeleteModal = true;
	}

	function closeDeleteModal() {
		showDeleteModal = false;
		activityToDelete = null;
	}

	$effect(() => {
		if (form?.success) {
			showDeleteModal = false;
		}
	});

	let pageName = 'Activity List';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div id="top" class="main">
	<h3>Activities</h3>

	<div class="admin-actions pad-bot-plus">
		<a href="../lists/activities/activity_form" class="ab pad-bot-plus">
			&#9758; Program hozzáadása
		</a>
		<div>
			{#if data.user.isDirector}
				<a href="../lists/activities/central_message" class="ab pad-bot-plus">
					&#9758; Központi üzenet hozzáadása
				</a>
			{/if}
		</div>
	</div>

	<div class="search-input">
		<SearchInput bind:searchTerm count={filteredItems.length} placeholder="Search activities..." />
	</div>

	<br />
	<!-- Messages -->
	{#each filteredItems as item}
		{#if item.act_id}
			<li class="li">
				<a
					href="#nothing"
					class="aa"
					onclick={() => {
						activityToDelete = item.act_id;
						openDeleteModal();
					}}
					title="Kattintson az esemény törléséhez"
				>
					{dateSlugify(String(item.end_date))}
					&#9753
					<strong>{item.act_name}</strong>
					&#10087
					{#if item.act_note !== null}
						{item.act_note}
					{/if}
					{' 🏠 '}
					{parseDutyAndRegionAct(item.duty_level, data.regions)}
				</a>
			</li>
		{/if}
		{#if item.cm_id}
			igazgatói
			<li class="li">
				<a
					href="#nothing"
					class="aa"
					onclick={() => {
						activityToDelete = item.cm_id;
						openDeleteModal();
					}}
					title="Kattintson az esemény törléséhez"
				>
					{dateSlugify(String(item.end_date))}
					&#9753
					<strong>{item.cm_name}</strong>
					&#10087
					{#if item.cm_note !== null}
						{item.cm_note}
					{/if}
					{' 🏠 '}
					{parseDutyLevelArray(item.duty_level, data.regions)}
				</a>
			</li>
		{/if}
	{/each}

	<br />
	<a href="#top" class="flower">&#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046</a>

	{#if showDeleteModal}
		<dialog open>
			<article>
				<header>
					<a href="#close" aria-label="Close" class="close" onclick={closeDeleteModal}></a>
					<h5>Confirm Deletion</h5>
				</header>
				<form action="?/delAct" method="post" use:enhance id="inter">
					<input type="hidden" name="act_id" value={activityToDelete} />
					<h5>Az adat véglegesen törlődik.</h5>

					{#if form?.interest}
						<p class="black">&nbsp; Az adatot nem lehet törölni.</p>
					{/if}

					<footer>
						<button type="submit" class="btn" data-target="modal-example"> Confirm </button>
						<button
							type="button"
							class="btn btn-cancel btn-outline"
							data-target="modal-example"
							onclick={() => (showDeleteModal = false)}
						>
							Cancel
						</button>
					</footer>
				</form>
			</article>
		</dialog>
	{/if}
</div>

<style>
	.ab {
		color: #32bea6;
	}
</style>
