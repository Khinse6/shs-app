<template>
	<div class="max-w-md w-full mx-auto pt-32 px-8 space-y-4">
		<UTabs :items="tabItems">
			<template #signin>
				<UAuthForm
					:schema="logInSchema"
					:fields="signInFields"
					submit-button="Sign In"
					@submit="onLogIn"
				/>
			</template>
			<template #signup>
				<UAuthForm
					:schema="createAccountSchema"
					:fields="signUpFields"
					submit-button="Create Account"
					@submit="onCreateAccount"
				/>
			</template>
		</UTabs>
		<div class="flex justify-center py-2">
			<p v-if="loading" class="text-sm">{{ loading }}</p>
			<p v-else-if="error" class="text-red-600">{{ error }}</p>
			<p v-else-if="user" class="text-sm">{{ user }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { FormSubmitEvent } from "@nuxt/ui";
	const { login, signup, loading, error, user } = useAuth();

	definePageMeta({
		title: "Login",
		layout: "login"
	});

	const tabItems = [
		{ label: "Sign In", slot: "signin" },
		{ label: "Sign Up", slot: "signup" }
	];

	watchEffect(() => {
		if (user.value) {
			navigateTo("/dashboard");
		}
	});
	async function onLogIn(payload: FormSubmitEvent<LogInSchema>) {
		try {
			await login(payload.data);
		} catch (err) {
			console.error(err);
		}
	}

	async function onCreateAccount(
		payload: FormSubmitEvent<CreateAccountSchema>
	) {
		try {
			await signup(payload.data);
		} catch (err) {
			console.error(err);
		}
	}
</script>
