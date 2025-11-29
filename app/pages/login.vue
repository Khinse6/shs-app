<template>
	<div class="max-w-md w-full mx-auto pt-32 px-8 space-y-4">
		<p v-if="!loading && user">
			Logged in as {{ user.user_metadata?.fullName }}
		</p>
		<UTabs v-else :items="tabItems">
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
		<p v-if="error">{{ error }}}</p>
	</div>
</template>

<script setup lang="ts">
	import type { FormSubmitEvent } from "@nuxt/ui";
	const { login, signup, user, loading, error } = useAuth();

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
