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
			<div class="notice">
				Please note: if country / region / county /city <i class="note">does not exist</i> in the
				list,
				<a class="aa" href="/register/location">use this link</a> before the registration.
			</div>

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
			<i class="iiii">* for Schools in Hungary only</i>
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
		<div>
			<label class="checkbox-container">
				<input type="checkbox" name="iskA" bind:checked={yesA} />
				<span>ÁLTALÁNOS ISKOLA</span>
			</label>
			<label class="checkbox-container">
				<input type="checkbox" name="iskA" bind:checked={yesB} />
				<span>GIMNÁZIUM</span>
			</label>
			<label class="checkbox-container">
				<input type="checkbox" name="iskA" bind:checked={yesC} />
				<span>SZAKGIMNÁZIUM</span>
			</label>
			<label class="checkbox-container">
				<input type="checkbox" name="iskA" bind:checked={yesD} />
				<span>SZAKKÖZÉPISKOLA</span>
			</label>
			<label class="checkbox-container">
				<input type="checkbox" name="iskA" bind:checked={yesE} />
				<span>SZAKISKOLA</span>
			</label>
			<label class="checkbox-container">
				<input type="checkbox" name="iskA" bind:checked={yesF} />
				<span>TECHNIKUM</span>
			</label>
			<label class="checkbox-container">
				<input type="checkbox" name="iskA" bind:checked={yesG} />
				<span>SZAKKÉPZŐ ISKOLA</span>
			</label>
			<label class="checkbox-container">
				<input type="checkbox" name="iskA" bind:checked={yesH} />
				<span>ALAPFOKÚ MŰVÉSZETOKTATÁS</span>
			</label>
			<label class="checkbox-container">
				<input type="checkbox" name="iskA" bind:checked={yesI} />
				<span>MŰVÉSZETI OKTATÁS</span>
			</label>
			<label class="checkbox-container">
				<input type="checkbox" name="iskA" bind:checked={yesJ} />
				<span>KÉSZSÉGFEJLESZTÉS</span>
			</label>
			<label class="checkbox-container">
				<input type="checkbox" name="iskA" bind:checked={yesK} />
				<span>FEJLESZTŐ NEVELÉS-OKTATÁS</span>
			</label>
			<label class="checkbox-container">
				<input type="checkbox" name="iskA" bind:checked={yesL} />
				<span>KIEGÉSZÍTŐ NEMZETISÉGI NYELVOKTATÁS</span>
			</label>
			<label class="checkbox-container">
				<input type="checkbox" name="iskA" bind:checked={yesM} />
				<span>KOLLÉGIUM</span>
			</label>
			<label class="checkbox-container">
				<input type="checkbox" name="iskA" bind:checked={yesN} />
				<span>HÍDPROGRAMOK</span>
			</label>
			<label class="checkbox-container">
				<input type="checkbox" name="iskA" bind:checked={yesO} />
				<span>NEM BESOROLT</span><i class="iiii"> please leave a comment</i>
			</label>
		</div>

		<div class="first">
			<label class="checkbox-container">
				<input type="checkbox" name="bas" bind:checked={yesBAS} />
				<span>BASIC</span>
			</label>
			<label class="checkbox-container">
				<input type="checkbox" name="bas" bind:checked={yesMED} />
				<span>MEDIOR</span>
			</label>
			<label class="checkbox-container">
				<input type="checkbox" name="bas" bind:checked={yesHIG} />
				<span>HIGH</span>
			</label>
		</div>

		<fieldset>
			<legend>Note on School</legend>

			<label class="checkbox-container">
				<input type="checkbox" name="bas" bind:checked={yesCOOP} />
				<span>COOPERATION</span>
			</label>

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
		padding-bottom: 0.5rem;
		text-align: center;
		font-weight: normal;
		line-height: normal;
		font-size: medium;
	}

	.noticea {
		color: #32bea6;
		padding-bottom: 0.5rem;
		text-align: center;
		font-weight: normal;
		line-height: normal;
		font-size: medium;
	}

	.note {
		font-weight: bolder;
	}

	.checkbox-container {
		gap: 1rem;
		font-size: 0.8rem;
		font-weight: normal;
		color: rgb(87, 80, 80);
		margin-bottom: 0.5rem;
		line-height: 1.35;
	}

	.aa {
		color: #32bea6;
		font-style: italic;
	}

	.first {
		padding: 1rem;
	}
</style>
