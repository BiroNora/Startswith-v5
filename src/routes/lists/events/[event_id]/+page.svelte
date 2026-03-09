<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		channelMap,
		dutyMap,
		eventMap,
		formatDate,
		gradeMap,
		statusMap,
		subjectMap,
		timeSlugify
	} from '../../../stores/dataStore.js';
	import type { ActionData, PageData } from './$types';

	let pageName = 'My Event Details';
	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showEventModal = $state(false);
	let showIntrestModal = $state(false);
	let isInput = $state(true);
	let selectedIntrestId = $state(0);
	let itemNumber = $state(0);

	let totalStudents = $derived(data.inters.reduce((total, i) => total + (i.intrest_count || 0), 0));

	function dater(ts: string | Date): string {
		return new Date(ts).toISOString().slice(0, 16);
	}
	function scrollToConnect() {
		window.scrollTo({
			top: 0
		});
	}

	function add(inters: Array<{ intrest_count?: number }>) {
		return inters.reduce((total, inter) => total + (inter.intrest_count || 0), 0);
	}

	// Function to set the itemNumber
	function setItemNumber(index: number) {
		itemNumber = index + 1;
	}

	// Function to set the selected intrest_id
	function setSelectedIntrestId(intrest_id: number) {
		selectedIntrestId = intrest_id;
	}

	function toggleIsInput() {
		isInput = !isInput;
	}
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div id="top" class="main">
	<h1>
		Event Details &nbsp;&nbsp;&nbsp;&nbsp;
		<a
			href="#section4_event"
			role="button"
			class="secondary outline ag h44 w"
			onclick={() => (showEventModal = true)}
		>
			<strong class="error1"> &nbsp;&#10008; </strong>
			&nbsp; Esemény törlése* &nbsp;
		</a>
	</h1>

	<!-- Event delete modal -->

	{#if showEventModal}
		<form action="?/delUser" method="post" use:enhance>
			<article>
				<h3>Az esemény adatai véglegesen törlődnek.</h3>
				<strong class="g">
					&nbsp;* esemény abban az esetben törölhető, ha nincs hozzárendelt érdeklődő diák, illetve,
					ha az eseménynek egy gazdája van
				</strong>
				{#if form?.intern}
					<p class="ah">&nbsp; Az eseményt nem lehet törölni.</p>
				{/if}
				<footer>
					<button type="submit" class="secondary w z cc" data-target="modal-example">
						Confirm
					</button>
					<button
						type="button"
						class="secondary outline h44 w z"
						data-target="modal-example"
						onclick={() => (showEventModal = false)}
					>
						Cancel
					</button>
				</footer>
			</article>
		</form>
	{/if}

	<hgroup>
		<hgroup class="title">
			<h3>{data.event.event_name}</h3>
			<a href="#section_interested" class="aa"> &#9758; Érdeklődő diákok hozzáadása </a>
		</hgroup>
		<br />
		<h4 class="h41">Adatok</h4>
		<a href="#section_event" class="ad"> &#9758; Esemény adatainak módosítása </a>
		<a href="#section2_event" class="ae"> &#9758; Startswith kapcsolat hozzáadása </a>
		<a href="#section3_event" class="af">
			<strong class="error1"> &#10008; </strong>
			&nbsp; Startswith kapcsolat törlése
		</a>
		<ul class="ab">
			<li class="lb">
				Időpont: {formatDate(data.event.closing_date)}, {timeSlugify(data.event.closing_date)}
			</li>
			<li class="lb">Szervező: {data.dutyName}</li>
			<li class="lb">Esemény formája: {data.eventTypeName}</li>
			<li class="lb">Becsült / megjelent résztvevők száma: {data.event.estimated_student}</li>
			<li class="lb">Feljegyzés: {data.event.note}</li>
			<li class="lb">Iskola:</li>
			<hgroup>
				<ul class="ac">
					<li class="la">
						<a href="../../lists/schools/{data.school?.school_id}" class="aa">
							{data.school?.school_name}
							{' 🏠 '}
							{data.cityname}
						</a>
					</li>
				</ul>
			</hgroup>
			<li class="lb">
				Érdeklődők,&emsp;
				<p class="z">összesen {add(data.inters)} diák</p>
				<strong class="st">(a rögzítés sorrendjében, legfelül a legutoljára rögzített) </strong>:
			</li>
			<hgroup>
				{#each data.inters as ints, index}
					<ul class="ac">
						<p class="lc">
							<input type="hidden" name="int_id" value={ints.intrest_id} />
							<a
								href="#inter"
								class="aa"
								onclick={() => {
									setItemNumber(index);
									setSelectedIntrestId(ints.intrest_id);
									showIntrestModal = true;
								}}
							>
								{index + 1}. adat törlése
							</a>
						</p>
						<li class="lb">
							Diákok száma: {ints.intrest_count}
						</li>
						{#each data.countries as country}
							{#if country.country_id === ints.country_id}
								<li class="lb">Ország: {country.country_name}</li>
							{/if}
						{/each}
						<li class="lb">Évfolyam: {ints.grade_name}</li>
						{#each data.regions as regio}
							{#if regio.region_id === ints.region_id}
								<li class="lb">Régió, ahonnan értesült a programról: {regio.region_name}</li>
							{/if}
						{/each}
						<li class="lb">Csatorna, ahonnan értesült a programról: {ints.channel_name}</li>
						{#if ints.applied === true}
							{#each subjectMap as subject (subject.id)}
								{#if ints.work_title === subject.id}
									<li class="lb">Jelentkezési téma: {subject.name}</li>
								{/if}
							{/each}
							<li class="lb">Státusza: {ints.status_name}</li>
						{:else}
							<li class="lb">Nem jelentkezett</li>
						{/if}
						<br />
					</ul>
				{/each}
			</hgroup>

			<!-- Interested delete modal -->

			{#if showIntrestModal}
				<form action="?/delInterest" method="post" use:enhance id="inter">
					<article>
						<h3>A(z) {itemNumber}. adat véglegesen törlődik.</h3>

						{#if form?.interest}
							<p class="ah">&nbsp; Az adatot nem lehet törölni.</p>
						{/if}

						<input type="hidden" name="int_id" value={selectedIntrestId} />
						<input type="hidden" name="event_id" value={data.event.event_id} />
						<footer>
							<button type="submit" class="secondary w z cc" data-target="modal-example">
								Confirm
							</button>
							<button
								type="button"
								class="secondary outline h44 w z"
								data-target="modal-example"
								onclick={() => ((showIntrestModal = false), scrollToConnect())}
							>
								Cancel
							</button>
						</footer>
					</article>
				</form>
			{/if}
		</ul>
		<a href="#top" class="flower">&#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046</a
		>
	</hgroup>

	<!-- Interested students adding form -->

	<div class="grid interested-to-position" id="section_interested">
		<div class="rei">
			<p class="h43">Interested Students Register</p>
		</div>
		<form action="?/interested" method="post" use:enhance>
			<div>
				<label for="number">Number of Students</label>
				<input type="number" name="number" id="number" required />
			</div>
			<div>
				<label for="country">Country</label>
				<select name="country" id="country">
					{#each data.countries as country}
						<option value={country.country_id} selected={country.country_id === data.schoolCountry}
							>{country.country_name}</option
						>
					{/each}
				</select>
			</div>
			<div>
				<label for="grade">Grade</label>
				<select name="grade" id="grade" class="hidden-textbox">
					{#each gradeMap as grade (grade.id)}
						<option value={grade.id}>{grade.name}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="connect">Connected by / Region</label>
				<select name="connect" id="connect">
					{#each data.regions as region}
						<option value={region.region_id} selected={region.region_id === data.schoolRegion}
							>{region.region_name}</option
						>
					{/each}
				</select>
			</div>
			<div>
				<label for="channel">Channeled by</label>
				<select name="channel" id="channel" class="hidden-textbox">
					{#each channelMap as channel (channel.id)}
						<option value={channel.id}>{channel.name}</option>
					{/each}
				</select>
			</div>
			<button type="button" onclick={toggleIsInput} class="contrast outline cgb">Apply</button>
			<input type="hidden" name="apply" value={isInput} />
			<fieldset disabled={isInput}>
				<div>
					<label for="subject">Subject</label>
					<select name="subject" id="subject" class="hidden-textbox">
						{#each subjectMap as subject (subject.id)}
							<option value={subject.id}>{subject.name}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="status">Status</label>
					<select name="status" id="status" class="hidden-textbox">
						{#each statusMap as status (status.id)}
							<option value={status.id}>{status.name}</option>
						{/each}
					</select>
				</div>
				<br />
			</fieldset>
			<button class="btn" id="btn" type="submit">Register</button>
			<br />
			<button
				type="button"
				onclick={scrollToConnect}
				id="backToTop"
				class="contrast outline cgb h44">Cancel &#10070; Jump to the Top</button
			>
		</form>
	</div>

	<!-- Event update form -->

	<div class="grid event-to-position" id="section_event">
		<div class="rei">
			<p>Event Update</p>
		</div>
		<form action="?/event" method="post" use:enhance>
			<div>
				<label for="fantasy"> Event Name * </label>
				<input
					type="text"
					name="fantasy"
					id="fantasy"
					minlength="10"
					placeholder="ANY LONGER"
					value={data.event.event_name}
					required
				/>
				<p><i class="iii">* event name must be unique and at least 10 characters long</i></p>
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
				<label for="type">Event Type</label>
				<select bind:value={data.eventtype} name="type" id="type" class="hidden-textbox">
					{#each eventMap as ev (ev.id)}
						<option value={ev.id}>{ev.name}</option>
					{/each}
				</select>
				<p><i class="iii">in case of * please leave a comment</i></p>
			</div>
			<div>
				<label for="estimate">Estimated / Presented Number of Participants</label>
				<input
					type="text"
					value={data.event.estimated_student}
					name="estimate"
					id="estimate"
					required
				/>
			</div>

			<label for="message">Note</label>
			<textarea id="message" name="message" rows="4" cols="50">{data.event.note || ''}</textarea>
			<button class="btn" id="btnevent" type="submit">Update</button>
			<br />
			{#if form?.user}
				<p class="error">Please enter valide data.</p>
			{/if}
			<button
				type="button"
				onclick={scrollToConnect}
				id="backToTop"
				class="contrast outline cgb h44">Cancel &#10070; Jump to the Top</button
			>
		</form>
	</div>

	<!-- Event user update form -->

	<div class="grid event2-to-position" id="section2_event">
		<div class="rei">
			<p>Event Startswith User Update</p>
		</div>
		<p class="uni">{data.event.event_name}</p>
		<form action="?/eventU" method="post" use:enhance>
			<div>
				<label for="email">Email</label>
				<input type="text" name="email" id="email" required />
			</div>
			{#if form?.userevent || form?.alreadyevent}
				<p class="error">Please enter valide data.</p>
			{/if}
			{#if form?.eventresult}
				<p class="success">Startswith user added.</p>
			{/if}
			<button class="btn" id="btnevent" type="submit">Add</button>
			<br />
			<button
				type="button"
				onclick={scrollToConnect}
				id="backToTop"
				class="contrast outline cgb h44">Cancel &#10070; Jump to the Top</button
			>
		</form>
	</div>

	<!-- User delete form -->

	<div class="grid event3-to-position" id="section3_event">
		<div class="rei">
			<p>Event Startswith User Remove</p>
		</div>
		<p class="uni">{data.event.event_name}</p>
		<form action="?/eventUD" method="post" use:enhance>
			<div>
				<label for="email">Email</label>
				<input type="text" name="email" id="email" required />
			</div>
			{#if form?.user || form?.already}
				<p class="error">Please enter valide data.</p>
			{/if}
			{#if form?.result}
				<p class="success">Startswith user removed.</p>
			{/if}
			<button class="btn" id="btnevent" type="submit">Remove</button>
			<br />
			<button
				type="button"
				onclick={scrollToConnect}
				id="backToTop"
				class="contrast outline cgb h44"
				>Cancel &#10070; Jump to the Top
			</button>
		</form>
	</div>
	<div>
		<a href="#top" class="flower grid event4-to-position"
			>&#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046</a
		>
	</div>
</div>

<style>
	.main {
		padding-left: 5%;
		padding-top: 2%;
		padding-right: 5%;
	}

	.aa {
		color: #32bea6;
		font-weight: 400;
		line-height: normal;
		font-size: 22px;
	}

	.ab {
		color: #83918f;
		padding: 2%;
		font-weight: 400;
		line-height: normal;
		font-size: 22px;
	}

	.ac {
		color: #83918f;
		font-weight: 400;
		line-height: normal;
		padding-top: 1%;
		padding-left: 5%;
		text-indent: -6%;
		font-size: 22px;
	}

	.ad {
		color: #83918f;
		font-weight: 400;
		line-height: normal;
		font-size: 22px;
	}

	.ae {
		color: #83918f;
		padding-left: 3%;
		font-weight: 400;
		line-height: normal;
		font-size: 22px;
	}

	.af {
		color: #83918f;
		padding-left: 8%;
		font-weight: 400;
		line-height: normal;
		font-size: 22px;
	}

	.ag {
		color: #83918f;
		font-weight: 400;
		line-height: normal;
		font-size: 20px;
	}

	.ah {
		color: #83918f;
		padding-top: 2%;
		font-weight: 400;
		line-height: normal;
		font-size: 22px;
	}

	.g {
		color: #83918f;
		font-weight: 350;
		line-height: normal;
		font-size: 20px;
		font-style: italic;
	}

	.z {
		color: rgb(144, 132, 132);
		font-size: medium;
		font-weight: 400;
		font-style: italic;
	}

	.la {
		list-style-type: none;
		padding-left: 5%;
		text-indent: -6%;
		line-height: 1.4;
		font-size: 22px;
	}

	.lb {
		list-style-position: inside;
		list-style-type: circle;
		padding-left: 5%;
		text-indent: -6%;
		line-height: 1.4;
		font-size: 22px;
	}

	.lc {
		list-style-position: inside;
		list-style-type: circle;
		padding-left: 5%;
		text-indent: -6%;
		font-size: 22px;
	}

	fieldset {
		position: relative;
		padding: 6px;
	}

	label {
		padding: 6px;
	}

	.rei p {
		position: relative;
		line-height: normal;
		font-size: 140%;
		font-weight: bold;
	}

	.grid {
		padding: 35px 15px 0px 15px;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-content: space-around;
		width: 55%;
		line-height: 75%;
		grid-row: minmax(5px, auto);
	}

	.grid input:checked {
		background-color: #32bea6;
	}

	.btn {
		margin-bottom: 0;
		background-color: #32bea6;
	}

	.interested-to-position {
		transform: translateY(420vh); /* Move the element down one viewport height (vh) */
	}

	.event-to-position {
		transform: translateY(620vh);
	}

	.event2-to-position {
		transform: translateY(820vh);
	}

	.event3-to-position {
		transform: translateY(1020vh);
	}

	.event4-to-position {
		transform: translateY(1050vh);
		padding-bottom: 80px;
	}

	.flower {
		font-size: 140%;
		color: #a0a9a8;
		text-decoration: none; /* Remove underline */
	}

	.flower:hover {
		font-size: 140%;
		color: #32bea6;
		text-decoration: none; /* Remove underline */
	}

	.h41 {
		color: #83918f;
	}

	.h43 {
		color: #737978;
	}

	.h44 {
		color: #83918f;
		border-color: #83918f;
	}

	.w {
		width: auto;
	}

	.z {
		display: inline-flex;
		flex-direction: row-reverse;
	}

	.st {
		font-size: 17px;
		font-weight: 300;
	}

	.uni {
		color: #444f4d;
		font-weight: 500;
		line-height: normal;
		font-size: 24px;
	}

	.error {
		color: tomato;
		padding: 2%;
		text-align: center;
		font-style: italic;
		line-height: 95%;
		font-weight: 500;
	}

	.error1 {
		color: tomato;
		text-align: center;
		font-style: italic;
		line-height: 95%;
		font-weight: 500;
	}

	.success {
		color: #32bea6;
		padding: 2%;
		text-align: center;
		font-style: italic;
		line-height: 95%;
		font-weight: 500;
	}

	.cc {
		background-color: #32bea6;
		border: 1em solide #32bea6;
		color: white;
	}

	.cc:hover {
		background-color: #0ba38a;
	}
	article::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
</style>
