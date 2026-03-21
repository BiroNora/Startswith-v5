<!-- School update form -->
<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props() as { data: any; form: any };

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
		if (data?.school) {
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
		}
	});

	function handleCancel() {
		history.back();
	}

	let pageName = 'School Details';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div class="grid school-to-position" id="section_school">
	<div class="rei">
		<p>School Update</p>
	</div>
	<br />
	<form action="?/school" method="post" use:enhance>
		<div>
			<label for="name">School Name</label>
			<input type="text" value={data.school.school_name} name="name" id="name" required />
		</div>
		<div>
			<label for="zip">ZIP Code</label>
			<input type="text" value={data.school.zip_code} name="zip" id="zip" required />
		</div>
		<div>
			<label for="address">Address</label>
			<input type="text" value={data.school.address} name="address" id="address" required />
		</div>
		<div>
			<label for="dirname">Head of School</label>
			<input type="text" value={data.school.dir_name} name="dirname" id="dirname" required />
		</div>
		<div>
			<label for="dirphone">School Phone</label>
			<input type="text" value={data.school.dir_phone} name="dirphone" id="dirphone" required />
		</div>
		<div>
			<label for="email">School Email</label>
			<input type="email" value={data.school.school_email} name="email" id="email" required />
		</div>
		<div>
			<label for="website">Website</label>
			<input type="text" value={data.school.website} name="website" id="website" required />
		</div>
		<br />
		<!-- SCOOL TYPE -->
		<div>
			<input type="checkbox" name="iskA" bind:checked={yesA} />
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
		<p><i class="iii">* please leave a comment</i></p>
		<br />
		<div>
			<input type="checkbox" name="bas" bind:checked={yesBAS} />
			BASIC &nbsp;&nbsp;&nbsp;&nbsp;
			<input type="checkbox" name="med" bind:checked={yesMED} />
			MEDIOR &nbsp;&nbsp;&nbsp;&nbsp;
			<input type="checkbox" name="hig" bind:checked={yesHIG} />
			HIGH
		</div>
		<br />
		<div class="second">
			COOPERATION
			<input type="checkbox" name="coop" bind:checked={yesCOOP} />
		</div>
		<br />
		<div class="second">
			ACTIVE
			<input type="checkbox" name="active" bind:checked={yesACT} />
		</div>
		<br />
		<br />
		<textarea id="message" name="note" rows="4" cols="50">{data.school.note}</textarea>

		{#if form?.errors}
			<p class="error">Wrong credentials.</p>
		{/if}

		{#if [yesA, yesB, yesC, yesD, yesE, yesF, yesG, yesH, yesI, yesJ, yesK, yesL, yesM, yesN, yesO].every((value) => value === false)}
			<p class="error">One school type must be choosen.</p>
		{/if}

		{#if yesBAS === false && yesMED === false && yesHIG === false}
			<p class="error">One duty must be choosen.</p>
		{/if}

		<button class="btn" id="btn" type="submit">Update</button>
		<button class="btn btn-cancel" id="cancel" type="button" onclick={handleCancel}>
			Cancel ❖ Jump Back
		</button>
	</form>
</div>
