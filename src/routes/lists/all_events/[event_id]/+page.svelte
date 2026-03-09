<script lang="ts">
	import { formatDate, subjectMap, timeSlugify } from '../../../stores/dataStore.js';

	let { data } = $props();

	let pageName = 'Event Details';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div id="top" class="main">
	<h1>Event Details</h1>
	<hgroup>
		<h3>{data.event.event_name}</h3>
		<br />
		<h4 class="h41">Adatok</h4>
		<ul class="ab">
			<li class="lb">
				Időpont: {formatDate(data.event.closing_date)}, {timeSlugify(data.event.closing_date)}
			</li>
			<li class="lb">Szervező: {data.event.on_duty_name}</li>
			<li class="ld">Startswith kapcsolat:</li>
			<hgroup>
				{#each data.event.User as u}
					<ul class="ad">
						<li class="lc">
							Név: {u.user_name}
						</li>
					</ul>
				{/each}
			</hgroup>
			<li class="lb">Esemény formája: {data.event.event_type_name}</li>
			<li class="lb">Becsült résztvevők száma: {data.event.estimated_student}</li>
			<li class="lb">Iskola:</li>
			<hgroup>
				<ul class="ac">
					<li class="la">
						<a href="../../lists/all_schools/{data.school?.school_id}" class="aa">
							{data.school?.school_name}
							{' 🏠 '}
							{data.cityname}
						</a>
					</li>
				</ul>
			</hgroup>
			<li class="lb">Feljegyzés: {data.event.note || 'Nincs feljegyzés'}</li>
			<li class="lb">
				Érdeklődő diákok:
				{#if !data.inters || data.inters.length === 0}
					<span class="no-data">Nincsenek érdeklődő diákok</span>
				{/if}
			</li>
			{#if data.inters && data.inters.length > 0}
				<hgroup>
					{#each data.inters as ints}
						<ul class="ac">
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
				</hgroup>
			{/if}
		</ul>
	</hgroup>
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
		font-size: 22px;
	}

	.ab {
		color: #1f2222;
		padding: 2%;
		padding-bottom: 0%;
		font-weight: 400;
		line-height: normal;
		font-size: 22px;
	}

	.ac {
		color: #1f2222;
		font-weight: 400;
		line-height: normal;
		padding-top: 1%;
		padding-left: 5%;
		text-indent: -6%;
		font-size: 22px;
	}

	.ad {
		color: #1f2222;
		font-weight: 400;
		line-height: normal;
		padding-left: 5%;
		text-indent: -6%;
		font-size: 22px;
	}

	.la {
		list-style-type: none;
		padding-left: 5%;
		text-indent: -6%;
		line-height: 1.4;
		font-size: 22px;
	}

	.lb {
		list-style-position: inside;
		list-style-type: circle;
		padding-left: 5%;
		text-indent: -6%;
		line-height: 1.4;
		font-size: 22px;
	}

	.lc {
		list-style-position: inside;
		list-style-type: circle;
		padding-left: 5%;
		text-indent: -6%;
		line-height: normal;
		font-size: 22px;
	}

	.ld {
		list-style-position: inside;
		list-style-type: circle;
		padding-left: 5%;
		text-indent: -6%;
		line-height: 1.4;
		padding-bottom: 1%;
		font-size: 22px;
	}

	.flower {
		font-size: 140%;
		color: #a0a9a8;
		text-decoration: none; /* Remove underline */
	}

	.flower:hover {
		font-size: 140%;
		color: #32bea6;
		text-decoration: none; /* Remove underline */
	}

	.h41 {
		color: #83918f;
	}
</style>
