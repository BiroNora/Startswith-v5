<script lang="ts">
  import RegionDoughnut from '$lib/components/charts/RegionDoughnut.svelte';
  import { duty, semester } from '../../stores/dataStore'; // Store-ok a selectekhez
  import type { PageServerData } from './$types';

  // 1. Adatok fogadása
  let { data }: { data: PageServerData } = $props();

  // 2. Reaktív állapotok (Rúnák) - A Te változóneveiddel
  let selectedYear = $state('ALL');
  let selectedSemester = $state('ALL');
  let selectedDuty = $state('ALL');

  let regionIntAdm = $state<any[]>([]);
  let isElementVisible = $state(false);
  let err_mess = $state(false);
  let err_mess1 = $state(false);

  // Kijelző változók a "sticky" sorhoz
  let selYear = $state('');
  let selSemest = $state('');
  let selDuty = $state('');

  // 3. Beküldő függvény
  async function sendDataWithForm(e: Event) {
    e.preventDefault();
    err_mess = false;
    err_mess1 = false;

    try {
      const response = await fetch('/tables/chart_region_table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedYear: selectedYear === 'ALL' ? null : Number(selectedYear),
          selectedSemester: selectedSemester === 'ALL' ? null : selectedSemester,
  		    selectedDuty: selectedDuty === 'ALL' ? null : selectedDuty
        })
      });

      if (response.ok) {
        const result = await response.json();
        regionIntAdm = result.regionIntAdm;

        if (regionIntAdm.length === 0) {
            err_mess1 = true;
        }

        // Frissítjük a kijelzőt
        selYear = selectedYear;
        selSemest = selectedSemester;
        selDuty = selectedDuty;
        isElementVisible = true;
      } else {
        err_mess = true;
      }
    } catch (error) {
      console.error(error);
      err_mess = true;
    }
  }

  // Százalék számító segédfüggvény (calcPerc helyett)
  function getPercents(counts: number[]) {
    const total = counts.reduce((a, b) => a + b, 0);
    return total === 0 ? [] : counts.map(c => Math.round((c / total) * 100));
  }
</script>

<svelte:head>
  <title>CHART_REGION_TABLE</title>
</svelte:head>

<div class="main-chart" id="top">
  <hgroup>
    <h1>Chart Tables* of Events** and Interested Students at Regions</h1>
    <i>&emsp;*Events only with active and cooperative schools</i>
    <br />
    <i>&emsp;**Semesters: Spring — months between the 3th & 9th months inclusive; Autumn — others</i>
  </hgroup>
  <br />

  <form onsubmit={sendDataWithForm}>
    <div>
      <label for="year"><i>Select </i> Event Year</label>
      <select bind:value={selectedYear} id="year">
        {#each data.distinctYears as year}
          <option value={year}>{year}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="semester"><i>Select </i> Event Semester</label>
      <select bind:value={selectedSemester} id="semester">
        {#each semester as sem}
          <option value={sem}>{sem}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="duty"><i>Select </i> Event Duty</label>
      <select bind:value={selectedDuty} id="duty">
        {#each duty as d}
          <option value={d.id}>{d.name}</option>
        {/each}
      </select>
    </div>

    <button class="btn" type="submit"> Confirm </button>
  </form>

  {#if isElementVisible}
    <div class="sticky" id="stickyLine">
      <i class="black">Event Year: </i>&nbsp;{selYear} &nbsp;&nbsp;
      <i class="black">Event Semester: </i>&nbsp;{selSemest} &nbsp;&nbsp;
      <i class="black">Event Duty: </i>
      {#each duty as item}
        &nbsp;{#if selDuty === item.id}{item.name}{/if}
      {/each}
      &nbsp;&nbsp;
    </div>
  {/if}

  {#if err_mess}
    <div class="container" style="margin-bottom: 8rem;">
      <p><i>Something went wrong. Please try it later.</i></p>
    </div>
  {/if}

  {#if err_mess1}
    <div class="container" style="margin-bottom: 8rem;">
      <p><i>No data available.</i></p>
    </div>
  {/if}

  <div class="container">
    {#if regionIntAdm.length > 0}
      <div class="f">
        <RegionDoughnut
          data={getPercents(regionIntAdm.map(d => d.intrest_count))}
          labels={regionIntAdm.map(d => d.region_name)}
          title="Percentage Proportion of Interested Students at Regions"
        />
      </div>
      <div class="f">
        <RegionDoughnut
          data={getPercents(regionIntAdm.map(d => d.intrest_count_status_1))}
          labels={regionIntAdm.map(d => d.region_name)}
          title="Percentage Proportion of Admitted Students at Regions"
        />
      </div>
    {/if}
  </div>

  <a href="#top" class="flower">&#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046</a>
</div>

<style>
  .container {
    display: flex;
    width: 100%;
    flex-direction: row;
    /* Ez teszi őket középre és osztja el az üres helyet egyenlően */
    justify-content: center;
    /* Vagy használd a space-evenly-t, ha azt akarod, hogy a széleken is ugyanannyi hely legyen */
    /* justify-content: space-evenly; */

    align-items: center;    /* Függőlegesen is középre igazítja őket, ha nem egyforma magasak */
    gap: 5%;                /* Csökkentettem a gap-et, hogy biztosan elférjenek egymás mellett */
    padding-top: 4%;
    padding-bottom: 3%;
    box-sizing: border-box; /* Hogy a padding ne növelje meg a 100% szélességet */
}

.f {
    /* Fontos: adjunk nekik egy fix vagy rugalmas szélességet, hogy ne nyomják össze egymást */
    flex: 0 1 40%;
    min-width: 300px; /* Megakadályozza, hogy túl kicsik legyenek mobilon */
    display: flex;
    justify-content: center;
}

  select {
		border-radius: 100px;
		width: 25%;
		padding: 8px;
		margin: 10px 0;
		border: 1px solid #ccc;
	}


  i {
    font-weight: 300;
  }

  .sticky {
    display: flex;            /* Bekapcsolja a flexboxot */
    align-items: center;      /* Függőlegesen középre igazít */
    justify-content: flex-start;
		background-color: rgb(246, 242, 242);
		position: sticky;
		top: 0;
		z-index: 1;
		height: 40px;
		width: 100%;
		padding: 5px;
		color: #32bea6;
		border-radius: 100px;
		font-size: clamp(0.7rem, 0.8rem, 1.2rem);
    white-space: nowrap;      /* Ne törje több sorba */
    overflow: hidden;         /* Ami nem fér be, tűnjön el */
    text-overflow: ellipsis;
	}

	.black {
		color:rgb(112, 108, 108);
	}

  label {
    padding-left: 1%;
    font-size: 22px;
    font-weight: 400;
    color: rgb(144, 132, 132);
    display: block;
  }

  .btn {
    border-radius: 100px;
    width: 25%;
    background-color: #32bea6;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
    font-size: 18px;
    margin-top: 10px;
  }

  .btn:hover {
    background-color: #11a58c;
  }
</style>
