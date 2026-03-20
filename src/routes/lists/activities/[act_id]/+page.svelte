<script lang="ts">
	import { enhance } from '$app/forms';
	import { dateSlugify, dutyMap } from '../../../stores/dataStore.js';

	let pageName = 'Activity Delete Page';
	let { data } = $props();
	let showModal = $state(false);

	let regionDisplay = $derived.by(() => {
		const reg_id = data.activity?.on_duty.charAt(1);
		if (reg_id === '0') return 'every regions';
		return data.region?.region_name || 'Unknown region';
	});

	function toggleModal(e: Event) {
		e.preventDefault();
		showModal = !showModal;
	}
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div id="top" class="main">
	<hgroup>
		<h3>Activity Delete Page</h3>
		<a href="../activities" class="ab"> &#9758; Vissza a programok oldalra </a>
	</hgroup>
	<hgroup class="title">
		<a href="#top" class="aa" onclick={toggleModal}>
			<strong class="error1"> &#10008;&nbsp;&nbsp; &nbsp; </strong>
			{dateSlugify(String(data.activity?.end_date))}
			&#9753
			{data.activity?.act_name}
			&#10087
			{#if data.activity?.act_note !== null}
				{data.activity?.act_note}
			{/if}
			{' 🏠 '}
			{#each dutyMap as item (item.id)}
				{#if data.activity?.on_duty.charAt(0) === item.id}
					{item.name}:
				{/if}
			{/each}
			{regionDisplay}
		</a>
	</hgroup>

	<!-- Delete modal -->

	{#if showModal}
		<form
			action="?/delAct"
			method="post"
			use:enhance={() => {
				return async ({ result }) => {
					// Ha a szerver redirect-et küld, hajtsa végre!
					if (result.type === 'redirect') {
						window.location.href = result.location;
					}
				};
			}}
		>
			<article>
				<h3>Az esemény adatai véglegesen törlődnek.</h3>
				<footer>
					<button type="submit" class="secondary w z cc i"> Confirm </button>

					<button
						type="button"
						class="secondary outline h44 w z i"
						onclick={() => (showModal = false)}
					>
						Cancel
					</button>
				</footer>
			</article>
		</form>
	{/if}
</div>

<style>
	.aa {
		color: #32bea6;
		font-weight: 400;
		line-height: normal;
		font-size: 20px;
	}

	.ab {
		color: #32bea6;
		font-weight: 400;
		line-height: normal;
		font-size: 20px;
	}

	.h44 {
		color: #83918f;
		border-color: #83918f;
	}

	.i {
		font-style: italic;
	}

	.w {
		width: auto;
	}

	.z {
		display: inline-flex;
		flex-direction: row-reverse;
	}

	.error1 {
		color: tomato;
		text-align: center;
		font-style: italic;
		line-height: 95%;
		font-weight: 500;
	}

	.title {
		padding-top: 4%;
	}

	.cc {
		background-color: #32bea6;
		border: 1em solide #32bea6;
	}

	.cc:hover {
		background-color: #0ba38a;
	}
	article::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
</style>
