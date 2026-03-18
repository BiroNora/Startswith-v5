<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
	let pageName = 'FORGOT_PASSWORD';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div class="main">
	<h1>Forgot Password</h1>

	<form action="?/forgot" method="POST" use:enhance class="width-400">
		{#if !form?.sent}
			<div>
				<label class="log" for="email">Enter your email</label>
				<input id="email" name="email" type="email" required />
			</div>

			<button class="btn" id="btn" type="submit"> Send Request </button>
		{/if}

		{#if form?.credentials}
			<p class="error">Wrong credential.</p>
		{/if}

		{#if form?.sent}
			<h1>Please, check your emailbox.</h1>
			<p>A reset link has been sent!</p>
		{/if}
	</form>
</div>
