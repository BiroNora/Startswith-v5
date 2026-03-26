<script>
	import { enhance } from '$app/forms';

	function handleCancel() {
		history.back();
	}
	let { data } = $props();

	let pageName = 'Central Message';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div class="grid">
	<div class="rei">
		<p class="black">Central Message Register</p>
	</div>

	{#if data.dir_flag}
		<form action="?/dir_message" method="post" use:enhance>
			<input type="hidden" name="user_id" value={data.user_id} />
			<div>
				<label for="meeting-time">Show Message till this Date</label>
				<input
					type="datetime-local"
					id="meeting-time"
					name="meeting-time"
					value="YYYY-MM-DDT00:00"
					min="2021-06-07T00:00"
					max="2060-06-14T00:00"
					required
				/>
			</div>

			<div>
				<label for="region">Select Region</label>
				<select name="region" id="region" class="hidden-textbox">
					<option value="ALL">ALL</option>
					{#each data.regio as reg}
						<option value={reg.region_id}>{reg.region_name} </option>
					{/each}
				</select>
			</div>

			<label for="message">Message</label>
			<textarea id="message" name="message" rows="4" cols="50"></textarea>

			<button class="btn" id="btn" type="submit">Send Message</button>
			<button class="btn btn-cancel" id="cancel" type="button" onclick={handleCancel}>
				Cancel ❖ Jump Back
			</button>
		</form>
	{:else}
		<div>
			<p class="black">Sorry, message writing is not possible.</p>
		</div>
	{/if}
</div>
