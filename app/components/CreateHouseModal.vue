<template>
	<UModal
		title="Create a new house"
		:close="{ onClick: () => emit('close', false) }"
	>
		<template #body>
			<UForm
				:schema="newSchema"
				:state="state"
				class="mx-auto flex w-fit flex-col items-center space-y-4"
				@submit="onSubmit"
			>
				<UFormField
					v-for="(_value, key) in state"
					:key="key"
					:label="key?.charAt(0).toUpperCase() + key.slice(1)"
					:name="key"
				>
					<UInput v-model="state[key]" />
				</UFormField>
				<UButton type="submit" label="Create House" />
			</UForm>
		</template>
	</UModal>
</template>

<script setup lang="ts">
	import type { FormSubmitEvent } from '@nuxt/ui';
	const toast = useToast();
	const emit = defineEmits<{ close: [boolean] }>();
	const state = reactive<Partial<NewSchema>>({
		name: undefined,
	});

	async function onSubmit(event: FormSubmitEvent<NewSchema>) {
		await useHouse().createHouse(event.data.name);
		toast.add({
			title: 'New House',
			description: `New house, ${event.data.name}, was created.`,
			color: 'success',
		});
		emit('close', true);
	}
</script>
