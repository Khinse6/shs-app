<template>
	<div class="flex flex-col space-y-8">
		<MemberList :houseCode :userId="user?.sub" />
		<RequestList :houseCode />
	</div>
</template>

<script lang="ts" setup>
	definePageMeta({ layout: 'dashboard' });
	const route = useRoute();
	const houseCode = route.params.slug as string;
	const user = useSupabaseUser();
</script>
