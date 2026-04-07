<script lang="ts">
	import '@picocss/pico';
	import { enhance } from '$app/forms';
	import '../app.css';

	let { data, children } = $props();
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
		<nav class="main-nav">
			<!-- Csoport: Charts -->
			<div class="dropdown">
				<button class="b">Charts &#x25BE</button>
				<div class="dropdown-content">
					<a href="/tables/chart_region_table" target="_blank">Region/City Charts</a>
					<a href="/tables/chart_table" target="_blank">Event Charts</a>
					<a href="/tables/school_event" target="_blank">School/Event Table</a>
				</div>
			</div>

			<!-- Csoport: Registration -->
			<div class="dropdown">
				<button class="b">Registration &#x25BE</button>
				<div class="dropdown-content">
					<a href="/register/school" target="_blank">School Registration</a>
					<a href="/register/location" target="_blank">Location Registration</a>
					<a href="/register/edit_profile" target="_blank">Edit Profile</a>
					<a href="/register/duty_settings" target="_blank">Edit Duty Settings</a>
					{#if data.user.isSuper}
						<a href="/admin" target="_blank">Admin</a>
					{/if}
				</div>
			</div>

			<!-- Csoport: Lists -->
			<div class="dropdown">
				<button class="b">Lists &#x25BE</button>
				<div class="dropdown-content">
					<a href="/lists/colleagues" target="_blank">Colleagues</a>
					<a href="/lists/all_schools" target="_blank">All Schools List</a>
					<a href="/lists/all_events" target="_blank">All Events List</a>
				</div>
			</div>

			<!-- Csoport: My Lists -->
			<div class="dropdown">
				<button class="b">My Lists &#x25BE</button>
				<div class="dropdown-content">
					<a href="/lists/schools" target="_blank">My School List</a>
					<a href="/lists/events" target="_blank">My Event List</a>
					<a href="/lists/contacts" target="_blank">My Contact List</a>
				</div>
			</div>

			<!-- Egyedülálló link: Activity List -->
			<div class="activity-link-wrapper">
				<a href="/lists/activities" target="_blank" class="cc g">Activity List</a>
			</div>

			<div class="e">
				<form class="logout" action="/auth/logout" method="POST" use:enhance>
				<button class="d" type="submit"><img src="/power-button.png" alt="" /></button>
			</form>
			</div>

		</nav>
	{/if}
</div>

<main>
	{@render children()}
</main>

<style>
	.d {
		all: unset;
	}

	.e {
		padding-right: 1rem;
		padding-left: 1rem;
	}

	nav {
		display: flex;
		justify-content: space-between; /* Az elemeket balra rendezi */
		align-items: center;
		width: 100%;
		background-color: white;
		gap: 10px; /* Egyenletes távolság az oszlopok között */
	}

	.dropdown {
		position: relative;
		flex: 1; /* Ez a legfontosabb: minden dropdown ugyanakkora szélességet kap */
		max-width: 180px; /* Megakadályozza, hogy túl szélesek legyenek nagy kijelzőn */
		text-align: center;
	}

	.b {
		color: black;
		border: none;
		background-color: transparent;
		width: 100%; /* A gomb kitölti a dropdown számára fenntartott helyet */
		padding: 10px 5px;
		cursor: pointer;
		font-size: inherit;
		white-space: nowrap;
	}

	.activity-link-wrapper {
		flex: 1;
		max-width: 180px;
		text-align: center;
	}

	.cc {
		color: #32bea6;
		font-weight: bolder;
		text-decoration: none;
	}

	.g:hover {
    color: #908484 !important;
  }

	/* Dropdown Lenyíló rész */
	.dropdown-content {
		display: none;
		position: absolute;
		background-color: #fafdfd;
		min-width: 200px; /* A lenyíló lehet szélesebb, mint a gomb */
		box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
		z-index: 1001;
		border-radius: 4px;
		left: 50%;
		transform: translateX(-50%); /* Középre igazítás a gombhoz képest */
		padding: 10px 0;
		font-size: medium;
	}

	.dropdown-content a {
		padding: 8px 16px;
		text-decoration: none;
		display: block;
		color: #32bea6;
		text-align: left; /* A listaelemek maradjanak balra zártak */
	}

	.dropdown:hover .dropdown-content {
		display: block;
		color: #960d0d;
	}

	.b:hover {
    color: #960d0d !important;
  }

  /* Amikor a dropdown-ban egy link fölé viszed az egeret */
  .dropdown-content a:hover {
    color: #960d0d !important;
  }
</style>
