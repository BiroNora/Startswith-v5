<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let pageName = 'My Contact Profile';
</script>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<div id="top" class="main">
	<hgroup>
		<h3>Contact Profile</h3>
		<div>
			<h5>
				{data.contact.contact_name}
				{#if !data.contact.active}
					{' ⚠️ '}
				{/if}
			</h5>
		</div>
	</hgroup>

	<a href="/lists/contacts/{data?.contact.contact_id}/contact_update" class="ab"> <span>&#9998;</span> Kapcsolattartó adatainak módosítása </a>

	<div>
		<ul class="ac">
			<li class="lb">Név: {data.contact.contact_name}</li>
			<li class="lb">Telefon: {data.contact.contact_phone}</li>
			<li class="lb">Email: {data.contact.contact_email}</li>
			<li class="lb">Feljegyzés: {data.contact.contact_note}</li>
			<li class="lb">Iskola:</li>

			<div class="ac ae">
				{#each data.schools as sch}
					<ul class="ac">
						<p class="lc f">
							<a href="../../lists/schools/{sch.school_id}" class="aa">
								{sch.school_name}
							</a>
						</p>

						<li class="lb">Telefon: {sch.dir_phone}</li>
						<li class="lb">Email: {sch.school_email}</li>
						<li class="lb">Feljegyzés: {sch.note}</li>
					</ul>
				{/each}
			</div>
		</ul>
	</div>

	<a href="#top" class="flower">&#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046 &nbsp &#10046</a>
</div>

<style>
	.ab {
		color: #32bea6;
	}

	.ae {
		padding-top: 0;
	}

	.f {
		line-height: 1rem;
	}
</style>
