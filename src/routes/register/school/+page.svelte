<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();

	let selectedCountry = $state<number | null>(null);
	let selectedRegion = $state<number | null>(null);
	let selectedCounty = $state<number | null>(null);
	let selectedCity = $state<number | null>(null);

	let filteredRegions = $derived(data.regions.filter((r) => r.country_id === selectedCountry));
	let filteredCounties = $derived(data.counties.filter((c) => c.region_id === selectedRegion));
	let filteredCities = $derived(data.cities.filter((cit) => cit.county_id === selectedCounty));

	let yesA = $state(true);
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
	let yesCOOP = $state(true);
	let yesBAS = $state(true);
	let yesMED = $state(false);
	let yesHIG = $state(false);
	let omi = $state('');

	let pageName = 'School Register';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div class="grid">
	<div class="rei">
		<p class="black">School Register</p>
	</div>
	<br />
	<form action="?/school" method="post" use:enhance>
		<fieldset>
			<legend>Location</legend>
			<p class="notice">
				Please note: if country / region / county /city <i class="note">does not exist</i> in the list,
				<a class="aa" href="/register/location">use this link</a> before the registration.
			</p>

			<div>
				<label for="countr">Country</label>
				<select name="countr" id="country" bind:value={selectedCountry}>
					{#each data.countries as country}
						<option value={country.country_id}>{country.country_name}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="region">Region</label>
				<select name="region" id="region" bind:value={selectedRegion} disabled={!selectedCountry}>
					{#each filteredRegions as reg}
						<option value={reg.region_id}>{reg.region_name}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="county">County</label>
				<select name="county" id="county" bind:value={selectedCounty} disabled={!selectedRegion}>
					{#each filteredCounties as coun}
						<option value={coun.county_id}>{coun.county_name}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="city">City</label>
				<select name="city" id="city" bind:value={selectedCity} disabled={!selectedCounty}>
					{#each filteredCities as cit}
						<option value={cit.city_id}>{cit.city_name}</option>
					{/each}
				</select>
			</div>
		</fieldset>
		<br />
		<div>
			<label for="om">OM ID *</label>
			<p><i class="iiii">* for Schools in Hungary only</i></p>
			<input type="text" name="om" id="om" bind:value={omi} />
		</div>
		<div>
			<label for="name">School Name</label>
			<input type="text" name="name" id="name" required />
		</div>
		<div>
			<label for="zip">ZIP Code</label>
			<input type="text" name="zip" id="zip" required />
		</div>
		<div>
			<label for="address">Address</label>
			<input type="text" name="address" id="address" required />
		</div>
		<div>
			<label for="dirname">Head of School</label>
			<input type="text" name="dirname" id="dirname" required />
		</div>
		<div>
			<label for="dirphone">School Phone Number</label>
			<input type="text" name="dirphone" id="dirphone" required />
		</div>
		<div>
			<label for="email">School Email</label>
			<input type="email" name="email" id="email" required />
		</div>
		<div>
			<label for="useremail">User Email</label>
			<input type="uemail" name="useremail" id="useremail" required />
		</div>
		<div>
			<label for="website">Website</label>
			<input type="text" name="website" id="website" required />
		</div>
		<br />
		<div class="black">
			<div class="black">
			<input  type="checkbox" name="iskA" bind:checked={yesA} />
			ÁLTALÁNOS ISKOLA
		</div>
		<br />
		<div>
			<input type="checkbox" name="iskB" bind:checked={yesB} />
			GIMNÁZIUM
		</div>
		<br />
		<div>
			<input type="checkbox" name="iskC" bind:checked={yesC} />
			SZAKGIMNÁZIUM
		</div>
		<br />
		<div>
			<input type="checkbox" name="iskD" bind:checked={yesD} />
			SZAKKÖZÉPISKOLA
		</div>
		<br />
		<div>
			<input type="checkbox" name="iskE" bind:checked={yesE} />
			SZAKISKOLA
		</div>
		<br />
		<div>
			<input type="checkbox" name="iskF" bind:checked={yesF} />
			TECHNIKUM
		</div>
		<br />
		<div>
			<input type="checkbox" name="iskG" bind:checked={yesG} />
			SZAKKÉPZŐ ISKOLA
		</div>
		<br />
		<div>
			<input type="checkbox" name="iskH" bind:checked={yesH} />
			ALAPFOKÚ MŰVÉSZETOKTATÁS
		</div>
		<br />
		<div>
			<input type="checkbox" name="iskI" bind:checked={yesI} />
			MŰVÉSZETI OKTATÁS
		</div>
		<br />
		<div>
			<input type="checkbox" name="iskJ" bind:checked={yesJ} />
			KÉSZSÉGFEJLESZTÉS
		</div>
		<br />
		<div>
			<input type="checkbox" name="iskK" bind:checked={yesK} />
			FEJLESZTŐ NEVELÉS-OKTATÁS
		</div>
		<br />
		<div>
			<input type="checkbox" name="iskL" bind:checked={yesL} />
			KIEGÉSZÍTŐ NEMZETISÉGI NYELVOKTATÁS
		</div>
		<br />
		<div>
			<input type="checkbox" name="iskM" bind:checked={yesM} />
			KOLLÉGIUM
		</div>
		<br />
		<div>
			<input type="checkbox" name="iskN" bind:checked={yesN} />
			HÍDPROGRAMOK
		</div>
		<br />
		<div>
			<input type="checkbox" name="iskO" bind:checked={yesO} />
			NEM BESOROLT *
		</div>
		<p><i class="iiii">* please leave a comment</i></p>
		</div>

		<div class="first black">
			<div>
				<input type="checkbox" name="bas" bind:checked={yesBAS} />
				BASIC
			</div>
			<div>
				<input type="checkbox" name="med" bind:checked={yesMED} />
				MEDIOR
			</div>
			<div>
				<input type="checkbox" name="hig" bind:checked={yesHIG} />
				HIGH
			</div>
		</div>
		<fieldset>
			<legend>Note on School</legend>
			<br />
			<div class="black">
				<input type="checkbox" name="coop" bind:checked={yesCOOP} />
				COOPERATION
			</div>
			<br />
			<textarea id="message" name="note" rows="4" cols="50"></textarea>
		</fieldset>
		{#if form?.local}
			<p class="error">Incorrect location.</p>
		{/if}

		{#if form?.omid}
			<p class="error">OM ID already exists.</p>
		{/if}

		{#if form?.omval || form?.omid}
			<p class="error">OM ID is inadequate.</p>
		{/if}

		{#if form?.sch || form?.user}
			<p class="error">Please enter correct data.</p>
		{/if}

		{#if [yesA, yesB, yesC, yesD, yesE, yesF, yesG, yesH, yesI, yesJ, yesK, yesL, yesM, yesN, yesO].every((value) => value === false)}
			<p class="error">One school type must be choosen.</p>
		{/if}

		{#if yesBAS === false && yesMED === false && yesHIG === false}
			<p class="error">One duty must be choosen.</p>
		{/if}

		<div>
			<p class="noticea">Please note: contact can be added on Shool Details page.</p>
		</div>

		<button class="btn" id="btn" type="submit">Register</button>
	</form>
</div>

<style>
	.iiii {
		color: rgb(146, 136, 136);
		padding-left: 0.5rem;
		font-size: 0.7rem;
	}

	.notice {
		color: tomato;
		padding: 2%;
		text-align: center;
		font-weight:normal;
		line-height: normal;
	}

	.noticea {
		color: #32bea6;
		padding: 2%;
		text-align: center;
		font-weight: 500;
		line-height: normal;
	}

	.note {
		font-weight: bolder;
	}

	.aa {
		color: #32bea6;
		font-style: italic;
	}

	.first {
		justify-content: space-between;
		padding: 0 5% 5%;
		line-height: 1.9;
	}
</style>
