<template>
	<div class="p-4">
		<p v-if="pending && (!houses || houses.length === 0)">Loading Houses</p>
		<p v-else-if="error">{{ error }}</p>
		<p v-else-if="!houses || houses?.length === 0">No houses found</p>
		<template v-else>
			<h1>All Houses</h1>
			<UPageCard
				v-for="house in houses"
				:key="house.id"
				:title="house.displayName"
				:description="'Code: ' + house.id + 'Owner: ' + house.owner"
				:to="'/dashboard/houses/' + house.id"
				variant="soft"
				class="mb-2 cursor-pointer"
			/>
		</template>
		<UButton label="Create House" @click="onCreateHouse" />
	</div>
</template>

<script setup lang="ts">
	definePageMeta({ title: 'Dashboard', layout: 'dashboard' });

	// const { getHouses, createHouse } = useHouse();
	// const { data: houses, error, pending, refresh } = await getHouses();

	const houseStore = useHouseStore();
	const {
		houses,
		housesError: error,
		housesPending: pending,
	} = storeToRefs(houseStore);
	await callOnce('houses', () => houseStore.getHouses());

	async function onCreateHouse() {
		console.log('create house yeyy!');
	}
</script>
