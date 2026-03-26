<script lang="ts">
	import { enhance } from '$app/forms';
	import { dutyMap, eventMap } from '../../../../stores/dataStore.js';

	function handleCancel() {
		history.back();
	}

	function dater(ts: string | Date): string {
		return new Date(ts).toISOString().slice(0, 16);
	}

	let { data, form } = $props();
</script>

<div class="grid">
	<div class="rei">
		<p class="black">Event Update</p>
	</div>
	<p class="black">{data.event.event_name}</p>

	<form action="?/event" method="post" use:enhance>
		<div>
			<label for="fantasy">
				Event Name <i class="iii">must be unique and at least 10 characters long</i>
			</label>
			<input
				type="text"
				name="fantasy"
				id="fantasy"
				minlength="10"
				placeholder="ANY LONGER"
				value={data.event.event_name}
				required
			/>
		</div>

		<div>
			<label for="meeting-time">Event Date</label>
			<input
				type="datetime-local"
				id="meeting-time"
				value={dater(String(data.event.closing_date))}
				name="meeting-time"
				min="2021-06-07T00:00"
				max="2060-06-14T00:00"
			/>
		</div>

		<div>
			<label for="duty">On Duty</label>
			<select bind:value={data.onduty} name="duty" id="duty" class="hidden-textbox">
				{#each dutyMap as du (du.id)}
					<option value={du.id}>{du.name} </option>
				{/each}
			</select>
		</div>

		<div>
			<label for="type">Event Type <i class="iii">in case of * please leave a comment</i></label>
			<select bind:value={data.eventtype} name="type" id="type" class="hidden-textbox">
				{#each eventMap as ev (ev.id)}
					<option value={ev.id}>{ev.name}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="estimate">Estimated / Presented Number of Participants</label>
			<input
				type="number"
				value={data.event.estimated_student}
				name="estimate"
				id="estimate"
				required
			/>
		</div>

		<label for="message">Note</label>
		<textarea id="message" name="message" rows="2" cols="50">{data.event.note || ''}</textarea>

		<button class="btn" id="btnevent" type="submit">Update</button>
		{#if form?.title}
			<p class="error">Please enter valide data.</p>
		{/if}
		<button class="btn btn-cancel" id="cancel" type="button" onclick={handleCancel}>
			Cancel ❖ Jump Back
		</button>
	</form>
</div>
