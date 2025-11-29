<template>
	<div></div>
</template>

<script lang="ts" setup generic="T extends ZodType">
	import type { FormSubmitEvent } from "@nuxt/ui";
	import type { ZodType } from "zod";

	defineProps<{
		schema: T;
		onSubmit: (event: FormSubmitEvent<T>) => Promise<void> | void;
	}>();
</script>
