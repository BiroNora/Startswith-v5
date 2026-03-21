<script lang="ts">
	import { formatDate } from '../../../stores/dataStore.js';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();

	let pageName = 'School Details';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div id="top" class="main">
	<div id="base">
		<hgroup>
			<h3>School Details</h3>
			<div>
				{#if !data.school.active || !data.school.coop}
					<h5>{data.school.school_name} {' ⚠️ '}</h5>
				{:else if data.school.active}
					<h5>{data.school.school_name}</h5>
				{/if}
			</div>

			<div class="aa">
				{data.school.zip_code}
				{data.school.city?.city_name}
				{data.school.address}
			</div>
			<div class="aa">
				{data.school.country?.country_name} / {data.school.region?.region_name} régió / {data.school
					.county?.county_name}
				megye
			</div>
			<i>Események száma:&nbsp;{data.event.length}</i>
		</hgroup>

		<a href="/lists/all_schools/{data?.school?.school_id}/contact_update" class="ab"> &#9758; Startswith kapcsolat hozzáadása </a>
		&nbsp;&nbsp;
		<a href="/lists/all_schools/{data?.school?.school_id}/contact_delete" class="ab">
			<strong class="error">&#10008;</strong>&nbsp; Startswith kapcsolat törlése
		</a>

		<div>
			<ul class="ac">
				<li class="lb">OM szám: {data.school.om_id || 'Nincs megadva'}</li>
				<li class="lb">Igazgató: {data.school.dir_name || 'Nincs megadva'}</li>
				<li class="lb">Iskola telefon: {data.school.dir_phone || 'Nincs megadva'}</li>
				<li class="lb">Iskola email: {data.school.school_email || 'Nincs megadva'}</li>
				<li class="lb">Website: {data.school.website || 'Nincs megadva'}</li>
				<li class="lb">Iskola típusa: {data.resS}</li>
				<li class="lb">Felelős: {data.resD}</li>
				<li class="lb">Feljegyzés: {data.school.note || 'Nincs feljegyzés'}</li>
				<li class="lb">Startswith (belső) felelősök:</li>

				<div>
					{#each data.internalContacts as u}
						<ul>
							<li class="lb">
								Név: {u.user_name}
							</li>
						</ul>
					{/each}
				</div>

				<li class="lb">Iskolai (külső) kapcsolat:</li>
				<div>
					{#each data.externalContacts as con}
						<ul>
							<li class="lb">
								Név: {con.contact_name}
							</li>
							<li class="lb">Telefon: {con.contact_phone || 'Nincs'}</li>
							<li class="lb">Email: {con.contact_email || 'Nincs'}</li>
							<li class="lb">Feljegyzés: {con.contact_note || 'Nincs feljegyzés'}</li>
						</ul>
					{/each}
				</div>
			</ul>
			<div class="aa">Események</div>
			<ul class="ac">
				{#each data.event as e}
					<li class="li">
						<a href="../../lists/all_events/{e.event_id}" class="aa">
							{formatDate(e.closing_date)}
							&#9753
							{e.event_name}
							&#10086
							{e.on_duty_name}
							&#10087
							{e.event_type_name}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<br />
		<a href="#top" class="flower">&#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046</a
		>
	</div>
</div>

<style>
	.ab {
		color: #32bea6;
	}
</style>
