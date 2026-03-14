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
  .input-container {
    flex-direction: column; /* Egymás alá rakja az elemeket */
    align-items: flex-start; /* Balra igazítja őket */
    position: relative;
    width: 100%;
  }

  .z {
		color: rgb(144, 132, 132);
		font-size: medium;
		font-weight: 400;
		font-style: italic;
	}
</style>
