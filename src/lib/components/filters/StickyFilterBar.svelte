<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		isElementVisible,
		selYear,
		selSemest,
		selDuty,
		duty,
		selectedCountryObj,
		selectedRegionObj,
		children
	} = $props<{
    isElementVisible: boolean;
    selYear: string;
    selSemest: string;
    selDuty: string;
    duty: any;
    selectedCountryObj: any;
    selectedRegionObj: any;
    children?: Snippet; // <--- A kérdőjeltől lesz OPCIONÁLIS
  }>();
</script>

{#if isElementVisible}
	<div class="sticky" id="stickyLine">
		<i class="black">Event Year: </i>&nbsp;{selYear} &nbsp;&nbsp;
		<i class="black">Event Semester: </i>&nbsp;{selSemest} &nbsp;&nbsp;
		<i class="black">Event Duty: </i>
		{#each duty as item (item.id)}
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

		{@render children()}
	</div>
{/if}

<style>
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
</style>
