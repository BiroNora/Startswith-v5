<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatDate, subjectMap, timeSlugify } from '../../../stores/dataStore.js';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showEventModal = $state(false);
	let showInterestModal = $state(false);
	let selectedInterestId = $state(0);
	let itemNumber = $state(0);

	const totalInterested = $derived(
		data.inters?.reduce((total, inter) => total + (inter.intrest_count || 0), 0) ?? 0
	);

	function openDeleteModal(index: any, id: any) {
		form = null;
		itemNumber = index + 1;
		selectedInterestId = id;
		showInterestModal = true;
	}

	function openEventModal() {
		form = null;
		showEventModal = true;
	}

	$effect(() => {
		if (form?.success) {
			showEventModal = false;
			showInterestModal = false;
		}
	});

	let pageName = 'My Event Profile';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div id="top" class="main">
	<hgroup>
		<h3>Event Details</h3>
		<div>
			<a
				href="#section4_event"
				class="black"
				onclick={openEventModal}
				title="Kattintson az esemény törléséhez"
			>
				<h5 class="event-title-link">{data.event.event_name}</h5>
			</a>
		</div>
	</hgroup>

	<div class="admin-actions">
		<div class="row1">
			<a href="/lists/events/{data?.event?.event_id}/interested_students" class="ab">
				<span>&#9758;</span> Érdeklődő diákok hozzáadása
			</a>

			<a href="/lists/events/{data?.event?.event_id}/contact_adding" class="ab">
				<span>&#9758;</span> Startswith kapcsolat hozzáadása
			</a>
		</div>

		<div class="row2">
			<a href="/lists/events/{data?.event?.event_id}/event_update" class="ab edit-link">
				<span>&#9998;</span> Esemény adatainak módosítása
			</a>

			<a href="/lists/events/{data?.event?.event_id}/contact_delete" class="ab delete-link">
				<span class="error">&#10008;</span> Startswith kapcsolat törlése
			</a>
		</div>
	</div>

	<div>
		<ul class="ac ad">
			<li class="lb">
				Időpont: {formatDate(data.event.closing_date)}, {timeSlugify(data.event.closing_date)}
			</li>
			<li class="lb">Szervező: {data.dutyName}</li>
			<li class="lb">Esemény formája: {data.eventTypeName}</li>
			<li class="lb">Becsült / megjelent résztvevők száma: {data.event.estimated_student}</li>
			<li class="lb">Feljegyzés: {data.event.note}</li>
			<li class="lb">Iskola:</li>

			<li class="le e">
				<a href="../../lists/schools/{data.school?.school_id}" class="aa lb">
					{data.school?.school_name}
					{' 🏠 '}
					{data.cityname}
				</a>
			</li>

			<li class="lb">
				Érdeklődők: összesen {totalInterested} diák
				{#if totalInterested !== 0}
					<i>(a rögzítés sorrendjében, legfelül a legutoljára rögzített)</i>
				{/if}
			</li>

			<div class="ac ae">
				{#each data.inters as ints, index}
					<ul class="ac">
						<p class="lc f">
							<input type="hidden" name="int_id" value={ints.intrest_id} />
							<a href="#inter" class="aa" onclick={() => openDeleteModal(index, ints.intrest_id)}>
								{index + 1}. adat törlése
							</a>
						</p>
						<li class="lb">
							Diákok száma: {ints.intrest_count}
						</li>
						{#each data.countries as country}
							{#if country.country_id === ints.country_id}
								<li class="lb">Ország: {country.country_name}</li>
							{/if}
						{/each}
						<li class="lb">Évfolyam: {ints.grade_name}</li>
						{#each data.regions as regio}
							{#if regio.region_id === ints.region_id}
								<li class="lb">Régió, ahonnan értesült a programról: {regio.region_name}</li>
							{/if}
						{/each}
						<li class="lb">Csatorna, ahonnan értesült a programról: {ints.channel_name}</li>
						{#if ints.applied === true}
							{#each subjectMap as subject (subject.id)}
								{#if ints.work_title === subject.id}
									<li class="lb">Jelentkezési téma: {subject.name}</li>
								{/if}
							{/each}
							<li class="lb">Státusza: {ints.status_name}</li>
						{:else}
							<li class="lb">Nem jelentkezett</li>
						{/if}
					</ul>
				{/each}
			</div>
		</ul>
	</div>

	<br />
	<a href="#top" class="flower">&#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046</a>
</div>

<!-- Event delete modal -->

{#if showEventModal}
	<dialog open>
		<article>
			<header>
				<a href="#close" aria-label="Close" class="close" onclick={() => (showEventModal = false)}
				></a>
				<h5>Confirm Deletion</h5>
			</header>
			<form action="?/delUser" method="post" use:enhance>
				{#if data.isDeletable}
					<div>
						<h6>Az esemény adatai véglegesen törlődnek.</h6>
						<footer>
							<button type="submit" class="btn" data-target="modal-example"> Confirm </button>
							<button
								type="button"
								class="btn btn-cancel btn-outline"
								data-target="modal-example"
								onclick={() => (showEventModal = false)}
							>
								Cancel
							</button>
						</footer>
					</div>
				{:else}
					<div>
						<h5>Az eseményt nem lehet törölni*</h5>
						<i>
							* csak abban az esetben törölhető, ha nincs hozzárendelt érdeklődő diák, illetve, ha
							az eseménynek egy gazdája van
						</i>
					</div>
					<br />
					<footer>
						<button
							type="button"
							class="btn btn-cancel btn-outline"
							data-target="modal-example"
							onclick={() => (showEventModal = false)}
						>
							Cancel
						</button>
					</footer>
				{/if}
			</form>
		</article>
	</dialog>
{/if}

<!-- Interested delete modal -->

{#if showInterestModal}
	<dialog open>
		<article>
			<header>
				<a
					href="#close"
					aria-label="Close"
					class="close"
					onclick={() => (showInterestModal = false)}
				></a>
				<h5>Confirm Deletion</h5>
			</header>
			<form action="?/delInterest" method="post" use:enhance id="inter">
				<h5>A(z) {itemNumber}. adat véglegesen törlődik.</h5>

				{#if form?.interest}
					<p class="black">&nbsp; Az adatot nem lehet törölni.</p>
				{/if}

				<input type="hidden" name="int_id" value={selectedInterestId} />
				<input type="hidden" name="event_id" value={data.event.event_id} />
				<footer>
					<button type="submit" class="btn" data-target="modal-example"> Confirm </button>
					<button
						type="button"
						class="btn btn-cancel btn-outline"
						data-target="modal-example"
						onclick={() => (showInterestModal = false)}
					>
						Cancel
					</button>
				</footer>
			</form>
		</article>
	</dialog>
{/if}

<style>
	dialog[open] {
		position: fixed;
		z-index: 10000;
	}

	i {
		font-size: small;
		line-height: normal;
	}

	.event-title-link {
		text-decoration: none;
		color: inherit;
		transition: color 0.2s ease;
		display: inline-block;
		margin: 0;
	}

	.event-title-link:hover,
	.event-title-link:active {
		color: #32bea6 !important;
		text-decoration: none;
	}

	.ab {
		color: #32bea6;
	}

	.ad {
		padding-bottom: 0;
	}

	.ae {
		padding-top: 0;
	}

	.e {
		line-height: 1.5rem;
		padding-bottom: 0.5rem;
	}

	.f {
		line-height: 1rem;
	}

	.error {
		font-weight: bold;
	}
</style>
