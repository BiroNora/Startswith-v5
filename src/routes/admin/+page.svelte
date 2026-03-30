<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Állapotok
	let email = $state('');
	let isInput = $state(true);

	function toggleIsInput() {
		isInput = !isInput;
	}

	// Szinkronizáció a backend válaszával
	/* $effect(() => {
		if (form?.foundUser) {
			email = form.foundUser.email;
		}
	}); */
</script>

<svelte:head>
	<title>ADMIN</title>
</svelte:head>

<div class="grid">
	<div class="rei">
		<p class="black">ADMIN Account Settings</p>
	</div>

	<form method="post" use:enhance>
		<div>
			<label for="email">Email</label>
			<input type="email" name="email" id="email" bind:value={email} required />
			<div class="pad">
				<a
					href="/admin/add_duty?email={email}"
					type="button"
					class="btn btn-cancel"
					onclick={(e) => {
						if (!email || !email.includes('@')) {
							e.preventDefault(); // MEGÁLLÍTJA a navigációt
							alert('Kérlek, adj meg egy érvényes email címet!');
							return;
						}
						toggleIsInput();
					}}
				>
					Check / Add Duty
				</a>
			</div>
			<div class="pad">
				<button
					type="submit"
					formaction="?/search-del"
					class="btn btn-cancel"
					onclick={() => (isInput = false)}
				>
					Check / Delete Duty
				</button>
			</div>
			<div class="pad">
				<button
					type="submit"
					formaction="?/add-new-user"
					class="btn btn-cancel"
					onclick={() => (isInput = false)}
				>
					Add New User
				</button>
			</div>
			<div class="pad">
				<a href="/" class="btn btn-close" type="button"> Close Admin </a>
			</div>
		</div>
	</form>
</div>

{#if form?.success}
	<div class="success-box" transition:fade>
		<p>✅ <strong>Sikeres létrehozás!</strong></p>
		<p>A felhasználó új jelszava: <span class="pass-display">{form.generatedPassword}</span></p>
		<small>Másold ki, mert az oldal elhagyása után nem lesz látható!</small>
	</div>
{/if}

<style>
	.success-box {
		margin-top: 20px;
		padding: 15px;
		background-color: #e6fffa;
		border: 1px solid #38b2ac;
		border-radius: 8px;
		text-align: center;
		color: #2c7a7b;
	}
	.pass-display {
		font-family: monospace;
		font-size: 1.2rem;
		background: white;
		padding: 2px 8px;
		border: 1px dashed #38b2ac;
		font-weight: bold;
	}
</style>
