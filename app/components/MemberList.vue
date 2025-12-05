<template>
	<section class="flex flex-col space-y-2">
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
	</section>
</template>

<script lang="ts" setup>
	const props = defineProps<{
		houseCode: string;
		userId: string | undefined;
	}>();

	const { getHouseMembers } = useHouseMembers();
	const {
		data: members,
		error: membersError,
		pending: membersPending,
	} = await getHouseMembers(props.houseCode);

	const isOwner = computed(
		() =>
			members.value?.some(
				(member) => member.isOwner && member.id === props.userId
			) ?? false
	);
</script>
