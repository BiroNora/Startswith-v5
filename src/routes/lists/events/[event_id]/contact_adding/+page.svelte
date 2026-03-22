<script>
	import { enhance } from '$app/forms';

	function handleCancel() {
		history.back();
	}

	let { data, form } = $props();
</script>

<div class="grid">
	<div class="rei">
		<p class="black">Add New Contact</p>
	</div>
	<p class="black">{data.event.event_name}</p>
	<form action="?/eventU" method="post" use:enhance>
		<div>
			<label for="email">Email</label>
			<input type="text" name="email" id="email" required />
		</div>
		{#if form?.userevent || form?.alreadyevent}
			<p class="error">Please enter valide data.</p>
		{/if}

		<button class="btn" id="btnevent" type="submit">Add</button>
		<button class="btn btn-cancel" id="cancel" type="button" onclick={handleCancel}>
			Cancel ❖ Jump Back
		</button>
	</form>
</div>
