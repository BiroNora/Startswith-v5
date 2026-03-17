<script lang="ts">
  let {
    searchTerm = $bindable(''),
    count = 0,
    placeholder = "Search for..."
  } = $props();
</script>

<div class="input-container">
  <input
    type="search"
    bind:value={searchTerm}
    {placeholder}
  />

  {#if searchTerm !== ''}
    <div class="z">
      {#if count === 0}
        &nbsp; No Result
      {:else}
        &nbsp; <span>{count}</span> {count === 1 ? 'Result' : 'Results'}
      {/if}
    </div>
  {/if}
</div>

<style>

  .z {
		color: rgb(144, 132, 132);
		font-size: medium;
		font-weight: 400;
		font-style: italic;
	}
</style>
