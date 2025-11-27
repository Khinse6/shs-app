<template>
	<UDashboardSidebar v-model:collapsed="collapsed" collapsible>
		<template #header>
			<h2 v-if="!collapsed">{{ user?.user_metadata?.fullName }}</h2>
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
	</UDashboardSidebar>
</template>

<script lang="ts" setup>
	import { pages } from "~/constants/routes";

	const collapsed = ref(false);
	defineShortcuts({
		c: () => (collapsed.value = !collapsed.value)
	});

	const { user } = useAuth();
</script>
