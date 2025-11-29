<template>
	<div><p class="text-black">hello</p></div>
</template>

<script lang="ts" setup>
	const platform = useRuntimeConfig().public.platform;
	if (platform !== "web") {
		navigateTo("/dashboard");
	}
</script>
