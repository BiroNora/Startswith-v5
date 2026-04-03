<script lang="ts">
	import { enhance } from '$app/forms';
	import DutyLevelSelector from '$lib/components/DutyLevelSelector.svelte';
	import SchoolTypeSelector from '$lib/components/SchoolTypeSelector.svelte';
	import type { ActionData, PageServerData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();

	let selectedCountry = $state<number | null>(null);
	let selectedRegion = $state<number | null>(null);
	let selectedCounty = $state<number | null>(null);
	let selectedCity = $state<number | null>(null);

	let filteredRegions = $derived(data.regions.filter((r) => r.country_id === selectedCountry));
	let filteredCounties = $derived(data.counties.filter((c) => c.region_id === selectedRegion));
	let filteredCities = $derived(data.cities.filter((cit) => cit.county_id === selectedCounty));

	let selectedSchoolTypes = $state(['1']);
	let selectedDutyIds = $state(['1']);
	let yesCOOP = $state(true);
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
		<!-- LOCATION -->
		<fieldset class="pad-bot-plus">
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

		<!-- SCOOL INFO -->
		<div class="pad-bot-plus">
			<div>
				<label for="om">OM ID *</label>
				<i class="iii">* for Schools in Hungary only</i>
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
		</div>

		<!-- SCOOL TYPES -->
		<fieldset>
			<legend>School Types</legend>
			<SchoolTypeSelector bind:selectedIds={selectedSchoolTypes} />
		</fieldset>

		<!-- DUTY TYPES -->
		<div class="pad-bot-plus">
			<DutyLevelSelector bind:selectedLevels={selectedDutyIds} variant="column" />
		</div>

		<!-- NOTE & COOP -->
		<fieldset>
			<legend>Note on School</legend>

			<label class="checkbox-container pad-bot-plus">
				<input type="checkbox" name="coop" bind:checked={yesCOOP} />
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

		{#if selectedSchoolTypes.length === 0}
			<p class="error">One school type must be chosen.</p>
		{/if}

		{#if selectedDutyIds.length === 0}
			<p class="error">One duty must be chosen.</p>
		{/if}

		<div>
			<p class="noticea">Please note: contact can be added on Shool Details page.</p>
		</div>

		<button class="btn" id="btn" type="submit">Register</button>
	</form>
</div>

<style>
	.iii {
		color: rgb(146, 136, 136);
		padding-left: 0.5rem;
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

	.aa {
		color: #32bea6;
		font-style: italic;
	}
</style>
