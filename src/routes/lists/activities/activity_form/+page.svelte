<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { DUTY_MAP } from '../../../stores/dataStore.js';

	function handleCancel() {
		history.back();
	}
	let { data } = $props();

	let submitting = $state(false);

	let pageName = 'Activity Rgeister';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div class="grid">
	<div class="rei">
		<p class="black">Activity Register</p>
	</div>

	<form
		action="?/activity"
		method="post"
		use:enhance={() => {
			submitting = true;
			return async ({ result, update }) => {
				if (result.type === 'redirect') {
					await update();
				} else if (result.type === 'error' || result.type === 'failure') {
					submitting = false;
					alert('Hiba történt a küldés során!');
				}
			};
		}}
	>
		<input type="hidden" name="user_id" value={data.user_id} />
		<div>
			<label for="fantasy">Activity</label>
			<input type="text" name="fantasy" id="fantasy" placeholder="Beeing active" required />
		</div>
		<div>
			<label for="meeting-time">Activity Date</label>
			<input
				type="datetime-local"
				id="meeting-time"
				name="meeting-time"
				value="YYYY-MM-DDT00:00"
				min="2021-06-07T00:00"
				max="2060-06-14T00:00"
			/>
		</div>
		<div>
			<label for="duty">Duty</label>
			<select name="duty" id="duty">
				{#each DUTY_MAP as item (item.id)}
					<option value={item.id}>{item.name}</option>
				{/each}
			</select>
		</div>
		<div>
			<label for="region">Region</label>
			<select name="region" id="region">
				{#each data.regions as reg}
					<option value={reg.region_id}>{reg.region_name}</option>
				{/each}
			</select>
		</div>
		<label for="message">Note</label>
		<textarea id="message" name="message" rows="2" cols="50"></textarea>

		<button class="btn" id="btn" type="submit"
			>{#if submitting}
				Sending...
			{:else}
				Send Message
			{/if}</button
		>
		<button
			class="btn btn-cancel"
			id="cancel"
			type="button"
			onclick={handleCancel}
			disabled={submitting}
		>
			Cancel ❖ Jump Back
		</button>
	</form>
</div>
