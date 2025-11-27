<template>
	<UDashboardGroup>
		<Sidebar />
		<UDashboardPanel id="main">
			<template #header>
				<UDashboardNavbar title="Home">
					<template #left>
						<UDashboardSidebarCollapse />
						<UBreadcrumb :items="breadcrumbItems" />
					</template>
				</UDashboardNavbar>
			</template>
			<template #body>
				<slot />
			</template>
		</UDashboardPanel>
	</UDashboardGroup>
</template>

<script setup lang="ts">
	const route = useRoute();
	const breadcrumbItems = computed(() => generateBreadcrumb(route));
</script>
