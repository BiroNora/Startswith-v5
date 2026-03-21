<script>
	import { enhance } from '$app/forms';

	function handleCancel() {
		history.back();
	}

	let { data, form } = $props();
</script>

<div class="grid event3-to-position" id="section3_event">
	<div class="rei">
		<p>Internal Connection Delete</p>
	</div>
	<p class="uni">{data.school.school_name}</p>
	<form action="?/schoolUD" method="post" use:enhance>
		<div>
			<label for="email">Email</label>
			<input type="text" name="email" id="email" required />
		</div>
		{#if form?.user || form?.alreadycontact}
			<p class="error">Please enter valide data.</p>
		{/if}
		<button class="btn" id="btnevent" type="submit">Remove</button>
		<button class="btn btn-cancel" id="cancel" type="button" onclick={handleCancel}>
			Cancel ❖ Jump Back
		</button>
	</form>
</div>
