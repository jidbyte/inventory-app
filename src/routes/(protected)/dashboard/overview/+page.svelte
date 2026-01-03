<script>
	let { data } = $props();

	// const session = $derived(data.session);
	// const user = $derived(data.user);
</script>

<div>
	{#await data.user}
		<p>Loading...</p>
	{:then user}
		<div>{user?.id}</div>
		<div>{user?.name}</div>
		<div>{user?.email}</div>
	{:catch error}
		<p>Error: {error.message}</p>
	{/await}
</div>
