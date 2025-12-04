<template>
	<div class="flex flex-col space-y-8">
		<div class="flex flex-col space-y-2">
			<h2 class="text-2xl">House Members</h2>
			<p v-if="membersPending">Loading members</p>
			<p v-else-if="membersError">{{ membersError }}</p>
			<p v-else-if="!members || members?.length === 0">No members found</p>
			<template v-else>
				<UPageList>
					<UPageCard
						v-for="(member, index) in members"
						:key="index"
						:title="member.name"
						:description="member.isOwner ? 'Owner of the house' : ''"
						orientation="horizontal"
					>
						<template #default>
							<UButton
								:icon="
									isOwner && !member.isOwner
										? 'heroicons:x-mark'
										: 'heroicons:lock-closed'
								"
								:square="true"
								:disabled="!isOwner || member.isOwner"
								:label="member.isOwner ? `Can't kick owner` : 'Kick member'"
								color="error"
								variant="soft"
							/>
						</template>
					</UPageCard>
				</UPageList>
			</template>
		</div>
		<div class="flex flex-col space-y-2">
			<h2 class="text-2xl">Pending requests</h2>
			<p v-if="requestsPending">Loading requests</p>
			<p v-else-if="requestsError">{{ requestsError }}</p>
			<p v-else-if="!requests || requests?.length === 0">No requests found</p>
			<template v-else>
				<p v-for="request in requests">
					{{ request.full_name }}
				</p>
			</template>
		</div>
	</div>
</template>

<script lang="ts" setup>
	definePageMeta({ layout: 'dashboard' });

	const route = useRoute();
	const houseCode = route.params.slug as string;
	const user = useSupabaseUser();

	const { getHouseRequests } = useHouseRequests();
	const {
		data: requests,
		error: requestsError,
		pending: requestsPending,
	} = await getHouseRequests(houseCode);

	const { getHouseMembers } = useHouseMembers();
	const {
		data: members,
		error: membersError,
		pending: membersPending,
	} = await getHouseMembers(houseCode);

	const isOwner = computed(
		() =>
			members.value?.some(
				(member) => member.isOwner && member.id === user.value?.sub
			) ?? false
	);
</script>
