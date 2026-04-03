<script lang="ts">
	import { DUTY_TYPES } from '../../routes/stores/dataStore';

	// Props
	// filteredList: kiszűrjük az 'ALL'-t, ha csak mentésre használjuk
	let {
		selectedLevels = $bindable([]),
		variant = 'row',
		showAll = false // Alapból ne mutassa az ALL-t regisztrációnál
	} = $props();

	const displayList = showAll ? DUTY_TYPES : DUTY_TYPES.filter((d) => d.id !== 'ALL');
</script>

<div class="duty-group {variant}">
	{#each displayList as level}
		<label class="checkbox-container">
			<input
				type="checkbox"
				name="dutyLevelIds"
				value={level.id.toString()}
				bind:group={selectedLevels}
			/>
			<span>{level.name}</span>
		</label>
	{/each}
</div>

<style>
	.duty-group {
		display: flex;
		gap: 1rem;
	}
	.duty-group.column {
		flex-direction: column;
		gap: 0.5rem;
	}
	.checkbox-container {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		cursor: pointer;
	}
</style>
