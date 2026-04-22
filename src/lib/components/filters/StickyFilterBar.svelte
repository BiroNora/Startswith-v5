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
	.dynamic-indicators {
    display: flex;
    align-items: center;
    flex-shrink: 0;
		margin-left: auto;
  }

	.indicator.active {
    color: #32bea6 !important;
  }

  .indicator.inactive {
    color: #83918f !important;
    opacity: 0.4;
  }
</style>
