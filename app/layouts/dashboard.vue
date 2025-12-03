<template>
	<UDashboardGroup>
		<Sidebar />
		<UDashboardPanel id="main">
			<template #header>
				<UDashboardNavbar :title="title">
					<template #leading>
						<UDashboardSidebarCollapse />
					</template>
				</UDashboardNavbar>
			</template>
			<template #body>
				<main class="flex h-full min-h-fit">
					<slot />
				</main>
			</template>
		</UDashboardPanel>
	</UDashboardGroup>
</template>

<script setup lang="ts">
	const route = useRoute();
	const title = route.meta.title as string;
</script>
