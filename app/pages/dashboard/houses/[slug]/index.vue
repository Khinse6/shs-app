<template>
	<div class="flex flex-col space-y-8">
		<div class="flex flex-col space-y-2">
			<h2 class="text-2xl">House Members</h2>
			<p v-if="pendingMembers">Loading members</p>
			<p v-else-if="errorMembers">{{ errorMembers }}</p>
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
			<p v-if="pendingRequests">Loading requests</p>
			<p v-else-if="errorRequests">{{ errorRequests }}</p>
			<p v-else-if="!requests || requests?.length === 0">No requests found</p>
			<template v-else>
				<p v-for="request in requests">
					{{ request.user.full_name }}
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

	const houseMembersStore = useHouseMembersStore();
	const houseRequestsStore = useHouseRequestsStore();

	const {
		membersMap,
		pendingMap: membersPendingMap,
		errorMap: membersErrorMap,
	} = storeToRefs(houseMembersStore);
	const {
		requestsMap,
		pendingMap: requestsPendingMap,
		errorMap: requestsErrorMap,
	} = storeToRefs(houseRequestsStore);

	await callOnce('members-' + houseCode, () =>
		houseMembersStore.getHouseMembers(houseCode)
	);

	await callOnce('requests-' + houseCode, () =>
		houseRequestsStore.getHouseRequests(houseCode)
	);

	const members = computed(() => membersMap.value[houseCode] ?? []);
	const pendingMembers = computed(
		() => membersPendingMap.value[houseCode] ?? false
	);
	const errorMembers = computed(() => membersErrorMap.value[houseCode] ?? null);

	const requests = computed(() => requestsMap.value[houseCode] ?? []);
	const pendingRequests = computed(
		() => requestsPendingMap.value[houseCode] ?? false
	);
	const errorRequests = computed(
		() => requestsErrorMap.value[houseCode] ?? null
	);

	const isOwner = computed(
		() =>
			members.value?.some(
				(member) => member.isOwner && member.id === user.value?.sub
			) ?? false
	);
</script>
