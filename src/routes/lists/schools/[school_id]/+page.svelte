<script lang="ts">
	import { formatDate } from '../../../stores/dataStore.js';

	let { data } = $props() as { data: any; form: any };

	let yesA = $state(false);
	let yesB = $state(false);
	let yesC = $state(false);
	let yesD = $state(false);
	let yesE = $state(false);
	let yesF = $state(false);
	let yesG = $state(false);
	let yesH = $state(false);
	let yesI = $state(false);
	let yesJ = $state(false);
	let yesK = $state(false);
	let yesL = $state(false);
	let yesM = $state(false);
	let yesN = $state(false);
	let yesO = $state(false);

	let yesBAS = $state(false);
	let yesMED = $state(false);
	let yesHIG = $state(false);

	let yesCOOP = $state(true);
	let yesACT = $state(true);

	$effect(() => {
		yesA = data.school.school_type.includes('1');
		yesB = data.school.school_type.includes('2');
		yesC = data.school.school_type.includes('3');
		yesD = data.school.school_type.includes('4');
		yesE = data.school.school_type.includes('5');
		yesF = data.school.school_type.includes('6');
		yesG = data.school.school_type.includes('7');
		yesH = data.school.school_type.includes('8');
		yesI = data.school.school_type.includes('9');
		yesJ = data.school.school_type.includes('10');
		yesK = data.school.school_type.includes('11');
		yesL = data.school.school_type.includes('12');
		yesM = data.school.school_type.includes('13');
		yesN = data.school.school_type.includes('14');
		yesO = data.school.school_type.includes('15');

		yesBAS = data.school.duty.includes('1');
		yesMED = data.school.duty.includes('2');
		yesHIG = data.school.duty.includes('3');

		yesCOOP = data.school.coop ?? true;
		yesACT = data.school.active ?? true;
	});

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
				&#9758; Esemény hozzáadása
			</a>
			<a href="/lists/schools/{data?.school?.school_id}/contact_form" class="ab">
				&#9758; Iskolai (külső) kapcsolat hozzáadása
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
			<li class="lb">Iskola típusa: {data.resS}</li>
			<li class="lb">Felelős: {data.resD}</li>
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
