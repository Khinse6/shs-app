<template>
	<div>
		{{ route.params.slug }}
	</div>
</template>

<script setup lang="ts">
	const route = useRoute();
	definePageMeta({
		layout: "dashboard"
	});
</script>
