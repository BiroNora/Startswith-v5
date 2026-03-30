<script lang="ts">
  import { enhance } from '$app/forms';
  import { fade } from 'svelte/transition';
  import { dutyMap, eyeClosed, eyeOpen, LEVEL_LABELS } from '../stores/dataStore';
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  // 1. Állapotok deklarálása
  let email = $state('');
  let name = $state('');
  let showPassword = $state(false);
  let showModal = $state(false);
  let selectedDutyId = $state<number | null>(null);
  let isInput = $state(true);

  let yesS = $state(false);
  let yesD = $state(false);
  let yesSreg = $state(0);
  let yesDuty = $state('');

  // 2. Logika
  function confirmDelete(id: number) {
    selectedDutyId = id;
    showModal = true;
  }

  // Ez a blokk kényszeríti a Svelte-et, hogy ha megjön a válasz a szerverről,
  // írja felül a helyi változókat (a névvel és a checkboxokkal együtt)
  $effect(() => {
    if (form?.foundUser) {
      name = form.foundUser.name;
      email = form.foundUser.email;

      // Meglévő jogok beállítása (checkboxok)
      const superior = form.foundUser.duties.find(d => d.type === 'SUPERIOR');
      const director = form.foundUser.duties.find(d => d.type === 'DIRECTOR');

      yesS = !!superior;
      if (superior) yesSreg = superior.region_id;

      yesD = !!director;
      if (director) yesDuty = String(director.level);
    } else if (form?.newUser) {
      name = '';
      yesS = false;
      yesD = false;
    }
  });

  // Szűrt lista a már meglévő jogok megjelenítéséhez (X gombbal)
  const sortedDuties = $derived(
    (form?.foundUser?.duties || []).filter(u => u.type === 'SUPERIOR' || u.type === 'DIRECTOR')
  );

  let pageName = 'ADMIN';
</script>

<svelte:head>
  <title>{pageName}</title>
</svelte:head>

<div class="grid">
  <div class="rei">
    <p class="black">ADMIN Account Settings</p>
  </div>
  <br />

  <form action="?/user" method="post" use:enhance novalidate>
  {'delice@gmail.com'}
    <div>
      <label for="email">Email</label>
      <input type="email" name="email" id="email" bind:value={email} required />
      <div class="pad">
        <button
          type="submit"
          formaction="?/search"
          class="btn btn-cancel"
          class:active-color={!isInput}
          onclick={() => { isInput = false; }}
        >
          Check
        </button>
      </div>
    </div>

    <div>
      <label for="name">Name</label>
      <input type="text" name="name" id="name" bind:value={name} />
    </div>

    <div class="duties-container">
        {#each sortedDuties as u}
          <article class="art-div">
            <div class="art">
              <div>
                {#if u.type === 'SUPERIOR'}
                  {u.type}
                  <small>— {data.regions.find((r) => r.region_id === u.region_id)?.region_name}</small>
                {:else if u.type === 'DIRECTOR'}
                  <ins>{u.type}</ins>
                  <small>— {LEVEL_LABELS[u.level]}</small>
                {/if}
              </div>

              <button type="button" class="outline art-btn" onclick={() => confirmDelete(u.id)}>
                <div class="x-icon">x</div>
              </button>
            </div>
          </article>
        {/each}
    </div>

    <div class="input-group">
      <label class="check-label">
        <input type="checkbox" name="superior" bind:checked={yesS} />
        <span>SUPERIOR</span>
      </label>
      <div class="select-wrapper">
        {#if yesS}
          <select bind:value={yesSreg} name="regS" id="sel-S" transition:fade={{ duration: 200 }}>
            {#each data.regions ?? [] as regio}
              <option value={regio.region_id}>{regio.region_name}</option>
            {/each}
          </select>
        {/if}
      </div>
    </div>

    <div class="input-group">
      <label class="check-label">
        <input type="checkbox" name="director" bind:checked={yesD} />
        <span>DIRECTOR</span>
      </label>
      <div class="select-wrapper">
        {#if yesD}
          <select bind:value={yesDuty} name="regD" id="sel-D" transition:fade={{ duration: 200 }}>
            {#each dutyMap as item (item.id)}
              <option value={item.id}>{item.name}</option>
            {/each}
          </select>
        {/if}
      </div>
    </div>

    <div>
      <label for="password">Password</label>
      <div class="password-wrapper">
        <input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          required={!isInput}
        />
        <button
          type="button"
          class="eye-toggle"
          onclick={() => (showPassword = !showPassword)}
          tabindex="-1"
        >
          {@html showPassword ? eyeOpen : eyeClosed}
        </button>
      </div>
    </div>

    <button class="btn" id="btn" type="submit">Update</button>
  </form>
</div>

{#if showModal}
  <dialog open>
    <article>
      <header>
        <a href="#close" aria-label="Close" class="close" onclick={() => (showModal = false)}></a>
        <h5>Confirm Deletion</h5>
      </header>
      <form action="?/delUser" method="post" use:enhance={() => {
        return async ({ update }) => {
          showModal = false;
          await update();
        };
      }}>
        <input type="hidden" name="dutyId" value={selectedDutyId} />
        <div>
          <h6>Biztosan törölni szeretné ezt a jogosultságot?</h6>
          <footer>
            <button type="submit" class="btn"> Confirm </button>
            <button
              type="button"
              class="btn btn-cancel btn-outline"
              onclick={() => (showModal = false)}
            >
              Cancel
            </button>
          </footer>
        </div>
      </form>
    </article>
  </dialog>
{/if}

<style>
/* Ide nem nyúltam, marad az eredeti */
  .input-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 2.5rem !important;
    padding: 0 1rem !important;
    gap: 10px;
    margin-bottom: 5px;
  }
  .check-label {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 160px;
    cursor: pointer;
  }
  select {
    max-width: 100%;
  }
  .select-wrapper {
    flex-grow: 1;
    display: flex;
    align-items: center;
  }
</style>
