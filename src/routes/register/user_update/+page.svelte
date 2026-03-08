<script lang="ts">
  import { enhance } from '$app/forms';
  import { dutyMap } from '../../stores/dataStore';
  import type { ActionData, PageServerData } from './$types';

  export let data: PageServerData;
  export let form: ActionData;

  // REAKTÍV ALAPOK: Ha a data frissül, ezek is frissülnek
  $: onDutyArray = (data.user?.on_duty ?? [])
    .filter((num) => num % 10 !== 0)
    .map((num) => num.toString());

  $: is_dir = (data.user?.on_duty?.[4] ?? 0) % 10 !== 0;

  // Form állapotok
  let yesB = false, yesM = false, yesH = false, yesS = false, yesD = false;
  let yesBreg = 0, yesMreg = 0, yesHreg = 0, yesSreg = 0, yesDuty = '';

  let pageName = 'Update User';

  // ADATOK BETÖLTÉSE: Ezt egyszer kell megtenni, amikor megérkezik a data
  // A reactive label ($:) figyeli a változást, de az inicializáláshoz használjuk ezt:
  $: if (data.user && data.regions) {
    // Reseteljük az állapotokat mielőtt újra feltöltjük (opcionális)
    onDutyArray.forEach(val => {
      const type = val.charAt(0);
      const regId = Number(val.charAt(1));

      if (type === '1') { yesB = true; yesBreg = regId; }
      if (type === '2') { yesM = true; yesMreg = regId; }
      if (type === '3') { yesH = true; yesHreg = regId; }
      if (type === '4') { yesS = true; yesSreg = regId; }
      if (type === '5') { yesD = true; yesDuty = val.charAt(1); }
    });
  }

  function showAlert() {
    alert('User status will be changed.');
  }
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

{#if is_dir}
<div class="grid">
	<div class="rei">
		<p>Update Startswith's User Data</p>
	</div>
	<br />
	<form action="?/user_active_change" method="post" use:enhance>
		<div>
			<label for="email">Email</label>
			<input type="text" name="email" id="email" required />
		</div>

		{#if form?.user}
			<p class="error">Confirm user.</p>
		{/if}

		<button on:click|once={showAlert} class="btn" id="btn" type="submit">Inactive / Reactive User</button>
	</form>
</div>
{/if}

<div class="grid">
	<div class="rei">
		<p>Update Startswith's User Data</p>
	</div>
	<br />
	<form action="?/user" method="post" use:enhance>
		<div>
			<label for="name">Name</label>
			<input type="text" name="name" id="name" value={data.user?.user_name} required />
		</div>
		<div>
			<label for="nationality">Nationality</label>
			<input type="text" name="nationality" id="nationality" value={data.user?.nationality} required />
		</div>
		<div>
			<label for="phone">Phone</label>
			<input type="text" name="phone" id="phone" value={data.user?.user_phone} required />
		</div>
		<div class="second">
			<input type="checkbox" name="basic" bind:checked={yesB} />
			BASIC
			<select bind:value={yesBreg} name="regB" id="sel-B" class="hidden-textbox">
				{#each data.regions ?? [] as regio}
					<option value={regio.region_id}>{regio.region_name}</option>
				{/each}
			</select>
		</div>
		<div>
			<input type="checkbox" name="medior" bind:checked={yesM} />
			MEDIOR
			<select bind:value={yesMreg} name="regM" id="sel-M" class="hidden-textbox">
				{#each data.regions ?? [] as regio}
					<option value={regio.region_id}>{regio.region_name}</option>
				{/each}
			</select>
		</div>
		<div>
			<input type="checkbox" name="high" bind:checked={yesH} />
			HIGH
			<select bind:value={yesHreg} name="regH" id="sel-H" class="hidden-textbox">
				{#each data.regions ?? [] as regio}
					<option value={regio.region_id}>{regio.region_name}</option>
				{/each}
			</select>
		</div>
		<div>
			<input type="checkbox" name="superior" bind:checked={yesS} />
			SUPERIOR
			<select bind:value={yesSreg} name="regS" id="sel-S" class="hidden-textbox">
				{#each data.regions ?? [] as regio}
					<option value={regio.region_id}>{regio.region_name}</option>
				{/each}
			</select>
		</div>
		<div class="dir">
			<input type="checkbox" name="director" bind:checked={yesD} />
			DIRECTOR
			<select bind:value={yesDuty} name="regD" id="sel-D" class="hidden-textbox">
				{#each dutyMap as item, index (item.id)}
					<option value={item.id}>{item.name}</option>
				{/each}
			</select>
		</div>
		<div>
			<label for="password1">Password</label>
			<input type="password" name="password1" id="password1" required />
		</div>
		<div>
			<label for="password2">Confirm Password</label>
			<input type="password" name="password2" id="password2" required />
		</div>

		{#if form?.user}
			<p class="error">Email is taken.</p>
		{/if}

		{#if form?.invalid}
			<p class="error">Confirm password.</p>
		{/if}

		{#if form?.regions}
			<p class="error">One duty must be choosen.</p>
		{/if}

		{#if form?.passw}
			<p class="error">Password must be at least 8 characters long,
				must include at least one lowercase and uppercase letter,
				and at least one numeric digit and at least one special character
				(such as !, @, #, $, %, ^, &, *).</p>
		{/if}

		<button class="btn" id="btn" type="submit">Update</button>
	</form>
</div>

<style>
	.rei p {
		position: relative;
		line-height: normal;
		font-size: 140%;
		font-weight: bold;
	}

	.hidden-textbox {
		visibility: hidden;
	}

	input[type='checkbox']:checked ~ .hidden-textbox {
		visibility: visible;
	}

	.grid {
		padding: 35px 15px 0px 15px;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-content: space-around;
		width: 45%;
		line-height: 85%;
		grid-row: minmax(5px, auto);
		margin: 10px auto 10px auto;
		border: 2px solid #32bea6;
		border-radius: 5px;
		border-spacing: 2px;
		flex: 10 auto;
	}

	.grid input:checked {
		background-color: #32bea6;
	}

	label {
		padding: 6px;
	}

	.dir {
		padding-bottom: 15px;
	}

	.btn {
		margin-bottom: 0;
		background-color: #32bea6;
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
