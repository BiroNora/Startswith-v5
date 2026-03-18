<script lang="ts">
	import { eyeClosed, eyeOpen } from '../../stores/dataStore';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let showPassword = $state(false);
	let pageName = 'LOGIN';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div class="main">
	<h1>Login</h1>

	<form action="?/login" method="POST" class="width-400">
		<div>
			<label class="log" for="email">Email</label>
			<input id="email" name="email" type="email" required />
		</div>

		<div>
			<label class="log" for="password">Password</label>
			<div class="password-wrapper">
				<input id="password" name="password" type={showPassword ? 'text' : 'password'} required />
				<button
					type="button"
					class="eye-toggle"
					onclick={() => (showPassword = !showPassword)}
					tabindex="-1"
				>
					{@html showPassword ? eyeOpen : eyeClosed}
				</button>
			</div>
		</div>

		{#if form?.invalid}
			<p class="error">Email address and password are required.</p>
		{/if}

		{#if form?.credentials}
			<p class="error">Wrong credentials.</p>
		{/if}

		<button class="btn" id="btn" type="submit"> Login </button>
	</form>
	<a href="../auth/forgot_password" role="button" class="btn-forgot"> Forgot Password? </a>
</div>
