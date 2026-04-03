<script lang="ts">
	import { formatDate } from '../../../stores/dataStore.js';

	let { data } = $props() as { data: any; form: any };

	let pageName = 'My School Profile';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div id="top" class="main">
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

	<div class="admin-actions">
		<div class="row1">
			<a href="/lists/schools/{data?.school?.school_id}/event_form" class="ab">
				<span>&#9758;</span> Esemény hozzáadása
			</a>
			<a href="/lists/schools/{data?.school?.school_id}/contact_form" class="ab">
				<span>&#9758;</span> Iskolai (külső) kapcsolat hozzáadása
			</a>
		</div>

		<div class="row1">
			<a href="/lists/schools/{data?.school?.school_id}/school_update" class="ab">
				&#9998; Iskola adatainak módosítása
			</a>
		</div>
	</div>

	<div>
		<ul class="ac">
			<li class="lb">OM szám: {data.school.om_id}</li>
			<li class="lb">Igazgató: {data.school.dir_name}</li>
			<li class="lb">Iskola telefon: {data.school.dir_phone}</li>
			<li class="lb">Iskola email: {data.school.school_email}</li>
			<li class="lb">Website: {data.school.website}</li>
			<li class="lb">Iskola típusa: {data.school_type}</li>
			<li class="lb">Felelős: {data.duty_type}</li>
			<li class="lb">Feljegyzés: {data.school.note}</li>
			<li class="lb">
				Iskolai (külső) kapcsolat:
				{#if !data.contact || data.contact.length === 0}
					<span>Nincs</span>
				{:else}
					<div class="ac">
						{#each data.contact as con}
							<div>
								<a href="../../lists/contacts/{con.contact_id}" class="name-style"
									>{con.contact_name}
								</a>
							</div>
							<div>Telefon: {con.contact_phone}</div>
							<div>Email: {con.contact_email}</div>
							<div>Feljegyzés: {con.contact_note}</div>
							<br />
						{/each}
					</div>
				{/if}
			</li>
		</ul>
	</div>

	<div>
		<div class="aa">Események</div>
		<ul class="ac">
			{#each data.event as e}
				<li class="li">
					<a href="../../lists/events/{e.event_id}" class="aa">
						{formatDate(e.closing_date)} &#9753 {e.event_name} &#10086 {e.on_duty} &#10087 {e.event_type}
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<br />
	<a href="#top" class="flower">&#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046</a>
</div>

<style>
	.ab {
		color: #32bea6;
	}
</style>
