<script lang="ts">
	import { enhance } from '$app/forms';
	import { dutyMap, eyeClosed, eyeOpen, LEVEL_LABELS } from '../../stores/dataStore';
	import type { ActionData, PageData } from './$types';
	import { fade } from 'svelte/transition';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showPassword = $state(false);

	let showModal = $state(false);
	let selectedDutyId = $state<number | null>(null);

	function confirmDelete(id: number) {
		selectedDutyId = id;
		showModal = true;
	}

	// REAKTÍV ALAPOK: Ha a data frissül, ezek is frissülnek

	let pageName = 'Edit Profile';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div class="grid">
	<div class="rei">
		<p class="black">Account Settings</p>
	</div>
	<br />
	<form action="?/user" method="post" use:enhance>
		<div>
			<label for="name">Name</label>
			<input type="text" name="name" id="name" value={data.user?.name} required />
		</div>
		<div>
			<label for="phone">Phone</label>
			<input type="text" name="phone" id="phone" value={data.user?.phone} required />
		</div>

		<div class="duties-container">
			{#each data.user?.duty || [] as u}
				<article class="art-div">
					<div class="art">
						<div>
							{#if u.type === 'USER'}
								<div>
									{LEVEL_LABELS[u.level]}<small
										>— {data.regions.find((r) => r.region_id === u.region_id)?.region_name}</small
									>
								</div>
							{:else if u.type === 'SUPERIOR'}
								<strong>{u.type}</strong>
								<small>— {data.regions.find((r) => r.region_id === u.region_id)?.region_name}</small
								>
							{:else if u.type === 'DIRECTOR'}
								<ins>{u.type}</ins>
								<small>— {LEVEL_LABELS[u.level]}</small>
							{/if}
						</div>

						{#if u.type === 'USER' && u.level <= 3}
							<button
								type="button"
								class="outline art-btn"
								onclick={() => confirmDelete(u.id)}
							>
								<div class="x-icon">x</div>
							</button>
						{/if}
					</div>
				</article>
			{:else}
				<p>Nincsenek beosztások.</p>
			{/each}
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

		{#if form?.regions}
			<p class="error">One duty must be choosen.</p>
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

{#if showModal}
	<dialog open>
		<article>
			<header>
				<a href="#close" aria-label="Close" class="close" onclick={() => (showModal = false)}></a>
				<h5>Confirm Deletion</h5>
			</header>
			<form action="?/delRole" method="post" use:enhance>
			<input type="hidden" name="dutyId" value={selectedDutyId} />
				<div>
					<h6>Az esemény adatai véglegesen törlődnek.</h6>
					<footer>
						<button type="submit" class="btn" data-target="modal-example"> Confirm </button>
						<button
							type="button"
							class="btn btn-cancel btn-outline"
							data-target="modal-example"
							onclick={() => (showModal = false)}
						>
							Cancel
						</button>
					</footer>
				</div>
			</form>
		</article>
	</dialog>
{/if}
