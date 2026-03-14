<script lang="ts">
  let { error, noData, children } = $props();
</script>

{#if error}
  <div class="container">
    <p><i>Something went wrong. Please try it later.</i></p>
  </div>
{:else}
  {#if noData}
    <div class="container">
      <p><i>No data available.</i></p>
    </div>
  {:else}
    {@render children()}
  {/if}
{/if}

<style>
  .container {
		display: flex; /* or inline-flex */
		width: 100%;
		flex-direction: row;
		justify-content: space-around;
		gap: 8%;
		padding-top: 10%;
		padding-bottom: 10%;
	}
</style>
