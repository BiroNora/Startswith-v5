<script lang="ts">
	import { enhance } from '$app/forms';
	import { dutyMap, eventMap, formatDate } from '../../../stores/dataStore.js';

	let { data, form } = $props() as { data: any; form: any };

	// 1. Deklaráljuk az állapotokat alapértelmezett értékkel (üres/false)
	// Így nincs közvetlen 'data' hivatkozás a $state-ben.
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

	let pageName = 'My School Details';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div id="top" class="main">
	<h3>School Details</h3>
	<hgroup>
		{#if !data.school.active || !data.school.coop}
			<h3>{data.school.school_name} {' ⚠️ '}</h3>
		{:else if data.school.active}
			<h3>{data.school.school_name}</h3>
		{/if}
		<hgroup>
			<h6>{data.school.zip_code} {data.city?.city_name} {data.school.address}</h6>
			<p>
				{data.country?.country_name} / {data.region?.region_name} régió / {data.county?.county_name}
				megye
			</p>
			<a href="/lists/schools/{data?.school?.school_id}/event_form" class="aa">
				&#9758; Esemény hozzáadása
			</a>
			&nbsp; &nbsp;
			<a href="/lists/schools/{data?.school?.school_id}/contact_form" class="aa"> &#9758; Kapcsolat hozzáadása </a> &nbsp; &nbsp;
		</hgroup>
		<br />
		<h4 class="h41">Adatok</h4>
		<a href="/lists/schools/{data?.school?.school_id}/school_update" class="ad">
			&#9758; Iskola adatainak módosítása
		</a>
		<ul class="ab">
			<li class="lb">OM szám: {data.school.om_id}</li>
			<li class="lb">Igazgató: {data.school.dir_name}</li>
			<li class="lb">Iskola telefon: {data.school.dir_phone}</li>
			<li class="lb">Iskola email: {data.school.school_email}</li>
			<li class="lb">Website: {data.school.website}</li>
			<li class="lb">Iskola típusa: {data.resS}</li>
			<li class="lb">Felelős: {data.resD}</li>
			<li class="lb">Feljegyzés: {data.school.note}</li>
			<li class="lb">Kapcsolat:</li>
			<hgroup>
				{#each data.contact as con}
					<ul class="ac">
						<hgroup>
							<li class="lb">
								<a href="../../lists/contacts/{con.contact_id}" class="aa"
									>Név: {con.contact_name}
								</a>
							</li>
							<li class="lb">Telefon: {con.contact_phone}</li>
							<li class="lb">Email: {con.contact_email}</li>
							<li class="lb">Feljegyzés: {con.contact_note}</li>
						</hgroup>
					</ul>
				{/each}
			</hgroup>
		</ul>
		<h4 class="h42">Események</h4>
		<br />
		<ul class="aa">
			{#each data.event as e}
				<li class="la">
					<a href="../../lists/events/{e.event_id}" class="aa">
						{formatDate(e.closing_date)} &#9753 {e.event_name} &#10086 {e.on_duty} &#10087 {e.event_type}
					</a>
				</li>
			{/each}
		</ul>
	</hgroup>
	<br />
	<a href="#top" class="flower">&#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046</a>
</div>

<style>
	.aa {
		color: #32bea6;
		font-weight: 400;
		line-height: normal;
		font-size: 20px;
	}

	.ab {
		color: #83918f;
		padding: 2%;
		font-weight: 400;
		line-height: normal;
		font-size: 22px;
	}

	.ac {
		color: #83918f;
		font-weight: 400;
		line-height: normal;
		padding-top: 1%;
		padding-left: 5%;
		text-indent: -6%;
		font-size: 22px;
	}

	.ad {
		color: #83918f;
		font-weight: 400;
		line-height: normal;
		font-size: 22px;
	}

	.la {
		list-style-position: inside;
		list-style-type: disc;
		padding-left: 5%;
		text-indent: -6%;
		line-height: 1.4;
		font-size: 22px;
	}

	.lb {
		list-style-position: inside;
		list-style-type: circle;
		padding-left: 5%;
		text-indent: -5%;
		line-height: 1.4;
		font-size: 22px;
	}

	.h41 {
		color: #83918f;
	}

	.h42 {
		color: #32bea6;
	}

	.h43 {
		color: #737978;
	}

	.h44 {
		color: #83918f;
		border-color: #83918f;
	}

	label {
		padding: 6px;
	}

	.rei p {
		position: relative;
		line-height: normal;
		font-size: 140%;
		font-weight: bold;
	}

	.grid {
		padding: 35px 15px 0px 15px;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-content: space-around;
		width: 55%;
		line-height: 75%;
		grid-row: minmax(5px, auto);
	}

	.grid input:checked {
		background-color: #32bea6;
	}

	.btn {
		margin-bottom: 0;
		background-color: #32bea6;
	}

	.element-to-position {
		transform: translateY(420vh); /* Move the element down one viewport height (vh) */
	}

	.element-to-even-position {
		transform: translateY(620vh); /* Move the element down one viewport height (vh) */
	}

	.school-to-position {
		transform: translateY(820vh);
	}

	.iii {
		display: flex;
		text-align: left;
		padding-left: 5px;
		color: rgb(146, 136, 136);
	}

	.error {
		color: tomato;
		padding: 2%;
		text-align: center;
		font-style: italic;
		line-height: 95%;
		font-weight: 500;
	}
</style>
