<script>
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<!-- Contact form -->

<div class="grid element-to-even-position" id="section_contact">
	<div class="rei">
		<p class="h43">Contact Register</p>
	</div>
	<br />
	<form action="?/contact_form" method="post" use:enhance>
		<div>
			<label for="name">Name</label>
			<input type="text" name="contactname" id="contactname" required />
		</div>
		<div>
			<label for="email">Email</label>
			<input type="email" name="contactemail" id="contactemail" required />
		</div>
		<div>
			<label for="phone">Phone</label>
			<input type="text" name="contactphone" id="contactphone" required />
		</div>
		<br />
		<label for="message">Note</label>
		<textarea id="message" name="contactmessage" rows="2" cols="50"></textarea>

		{#if form?.errors}
			<p class="error">Wrong credentials.</p>
		{/if}

		<button class="btn" id="btn" type="submit">Register</button>
		<br />
	</form>
</div>
