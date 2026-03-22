<script>
	import { enhance } from '$app/forms';

	function handleCancel() {
		history.back();
	}

	let { data, form } = $props();
</script>

<div class="grid event2-to-position" id="section_school">
	<div class="rei">
		<p class="black">Internal Connection Update</p>
	</div>
	<p class="black">{data.school.school_name}</p>
	<form action="?/schoolU" method="post" use:enhance>
		<div>
			<label for="email">Email</label>
			<input type="text" name="email" id="email" required />
		</div>
		{#if form?.usercontact}
			<p class="error">Please enter valide data.</p>
		{/if}
		{#if form?.alreadycontact}
			<p class="error">Startswith user already added.</p>
		{/if}

		<button class="btn" id="btnevent" type="submit">Add</button>
		<button class="btn btn-cancel" id="cancel" type="button" onclick={handleCancel}>
			Cancel ❖ Jump Back
		</button>
	</form>
</div>
