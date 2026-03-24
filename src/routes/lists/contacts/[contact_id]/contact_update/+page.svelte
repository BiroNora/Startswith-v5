<script>
	import { enhance } from '$app/forms';

	function handleCancel() {
		history.back();
	}

	let yesACT = $state(false);

	// 2. Az effect fogja betölteni az értéket, amikor az oldal betöltődik VAGY a data frissül
	$effect(() => {
		yesACT = data.contact.active;
	});

	let { data, form } = $props();
</script>

<div class="grid element-to-position" id="section_contact">
	<div class="rei">
		<p>Contact Update</p>
	</div>
	<br />
	<form action="?/contact" method="post" use:enhance>
		<div>
			<label for="name">Name</label>
			<input
				type="text"
				value={data.contact.contact_name}
				name="contactname"
				id="contactname"
				required
			/>
		</div>
		<div>
			<label for="email">Email</label>
			<input
				type="email"
				value={data.contact.contact_email}
				name="contactemail"
				id="contactemail"
				required
			/>
		</div>
		<div>
			<label for="phone">Phone</label>
			<input
				type="text"
				value={data.contact.contact_phone}
				name="contactphone"
				id="contactphone"
				required
			/>
		</div>
		<br />
		<div>
			<label for="message">Note</label>
			<textarea id="message" name="contactmessage" rows="2" cols="50"
				>{data.contact.contact_note}</textarea
			>
		</div>
		<br />
		<div class="second">
			ACTIVE
			<input type="checkbox" name="active" bind:checked={yesACT} />
		</div>
		<br />
		<br />
		<button class="btn" id="bt" type="submit">Update</button>
		<button class="btn btn-cancel" id="cancel" type="button" onclick={handleCancel}>
			Cancel ❖ Jump Back
		</button>
	</form>
</div>
