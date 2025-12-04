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
	import type { NavigationMenuItem, NavigationMenuChildItem } from '@nuxt/ui';
	const user = useSupabaseUser();
	const { signOut } = useAuth();
	const collapsed = ref(false);

	defineShortcuts({ c: () => (collapsed.value = !collapsed.value) });
	const { data: houses } = await useHouse().getHouses();

	const housePages = ref<NavigationMenuChildItem[]>([]);

	watchEffect(() => {
		housePages.value =
			houses.value?.map((row) => ({
				label: row.displayName,
				to: '/dashboard/houses/' + row.id,
			})) ?? [];
	});

	const pages = computed<NavigationMenuItem[]>(() => [
		{
			label: 'Home',
			to: '/dashboard',
			icon: 'heroicons:home',
			children: housePages.value,
		},
	]);

	async function onLogout() {
		const { error } = await signOut();
		if (error) throw error;
		clearNuxtData();
		navigateTo('/dashboard/login');
	}
</script>
