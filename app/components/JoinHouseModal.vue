<template>
	<UModal title="Join a house" :close="{ onClick: () => emit('close', false) }">
		<template #body>
			<UForm
				:schema="joinSchema"
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
				<p v-if="error">{{ error }}</p>
				<UButton type="submit" label="Join House" />
			</UForm>
		</template>
	</UModal>
</template>

<script setup lang="ts">
	import type { FormSubmitEvent } from '@nuxt/ui';
	const toast = useToast();
	const emit = defineEmits<{ close: [boolean] }>();
	const state = reactive<Partial<JoinSchema>>({
		name: undefined,
		code: undefined,
	});

	const error = ref();
	async function onSubmit(event: FormSubmitEvent<JoinSchema>) {
		const { error: err } = await useHouseRequests().createHouseRequest(
			event.data.name,
			event.data.code
		);
		console.log(error);
		error.value = err;
		if (!err) {
			toast.add({
				title: 'Request sent',
				color: 'success',
			});
			emit('close', true);
		}
	}
</script>
