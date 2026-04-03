<script lang="ts">
	import { SCHOOL_TYPES } from "../../routes/stores/dataStore";


  let { selectedIds = $bindable([]) } = $props();
</script>

<div class="school-types-grid">
  {#each SCHOOL_TYPES as school}
    <label class="checkbox-container">
      <!-- A 'bind:group' automatikusan kezeli a tömböt -->
      <input
        type="checkbox"
        name="schoolTypeIds"
        value={school.id.toString()}
        bind:group={selectedIds}
      />
      {school.label}
      {#if school.id === 15}
        <i class="iii"> please leave a comment</i>
      {/if}
    </label>
  {/each}
</div>

<style>
  .iii {
		color: rgb(146, 136, 136);
    line-height: 1.25rem;
	}
</style>
