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
		<h6>{data.event.event_name}</h6>
	</hgroup>

	<hgroup>
		<ul class="ac">
			<li class="lb">
				Időpont: {formatDate(data.event.closing_date)}, {timeSlugify(data.event.closing_date)}
			</li>
			<li class="lb">Szervező: {data.event.on_duty_name}</li>
			<li class="lb">Startswith kapcsolat:</li>

			<div>
				{#each data.event.User as u}
					<ul>
						<li class="lb">
							Név: {u.user_name}
						</li>
					</ul>
				{/each}
			</div>

			<li class="lb">Esemény formája: {data.event.event_type_name}</li>
			<li class="lb">Becsült résztvevők száma: {data.event.estimated_student}</li>
			<li class="lb">Iskola:</li>

			<ul>
				<li class="lb">
					<a href="../../lists/all_schools/{data.school?.school_id}" class="aa">
						{data.school?.school_name}
						{' 🏠 '}
						{data.cityname}
					</a>
				</li>
			</ul>

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
