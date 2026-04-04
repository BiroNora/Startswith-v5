<script lang="ts">
	import { DUTY_MAP } from '../../routes/stores/dataStore';

	let { selectedLevels = $bindable([]), variant = 'row' } = $props();
</script>

<div class="duty-group {variant}">
	{#each DUTY_MAP as level}
		<label class="checkbox-container">
			<input type="checkbox" name="dutyLevelIds" value={level.id} bind:group={selectedLevels} />
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
