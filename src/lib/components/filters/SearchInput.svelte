<script lang="ts">
	let { searchTerm = $bindable(''), count = 0, placeholder = 'Search for...' } = $props();
</script>

<div>
	<input type="search" bind:value={searchTerm} {placeholder} />

	<div class="result-indicator">
		{#if searchTerm !== ''}
			{#if count === 0}
				&nbsp; No Result
			{:else}
				&nbsp; <span>{count}</span> {count === 1 ? 'Result' : 'Results'}
			{/if}
		{/if}
	</div>
</div>

<style>
	.result-indicator {
		height: 0.6rem;
		color: var(--secondary-gray-cool);
		font-size: 0.6rem;
		font-weight: 400;
		font-style: italic;
	}
</style>
