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
	<h3>Reset Password</h3>

	{#if data.isValid}
		<form action="?/reset" method="POST" use:enhance class="width-400">
			<input type="hidden" name="email" value={data.userEmail} />
			<div>
				<label class="log" for="password">New Password</label>
				<input id="password" name="password" type="password" required />
			</div>

			<div>
				<label class="log" for="password1">Confirm Password</label>
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
