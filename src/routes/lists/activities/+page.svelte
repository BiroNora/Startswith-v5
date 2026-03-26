<script lang="ts">
	import { dateSlugify, dutyMap } from '../../stores/dataStore.js';
	import { SearchInput, fuzzySearch } from '$lib/components/filters';
	import { enhance } from '$app/forms';

	let { data, form } = $props<{ data: any; form: any }>();

	let user_duty_array = $derived(data.user_duty.filter((n: any) => n % 10 !== 0));
	let user_duties_only = $derived(user_duty_array.map((n: any) => parseInt(String(n)[0], 10)));
	let dda = $derived(data.dir_duty);

	let searchTerm = $state('');
	let filteredActivities = $derived(
		fuzzySearch(
			data.activities,
			searchTerm,
			(act: any) => `${act.act_name} ${act.act_note ?? ''} ${dateSlugify(String(act.end_date))}`
		)
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
			{#if data.dir_flag}
				<a href="../lists/activities/central_message" class="ab pad-bot-plus">
					&#9758; Központi üzenet hozzáadása
				</a>
			{/if}
		</div>
	</div>

	<div class="search-input">
		<SearchInput
			bind:searchTerm
			count={filteredActivities.length}
			placeholder="Search activities..."
		/>
	</div>

	<br />
	<ul id="list">
		{#each filteredActivities as act (act.act_id)}
			{#if data.is_director}
				"act.dir_flag: " {act.dir_flag}
				"dir_duty: " {data.dir_duty}
				"dda?" " {act.on_duty.charAt(0)}
				<!-- User === director && only own messages -->

				{#if act.dir_flag && act.on_duty.charAt(0) === dda}
					<li class="li">
						<a
							href="#nothing"
							class="aa"
							onclick={() => {
								activityToDelete = act.act_id;
								openDeleteModal();
							}}
							title="Kattintson az esemény törléséhez"
						>
							{dateSlugify(String(act.end_date))}
							&#9753
							<strong>{act.act_name}</strong>
							&#10087
							{#if act.act_note !== null}
								{act.act_note}
							{/if}
							{' 🏠 '}
							{#each dutyMap as item (item.id)}
								{#if act.on_duty.charAt(0) === item.id}
									{item.name}:
								{/if}
							{/each}
							{#if act.on_duty.charAt(1) === '0'}
								every regions
							{:else}
								{#each data.regio as reg}
									{#if Number(act.on_duty.slice(1)) === reg.region_id}
										{reg.region_name}
									{/if}
								{/each}
							{/if}
						</a>
					</li>
				{/if}
				<!-- User === director && only concerning messages -->

				{#if !act.dir_flag && act.on_duty.charAt(0) === dda}
					<li class="li">
						{dateSlugify(String(act.end_date))}
						&#9753
						<strong>{act.act_name}</strong>
						&#10087
						{#if act.act_note !== null}
							{act.act_note}
						{/if}
						{' 🏠 '}
						{#each dutyMap as item (item.id)}
							{#if act.on_duty.charAt(0) === item.id}
								{item.name}:
							{/if}
						{/each}
						{#if act.on_duty.charAt(1) === '0'}
							every regions
						{:else}
							{#each data.regio as reg}
								{#if Number(act.on_duty.slice(1)) === reg.region_id}
									{reg.region_name}
								{/if}
							{/each}
						{/if}
					</li>
				{/if}
			{:else}
				"act.dir_flag NOT DIR: " {act.dir_flag}
				"dir_duty NOT DIR: " {data.dir_duty}
				"dda? NOT DIR" " {act.on_duty.charAt(0)}
				<!-- User !== director && (own (director's || director's all_region)) messages -->

				{#if act.dir_flag && (user_duty_array.includes(Number(act.on_duty)) || (user_duties_only.includes(Number(act.on_duty.charAt(0))) && act.all_region))}
					<li class="li">
						{dateSlugify(String(act.end_date))}
						&#9753
						<strong>{act.act_name}</strong>
						&#10087
						{#if act.act_note !== null}
							{act.act_note}
						{/if}
						{' 🏠 '}
						{#each dutyMap as item (item.id)}
							{#if act.on_duty.charAt(0) === item.id}
								{item.name}:
							{/if}
						{/each}
						{#if act.on_duty.charAt(1) === '0'}
							every regions
						{:else}
							{#each data.regio as reg}
								{#if Number(act.on_duty.slice(1)) === reg.region_id}
									{reg.region_name}
								{/if}
							{/each}
						{/if}
					</li>
				{/if}

				<!-- User !== director, any others -->

				{#if !act.dir_flag}
					<li class="li">
						<a href="../lists/activities/{act.act_id}" class="aa">
							{dateSlugify(String(act.end_date))}
							&#9753
							<strong>{act.act_name}</strong>
							&#10087
							{#if act.act_note !== null}
								{act.act_note}
							{/if}
							{' 🏠 '}
							{#each dutyMap as item (item.id)}
								{#if act.on_duty.charAt(0) === item.id}
									{item.name}:
								{/if}
							{/each}
							{#each data.regio as reg}
								{#if Number(act.on_duty.slice(1)) === reg.region_id}
									{reg.region_name}
								{/if}
							{/each}
						</a>
					</li>
				{/if}
			{/if}
		{/each}
	</ul>
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
