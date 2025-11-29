<template>
	<div class="flex flex-col">
		<p v-if="loading">Loading</p>
		<p v-else-if="error">{{ error }}</p>
		<p v-else-if="houses">No houses found</p>
		<p v-for="house in houses">{{ house.name }} - {{ house.code }}</p>
	</div>
</template>

<script lang="ts" setup>
	definePageMeta({
		title: "Houses",
		layout: "dashboard"
	});
	const { error, loading, houses, getHouses } = useHouses();
	await getHouses();
</script>
