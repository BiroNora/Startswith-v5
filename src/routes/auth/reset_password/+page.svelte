<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let pageName = 'RESET PASSWORD';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div class="main">
	<h1>Reset Password</h1>

	{#if data.isValid}
		<form action="?/reset" method="POST" use:enhance class="width-25">
			<input type="hidden" name="email" value={data.userEmail} />
			<div>
				<label for="password">New Password</label>
				<input id="password" name="password" type="password" required />
			</div>

			<div>
				<label for="password1">Confirm Password</label>
				<input id="password1" name="password1" type="password" required />
			</div>

			{#if form?.credentials}
				<p class="error">Wrong credentials.</p>
			{/if}

			<button class="btn" id="btn" type="submit"> Update Password & Login </button>
		</form>
	{:else}
		<div class="error-box">
			<p class="error">This reset link is invalid or has expired.</p>
			<a href="/auth/forgot-password" class="btn">Request a new link</a>
		</div>
	{/if}
</div>

<style>
	input {
		border-radius: 100px;
	}

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
