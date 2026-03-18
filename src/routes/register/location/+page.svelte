<script lang="ts">
	import { enhance } from '$app/forms'
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();

  let pageName="Location Register"

</script>

<svelte:head>
    <title> {pageName} </title>
</svelte:head>

<div class="grid">
  <div class="rei">
    <p class="black">Location Register</p>
  </div>
  <br>

  <form action="?/location" method="post" use:enhance>
  <fieldset>
    <legend class="n">New Location</legend>
    <div>
      <label for="country">Country</label>
      <input type="text" name="country" id="country" required />
    </div>
    <div>
      <label for="region">Region</label>
      <input type="text" name="region" id="region" required />
    </div>
    <div>
      <label for="county">County</label>
      <input type="text" name="county" id="county" required />
    </div>
    <div>
      <label for="city">City</label>
      <input type="text" name="city" id="city" pattern="^[A-Z]&#123;1&#125;|([-]?\[A-Z]&#123;1&#125;)&#123;4&#125;" required />
    </div>
  </fieldset>
  {#if form?.error}
    <p class="error">{form?.message}</p>
	{/if}
  <button class="btn" id="btn" type="submit">Register</button>
</form>
</div>
