<script>
	import { enhance } from '$app/forms';

	function handleCancel() {
		history.back();
	}

	let { data, form } = $props();
</script>

<div class="grid">
		<div class="rei">
			<p>Remove Startswith Contact</p>
		</div>
		<p class="black">{data.event.event_name}</p>
		<form action="?/eventUD" method="post" use:enhance>
			<div>
				<label for="email">Email</label>
				<input type="text" name="email" id="email" required />
			</div>
			{#if form?.user || form?.already}
				<p class="error">Please enter valide data.</p>
			{/if}

			<button class="btn" id="btnevent" type="submit">Remove</button>
			<button class="btn btn-cancel" id="cancel" type="button" onclick={handleCancel}>
			Cancel ❖ Jump Back
		</button>
		</form>
	</div>
