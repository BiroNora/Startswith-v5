<script>
	import { enhance } from '$app/forms';
	import { dutyMap, eventMap } from '../../../../stores/dataStore';

	let { form } = $props();
</script>

<div class="grid element-to-position" id="section_event">
	<div class="rei">
		<p>Event Register</p>
	</div>
	<form
		action="?/event_form"
		method="post"
		use:enhance
	>
		<div>
			<label for="fantasy"> Event Name * </label>
			<input
				type="text"
				name="fantasy"
				id="fantasy"
				minlength="10"
				placeholder="ANY LONGER"
				required
			/>
			<p><i class="iii">* event name must be unique and at least 10 characters long</i></p>
		</div>
		<div>
			<label for="meeting-time">Event Date</label>
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
			<label for="duty">On Duty</label>
			<select name="duty" id="duty" class="hidden-textbox">
				{#each dutyMap as item (item.id)}
					<option value={item.id}>{item.name}</option>
				{/each}
			</select>
		</div>
		<div>
			<label for="type">Event Type</label>
			<select name="type" id="type" class="hidden-textbox">
				{#each eventMap as item (item.id)}
					<option value={item.id}>{item.name}</option>
				{/each}
			</select>
			<p><i class="iii">in case of * please leave a comment</i></p>
		</div>
		<div>
			<label for="estimate">Estimated Number of Participants</label>
			<input type="number" name="estimate" id="estimate" required />
		</div>
		<label for="message">Note</label>
		<textarea id="message" name="message" rows="2" cols="50"></textarea>

		{#if form?.errors}
			<p class="error">Wrong credentials.</p>
		{/if}

		<button class="btn" id="btnevent" type="submit">Register</button>
	</form>
</div>
