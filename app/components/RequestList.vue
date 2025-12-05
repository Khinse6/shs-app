<template>
	<section class="flex flex-col space-y-2">
		<h2 class="text-2xl">Pending requests</h2>
		<p v-if="requestsPending">Loading requests</p>
		<p v-else-if="requestsError">{{ requestsError }}</p>
		<p v-else-if="!requests || requests?.length === 0">No requests found</p>
		<ul v-else>
			<li v-for="request in requests" :key="request.user.id">
				<span>{{ request.user.full_name }}</span>
				<UFieldGroup>
					<UButton
						icon="heroicons:check"
						color="success"
						@click="onAproveRequest(request.user.id)"
					/>
					<UButton
						icon="heroicons:x-mark"
						color="error"
						@click="onDeclineRequest(request.user.id)"
					/>
				</UFieldGroup>
			</li>
		</ul>
	</section>
</template>

<script lang="ts" setup>
	const props = defineProps<{
		houseCode: string;
	}>();

	const { getHouseRequests, approveHouseRequest, declineHouseRequest } =
		useHouseRequests();
	const {
		data: requests,
		error: requestsError,
		pending: requestsPending,
	} = await getHouseRequests(props.houseCode);

	async function onAproveRequest(userId: string) {
		const { error } = await approveHouseRequest(userId, props.houseCode);
		refreshNuxtData([
			'members-' + props.houseCode,
			'requests-' + props.houseCode,
		]);
		console.log(error);
	}

	async function onDeclineRequest(userId: string) {
		const { error } = await declineHouseRequest(userId, props.houseCode);
		refreshNuxtData(['requests-' + props.houseCode]);
		console.log(error);
	}
</script>
