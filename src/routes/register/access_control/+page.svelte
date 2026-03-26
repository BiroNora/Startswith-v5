<script>
	import { enhance } from '$app/forms';

let { data } = $props();
let is_dir = $derived((data.user?.on_duty?.[4] ?? 0) % 10 !== 0);
	let alertShown = $state(false);

	function showAlert() {
		if (alertShown) return;

		alert('User status will be changed.');
		alertShown = true;
	}

	let pageName = 'Access Control';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

{#if is_dir}
	<div class="grid">
		<div class="rei">
			<p class="black">Update Startswith's User Access</p>
		</div>
		<br />
		<form action="?/user_active_change" method="post" use:enhance>
			<div>
				<label for="email">Email</label>
				<input type="text" name="email" id="email" required />
			</div>

			<button onclick={showAlert} class="btn" id="btn" type="submit">
				Inactive / Reactive User
			</button>
		</form>
	</div>
{/if}
