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
		children
	} = $props<{
		isElementVisible: boolean;
		selYear: string | number;
		selSemest: string;
		selDuty: string | number;
		DUTY_TYPES: readonly { readonly id: string | number; readonly name: string }[];
		selectedCountryObj: any;
		selectedRegionObj: any;
		children?: Snippet;
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

		{@render children?.()}
	</div>
{/if}
