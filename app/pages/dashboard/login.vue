<template>
	<div class="mx-auto w-full max-w-md space-y-4 px-8 pt-32">
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
					@submit="onSignUp"
				/>
			</template>
		</UTabs>
	</div>
</template>

<script setup lang="ts">
	import type { FormSubmitEvent } from '@nuxt/ui';
	definePageMeta({ title: 'Login', layout: 'login' });
	const { signIn, signUp } = useAuth();

	const tabItems = [
		{ label: 'Sign In', slot: 'signin' },
		{ label: 'Sign Up', slot: 'signup' },
	];

	async function onLogIn(payload: FormSubmitEvent<LogInSchema>) {
		const { email, password } = payload.data;
		const { error: signInError } = await signIn(email, password);
		if (!signInError) navigateTo('/dashboard');
	}

	async function onSignUp(payload: FormSubmitEvent<CreateAccountSchema>) {
		const { email, password, fullName } = payload.data;
		const { error: signUpError } = await signUp(email, password, fullName);
		if (!signUpError) navigateTo('/dashboard');
	}
</script>
