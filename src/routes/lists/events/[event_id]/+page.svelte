<script lang="ts">
	import { formatDate, subjectMap, timeSlugify } from '../../../stores/dataStore.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let showEventModal = $state(false);
	let showIntrestModal = $state(false);
	let selectedIntrestId = $state(0);
	let itemNumber = $state(0);

	function add(inters: Array<{ intrest_count?: number }>) {
		return inters.reduce((total, inter) => total + (inter.intrest_count || 0), 0);
	}

	// Function to set the itemNumber
	function setItemNumber(index: number) {
		itemNumber = index + 1;
	}

	// Function to set the selected intrest_id
	function setSelectedIntrestId(intrest_id: number) {
		selectedIntrestId = intrest_id;
	}

	let pageName = 'My Event Profile';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div id="top" class="main">
	<hgroup>
		<h3>Event Details</h3>
		<div><h5>{data.event.event_name}</h5></div>
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

	<div class="ac">
		<li class="lb">
			Időpont: {formatDate(data.event.closing_date)}, {timeSlugify(data.event.closing_date)}
		</li>
		<li class="lb">Szervező: {data.dutyName}</li>
		<li class="lb">Esemény formája: {data.eventTypeName}</li>
		<li class="lb">Becsült / megjelent résztvevők száma: {data.event.estimated_student}</li>
		<li class="lb">Feljegyzés: {data.event.note}</li>
		<li class="lb">Iskola:</li>
		<hgroup>
			<ul class="ac">
				<li class="la">
					<a href="../../lists/schools/{data.school?.school_id}" class="aa">
						{data.school?.school_name}
						{' 🏠 '}
						{data.cityname}
					</a>
				</li>
			</ul>
		</hgroup>
		<li class="lb">
			Érdeklődők,&emsp;
			<p class="z">összesen {add(data.inters)} diák</p>
			<strong class="st">(a rögzítés sorrendjében, legfelül a legutoljára rögzített) </strong>:
		</li>
		<hgroup>
			{#each data.inters as ints, index}
				<ul class="ac">
					<p class="lc">
						<input type="hidden" name="int_id" value={ints.intrest_id} />
						<a
							href="#inter"
							class="aa"
							onclick={() => {
								setItemNumber(index);
								setSelectedIntrestId(ints.intrest_id);
								showIntrestModal = true;
							}}
						>
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
					<br />
				</ul>
			{/each}
		</hgroup>
	</div>

	<div>
		<a href="#top" class="flower">&#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046</a
		>
	</div>
</div>

<a
	href="#section4_event"
	role="button"
	class="secondary outline ag h44 w"
	onclick={() => (showEventModal = true)}
>
	<strong class="error1"> &nbsp;&#10008; </strong>
	&nbsp; Esemény törlése* &nbsp;
</a>

<!-- Event delete modal -->

<!-- {#if showEventModal}
		<form action="?/delUser" method="post" use:enhance>
			<article>
				<h3>Az esemény adatai véglegesen törlődnek.</h3>
				<strong class="g">
					&nbsp;* esemény abban az esetben törölhető, ha nincs hozzárendelt érdeklődő diák, illetve,
					ha az eseménynek egy gazdája van
				</strong>
				{#if form?.intern}
					<p class="ah">&nbsp; Az eseményt nem lehet törölni.</p>
				{/if}
				<footer>
					<button type="submit" class="secondary w z cc" data-target="modal-example">
						Confirm
					</button>
					<button
						type="button"
						class="secondary outline h44 w z"
						data-target="modal-example"
						onclick={() => (showEventModal = false)}
					>
						Cancel
					</button>
				</footer>
			</article>
		</form>
	{/if} -->

<!-- Interested delete modal -->

<!-- {#if showIntrestModal}
				<form action="?/delInterest" method="post" use:enhance id="inter">
					<article>
						<h3>A(z) {itemNumber}. adat véglegesen törlődik.</h3>

						{#if form?.interest}
							<p class="ah">&nbsp; Az adatot nem lehet törölni.</p>
						{/if}

						<input type="hidden" name="int_id" value={selectedIntrestId} />
						<input type="hidden" name="event_id" value={data.event.event_id} />
						<footer>
							<button type="submit" class="secondary w z cc" data-target="modal-example">
								Confirm
							</button>
							<button
								type="button"
								class="secondary outline h44 w z"
								data-target="modal-example"
								onclick={() => ((showIntrestModal = false), scrollToConnect())}
							>
								Cancel
							</button>
						</footer>
					</article>
				</form>
			{/if}
		</ul>
		<a href="#top" class="flower">&#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046</a
		> -->

<!-- Interested students adding form -->

<!-- Event update form -->

<!-- User delete form -->

<style>
	.ab {
		color: #32bea6;
	}

	.error {
		font-weight: bold;
	}
</style>
