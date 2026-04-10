<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		isElementVisible,
		selYear,
		selSemest,
		selDuty,
		DUTY_TYPES,
		selectedCountryObj,
		selectedRegionObj,
		children,
		isActive,
		isCoop,
	} = $props<{
		isElementVisible: boolean;
		selYear: string | number;
		selSemest: string;
		selDuty: string | number;
		DUTY_TYPES: readonly { readonly id: string | number; readonly name: string }[];
		selectedCountryObj: any;
		selectedRegionObj: any;
		children?: Snippet;
		isActive: boolean;
  	isCoop: boolean;
	}>();
</script>

{#if isElementVisible}
	<div class="sticky" id="stickyLine">
		<i class="black">Event Year: </i>&nbsp;{selYear} &nbsp;&nbsp;
		<i class="black">Event Semester: </i>&nbsp;{selSemest} &nbsp;&nbsp;
		<i class="black">Event Duty: </i>
		{#each DUTY_TYPES as item (item.id)}
			{#if selDuty === item.id}
				&nbsp;{item.name}
			{/if}
		{/each}
		&nbsp;&nbsp;
		<i class="black">School Country: </i>
		{#if selectedCountryObj}
			&nbsp;{selectedCountryObj.country_name}
		{:else}
			&nbsp;ALL
		{/if}
		&nbsp;&nbsp;
		<i class="black">School Region: </i>
		{#if selectedRegionObj}
			&nbsp;{selectedRegionObj.region_name}
		{:else}
			&nbsp;ALL
		{/if}
		&nbsp;&nbsp;

		<div class="children-content">
			{@render children?.()}
		</div>

		<div class="dynamic-indicators">
      <div class="status-boxes">
        <span class="indicator {isActive ? 'active' : 'inactive'}">A</span>
        <span class="indicator {isCoop ? 'active' : 'inactive'}">C</span>
      </div>
    </div>
	</div>
{/if}

<style>
	.sticky {
		display: flex; /* Bekapcsolja a flexboxot */
		align-items: center; /* Függőlegesen középre igazít */
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
		font-size: clamp(0.5rem, 0.7rem, 1.0rem);
		white-space: nowrap; /* Ne törje több sorba */
		overflow: hidden; /* Ami nem fér be, tűnjön el */
		text-overflow: ellipsis;
	}
	.dynamic-indicators {
    display: flex;
    align-items: center;
    gap: 15px; /* Távolság a Filtering ON/OFF és az [A][C] között */
    flex-shrink: 0;
		margin-left: auto;

    flex-shrink: 0;
    padding-left: 10px;
  }

	.indicator {
    transition: color 0.3s ease;
    font-family: sans-serif;
  }

	.indicator.active {
    color: #2ecc71 !important; /* Szép zöld az aktívnak */
    background: rgba(46, 204, 113, 0.1);
  }

  .indicator.inactive {
    color: #95a5a6 !important; /* Szürke az inaktívnak */
    opacity: 0.4;
  }
</style>
