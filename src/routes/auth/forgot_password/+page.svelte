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

	<form action="?/forgot" method="POST" use:enhance class="width-25">
		{#if !form?.sent}
			<div>
				<label for="email">Enter your email</label>
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

<style>
	

	label {
		padding-left: 1%;
		font-size: 22px;
		font-weight: 400;
		color: rgb(144, 132, 132);
	}

	.error {
		color: tomato;
		text-align: center;
		font-style: italic;
		font-weight: 500;
		width: 25%;
	}
</style>
