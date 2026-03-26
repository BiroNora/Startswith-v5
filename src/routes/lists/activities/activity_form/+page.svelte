<script>
	import { enhance } from '$app/forms';
	import { dutyMap } from '../../../stores/dataStore.js';

	function handleCancel() {
		history.back();
	}
	let { data, form } = $props();
</script>

<div class="grid">
		<div class="rei">
			<p class="black">Activity Register</p>
		</div>

		<form action="?/activity" method="post" use:enhance>
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
					{#each dutyMap as item (item.id)}
						<option value={item.id}>{item.name}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="region">Region</label>
				<select name="region" id="region">
					{#each data.regio as reg}
						<option value={reg.region_id}>{reg.region_name}</option>
					{/each}
				</select>
			</div>
			<label for="message">Note</label>
			<textarea id="message" name="message" rows="2" cols="50"></textarea>

			<button class="btn" id="btn" type="submit">Register</button>
			<button class="btn btn-cancel" id="cancel" type="button" onclick={handleCancel}>
				Cancel ❖ Jump Back
			</button>
		</form>
	</div>
