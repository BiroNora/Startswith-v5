<script lang="ts">
	import { enhance } from '$app/forms';
	import { eyeClosed, eyeOpen, LEVEL_LABELS } from '../../stores/dataStore';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showPassword = $state(false);

	let showDelModal = $state(false);
	let showAddModal = $state(false);
	let selectedDutyId = $state<number | null>(null);
	let isInput = $state(true);

	function toggleIsInput() {
		isInput = !isInput;
	}

	let pageName = 'Edit Profile';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div class="grid">
	<div class="rei">
		<p class="black">Account Settings</p>
	</div>
	
	<form action="?/user" method="post" use:enhance>
		<div>
			<label for="name">Name</label>
			<input type="text" name="name" id="name" value={data.user?.name} required />
		</div>
		<div>
			<label for="phone">Phone</label>
			<input type="text" name="phone" id="phone" value={data.user?.phone} required />
		</div>

		<div>
			<label for="password1">Password</label>
			<div class="password-wrapper">
				<input id="password1" name="password1" type={showPassword ? 'text' : 'password'} required />
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
		<div>
			<label for="password2">Confirm Password</label>
			<div class="password-wrapper">
				<input id="password2" name="password2" type={showPassword ? 'text' : 'password'} required />
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
			<p class="error">Confirm password.</p>
		{/if}

		{#if form?.passw}
			<p class="error">
				Password must be at least 8 characters long, must include at least one lowercase and
				uppercase letter, and at least one numeric digit and at least one special character (such as
				!, @, #, $, %, ^, &, *).
			</p>
		{/if}

		<button class="btn" id="btn" type="submit">Update</button>
	</form>
</div>
