<template>
	<div class="w-full">
		<UPageHeader title="My houses:">
			<template #links>
				<UFieldGroup>
					<UButton label="Create House" @click="createModal.open()" />
					<UButton
						label="Join House"
						@click="joinModal.open()"
						color="neutral"
						variant="subtle"
					/>
				</UFieldGroup>
			</template>
		</UPageHeader>
		<h2 class="my-4 text-2xl"></h2>
		<p v-if="pending && (!houses || houses.length === 0)">Loading Houses</p>
		<p v-else-if="error">{{ error }}</p>
		<p v-else-if="!houses || houses?.length === 0">No houses found</p>
		<template v-else>
			<section class="flex flex-row flex-wrap gap-8">
				<UPageCard
					v-for="house in houses"
					:key="house.id"
					:title="house.displayName"
					:to="'/dashboard/houses/' + house.id"
					variant="soft"
					class="cursor-pointer"
				>
					<template #description>
						<h3 class="text-lg">Owner: {{ house.owner }}</h3>
						<p>Code: {{ house.id }}</p>
					</template>
				</UPageCard>
			</section>
		</template>
	</div>
</template>

<script setup lang="ts">
	import CreateHouseModal from '~/components/CreateHouseModal.vue';
	import JoinHouseModal from '~/components/JoinHouseModal.vue';

	definePageMeta({ title: 'Dashboard', layout: 'dashboard' });

	const { getHouses } = useHouse();
	const { data: houses, error, pending } = await getHouses();

	const overlay = useOverlay();
	const createModal = overlay.create(CreateHouseModal);
	const joinModal = overlay.create(JoinHouseModal);
</script>
