<template>
	<div
		class="w-full h-screen m-0 pt-[10vh] flex flex-col justify-center items-center text-center font-sans text-[#0f0f0f] dark:text-[#f6f6f6]"
	>
		<h1 class="text-center text-2xl font-semibold mb-6">
			Welcome to Tauri + Vue
		</h1>

		<div class="flex justify-center mb-6">
			<a
				v-for="item in items"
				:key="item.title"
				:href="item.link"
				target="_blank"
				class="font-medium text-[#646cff] no-underline hover:text-[#535bf2] transition-colors duration-200"
			>
				<img
					:src="item.logo"
					class="h-[6em] p-[1.5em] transition-all duration-750 will-change-transform"
					:class="item.hover"
					:alt="item.alt"
				/>
			</a>
		</div>
		<p class="mb-6">Click on the Tauri, Vite, and Vue logos to learn more.</p>
		<form
			class="flex justify-center items-center gap-2 mb-4"
			@submit.prevent="greet"
		>
			<input
				id="greet-input"
				v-model="name"
				autocomplete="off"
				placeholder="Enter a name..c."
				class="rounded-md border border-transparent px-4 py-2 text-base font-medium text-[#0f0f0f] bg-white shadow-md outline-none transition-colors duration-200 dark:text-white dark:bg-[#0f0f0f98]"
			/>
			<button
				type="submit"
				class="rounded-md border border-transparent px-4 py-2 text-base font-medium text-[#0f0f0f] bg-white shadow-md cursor-pointer transition-colors duration-200 hover:border-[#396cd8] active:border-[#396cd8] active:bg-[#e8e8e8] dark:text-white dark:bg-[#0f0f0f98] dark:active:bg-[#0f0f0f69]"
			>
				Greet
			</button>
		</form>

		<p>{{ greetMsg }}</p>
		<p v-if="user" class="my-4">{{ user.user_metadata?.fullName }}</p>
		<p v-if="user" class="my-4">{{ user }}</p>
		<UButton label="Logout" @click="logout" />
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		title: "Home",
		layout: "dashboard"
	});

	const { logout, user } = useAuth();
	console.log("User in index.vue:", user);
	import { invoke } from "@tauri-apps/api/core";

	const greetMsg = ref("");
	const name = ref("");

	async function greet() {
		greetMsg.value = await invoke("greet", { name: name.value });
	}

	const items = [
		{
			link: "https://vite.dev",
			logo: "/vite.svg",
			title: "Vite",
			alt: "Vite Logo",
			hover: "hover:drop-shadow-[0_0_2em_#747bff]"
		},
		{
			link: "https://tauri.app",
			logo: "/tauri.svg",
			title: "Tauri",
			alt: "Tauri Logo",
			hover: "hover:drop-shadow-[0_0_2em_#24c8db]"
		},
		{
			link: "https://vuejs.org/",
			logo: "/vue.svg",
			title: "Vue",
			alt: "Vue Logo",
			hover: "hover:drop-shadow-[0_0_2em_#249b73]"
		}
	];
</script>
