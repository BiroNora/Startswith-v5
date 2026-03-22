<script lang="ts">
	import { formatDate, subjectMap, timeSlugify } from '../../../stores/dataStore.js';

	let { data } = $props();

	let pageName = 'Event Details';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div id="top" class="main">
	<hgroup>
		<h3>Event Details</h3>
		<h5>{data.event.event_name}</h5>
	</hgroup>

	<hgroup>
		<ul class="ac">
			<li class="lb">
				Időpont: {formatDate(data.event.closing_date)}, {timeSlugify(data.event.closing_date)}
			</li>
			<li class="lb">Szervező: {data.event.on_duty_name}</li>
			<li class="lb pad-bot-plus">
				Startswith (belső) kapcsolat:
				{#if !data.event.User || data.event.User.length === 0}
					<span>Nincs</span>
				{:else}
					<div class="ac">
						{#each data.event.User as u}
							<div>
								Név: {u.user_name}
							</div>
						{/each}
					</div>
				{/if}
			</li>

			<li class="lb">Esemény formája: {data.event.event_type_name}</li>
			<li class="lb">Becsült résztvevők száma: {data.event.estimated_student}</li>
			<li class="lb pad-bot-plus">
				Iskola:
				<div class="ac">
					<a href="../../lists/all_schools/{data.school?.school_id}" class="aa">
						{data.school?.school_name}
						{' 🏠 '}
						{data.cityname}
					</a>
				</div>
			</li>

			<li class="lb">Feljegyzés: {data.event.note || 'Nincs feljegyzés'}</li>
			<li class="lb">
				Érdeklődő diákok:
				{#if !data.inters || data.inters.length === 0}
					<span class="no-data">Nincsenek érdeklődő diákok</span>
				{/if}
			</li>

			<div class="ac">
				{#if data.inters && data.inters.length > 0}
					{#each data.inters as ints}
						<ul>
							<li class="lb">Diákok száma: {ints.intrest_count}</li>
							{#each data.countries as country}
								{#if country.country_id === ints.country_id}
									<li class="lb">Ország: {country.country_name}</li>
								{/if}
							{/each}
							<li class="lb">Évfolyam: {ints.grade}</li>
							{#each data.regions as regio}
								{#if regio.region_id === ints.region_id}
									<li class="lb">Régió, ahonnan értesült a programról: {regio.region_name}</li>
								{/if}
							{/each}
							<li class="lb">Csatorna, ahonnan értesült a programról: {ints.channel}</li>
							{#if ints.applied === true}
								{#each subjectMap as subject (subject.id)}
									{#if ints.work_title === subject.id}
										<li class="lb">Jelentkezési téma: {subject.name}</li>
									{/if}
								{/each}
								<li class="lb">Státusza: {ints.status}</li>
							{:else}
								<li class="lb">Nem jelentkezett</li>
							{/if}
							<br />
						</ul>
					{/each}
				{/if}
			</div>
		</ul>
	</hgroup>

	<br />
	<a href="#top" class="flower">&#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046</a>
</div>

<style>
	.aa {
		color: #32bea6;
	}
</style>
