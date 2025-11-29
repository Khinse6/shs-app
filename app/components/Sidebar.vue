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
				@click="logout"
				color="neutral"
				variant="soft"
				class="w-full"
				:block="collapsed"
			/>
		</template>
	</UDashboardSidebar>
</template>

<script lang="ts" setup>
	import { pages } from "~/constants/routes";

	const collapsed = ref(false);
	defineShortcuts({
		c: () => (collapsed.value = !collapsed.value)
	});

	const { user, logout } = useAuth();
</script>
