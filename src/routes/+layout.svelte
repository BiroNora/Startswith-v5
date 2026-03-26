<script lang="ts">
	import '@picocss/pico';
	import { enhance } from '$app/forms';
	let { data, children } = $props();
	import '../app.css';
</script>

<div class="m">
	{#if !data.user}
		<div></div>
	{:else if data.user.active === false}
		<div>
			<br />
			<h6>Please contact your manager.</h6>
		</div>
	{:else}
		<nav>
			<ul class="dropdown">
				<li>
					<button class="b">Charts &#x25BE</button>
				</li>
				<ul class="dropdown-content">
					<li>
						<a href="/tables/chart_region_table" target="_blank">Region/City Charts</a>
					</li>
					<li>
						<a href="/tables/chart_table" target="_blank">Event Charts</a>
					</li>
					<li>
						<a href="/tables/school_event" target="_blank">School/Event Table</a>
					</li>
				</ul>
			</ul>

			<ul class="dropdown">
				<li>
					<button class="b">Registration &#x25BE</button>
				</li>
				<ul class="dropdown-content">
					<li>
						<a href="/register/school" target="_blank">School Registration</a>
					</li>
					<li>
						<a href="/register/location" target="_blank">Location Registration</a>
					</li>
					<li>
						<a href="/register/edit_profile" target="_blank">Edit Profile</a>
					</li>
					{#if data.user.duty[4] % 10 !== 0}
						<li>
							<a href="/register/access_control" target="_blank">Access Control</a>
						</li>
					{/if}
				</ul>
			</ul>

			<ul class="dropdown">
				<li>
					<button class="b">Lists &#x25BE</button>
				</li>
				<ul class="dropdown-content">
					<li>
						<a href="/lists/colleagues" target="_blank">Colleagues</a>
					</li>
					<li>
						<a href="/lists/all_schools" target="_blank">All Schools List</a>
					</li>
					<li>
						<a href="/lists/all_events" target="_blank">All Events List</a>
					</li>
				</ul>
			</ul>

			<ul class="dropdown">
				<li>
					<button class="b">My Lists &#x25BE</button>
				</li>
				<ul class="dropdown-content">
					<li>
						<a href="/lists/schools" target="_blank">My School List</a>
					</li>
					<li>
						<a href="/lists/events" target="_blank">My Event List</a>
					</li>
					<li>
						<a href="/lists/contacts" target="_blank">My Contact List</a>
					</li>
				</ul>
			</ul>

			<div class="c">
				<a href="/lists/activities" target="_blank">Activity List</a>
			</div>
		</nav>

		<form class="logout" action="/auth/logout" method="POST" use:enhance>
			<button class="d" type="submit"><img src="/power-button.png" alt="" /></button>
		</form>
	{/if}
</div>

<main>
	{@render children()}
</main>

<style>
	.b {
		color: black;
		border: 1px white;
		background-color: rgb(255, 255, 255);
		position: relative;
	}

	.c {
		text-align: center;
		padding-top: 35px;
	}

	.c:hover {
		color: #9c1111;
		text-align: center;
		font-weight: 400;
	}

	.d {
		border: 1px rgb(81, 15, 15);
		background-color: rgb(255, 255, 255);
		display: inline-flex;
		width: 100%;
	}

	.m {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		padding-left: 2%;
		padding-right: 2%;
		font-size: 20px;
	}

	nav {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		width: 100%;
		background-color: white;
		padding-right: 2%;
		margin-top: -2%;
	}

	ul {
		list-style: none;
		display: flex;
		width: 90%;
		padding-left: 1%;
		justify-content: flex-start;
		align-items: center;
	}

	ul li {
		display: inline-block;
		height: 100%;
	}

	.dropdown {
		position: relative;
		display: inline-block;
		z-index: 1000;
	}

	/* Dropdown Content (Hidden by Default) */
	.dropdown-content {
		display: none;
		position: absolute;
		background-color: #fafdfd;
		z-index: 1001;
		transition:
			opacity 150ms ease-in-out,
			transform 150ms ease-in-out;
		transform: translate(-10px);
		border-radius: 0.25rem;
		left: 1%;
		top: calc(80% - 0.25rem);
	}

	/* Links inside the dropdown */
	.dropdown-content a {
		text-decoration: none;
		display: block;
		transition: opacity 150ms ease-in-out;
		color: #32bea6;
	}

	/* Change color of dropdown links on hover */
	.dropdown-content a:hover {
		color: #9c1111;
		transition:
			opacity 150ms ease-in,
			transform 150ms ease-in-out;
	}

	/* Show the dropdown menu on hover */
	.dropdown:hover .dropdown-content {
		display: block;
		min-width: 20px;
	}

	/* Change the background color of the dropdown button when the dropdown content is shown */
	.dropdown:hover .b {
		color: #32bea6;
		font-weight: 600;
	}
</style>
