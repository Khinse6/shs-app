<template>
	<UModal v-model:open="open">
		<UButton
			icon="heroicons:plus"
			color="neutral"
			variant="subtle"
			class="w-fit"
		/>
		<template #body>
			<UTabs :items="tabs" variant="link" class="mx-auto w-fit">
				<template #new>
					<UForm
						:schema="newSchema"
						:state="newState"
						class="mx-auto flex w-fit flex-col items-center space-y-4"
						@submit="onCreateHouse"
					>
						<UFormField label="House name" name="name">
							<UInput v-model="newState.name" placeholder="Enter house name" />
						</UFormField>
						<UButton type="submit" label="Create" />
					</UForm>
				</template>
				<template #join>
					<UForm
						:schema="joinSchema"
						:state="joinState"
						class="mx-auto flex w-fit flex-col items-center space-y-4"
						@submit="onCreateRequest"
					>
						<UFormField label="House code" name="code">
							<UPinInput length="6" v-model="codeArray" />
						</UFormField>
						<UButton type="submit" label="Submit" />
					</UForm>
				</template>
			</UTabs>
		</template>
	</UModal>
</template>

<script setup lang="ts">
	import type { FormSubmitEvent, TabsItem } from '@nuxt/ui';
	const { createHouse, createRequest, error, loading } = useHouse();
	const open = ref(false);
	const success = ref(true);
	const joinState = reactive<Partial<JoinSchema>>({ code: undefined });
	const newState = reactive<Partial<NewSchema>>({ name: undefined });

	async function onCreateHouse(event: FormSubmitEvent<NewSchema>) {
		success.value = await createHouse(event.data.name);
		if (success.value && loading.value) {
			open.value = false;
		}
	}
	async function onCreateRequest(event: FormSubmitEvent<JoinSchema>) {
		success.value = await createRequest(event.data.code);
		if (success.value && loading.value) {
			open.value = false;
		}
	}

	const codeArray = computed({
		get: () => joinState.code?.split('') ?? [],
		set: (val: string[]) => {
			joinState.code = val.join('');
		},
	});

	const tabs: TabsItem[] = [
		{ label: 'New House', icon: 'heroicons:plus', slot: 'new' },
		{ label: 'Join House', icon: 'heroicons:users', slot: 'join' },
	];
</script>
