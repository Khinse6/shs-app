<template>
	<UDashboardSidebar
		v-model:collapsed="collapsed"
		collapsible
		:ui="{ footer: 'border-t border-default' }"
	>
		<template #header>
			<h2 v-if="!collapsed">{{ user?.user_metadata?.full_name }}</h2>
		</template>
		<template #default="{ collapsed }">
			<UNavigationMenu
				:items="pages"
				orientation="vertical"
				as="nav"
				variant="pill"
				:collapsed="collapsed"
			/>
		</template>
		<template #footer="{ collapsed }">
			<UButton
				leading-icon="heroicons:arrow-left-start-on-rectangle"
				:label="collapsed ? undefined : 'Logout'"
				@click="onLogout"
				color="neutral"
				variant="soft"
				class="w-full"
				:block="collapsed"
			/>
		</template>
	</UDashboardSidebar>
</template>

<script lang="ts" setup>
	import { error } from '#build/ui';
	import type { NavigationMenuItem } from '@nuxt/ui';

	const user = useSupabaseUser();
	const { signOut } = useAuth();
	const collapsed = ref(false);

	defineShortcuts({ c: () => (collapsed.value = !collapsed.value) });

	const houseStore = useHouseStore();
	const houseMembersStore = useHouseMembersStore();
	const houseRequestsStore = useHouseRequestsStore();

	const pages = <NavigationMenuItem[]>[
		{
			label: 'Home',
			to: '/dashboard',
			icon: 'heroicons:home',
		},
	];

	async function onLogout() {
		const { error: logoutError } = await signOut();
		if (logoutError) throw error;

		houseStore.reset();
		houseMembersStore.reset();
		houseRequestsStore.reset();
		navigateTo('/dashboard/login');
	}
</script>
