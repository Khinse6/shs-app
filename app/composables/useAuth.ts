export function useAuth() {
	const client = useSupabaseClient();
	const user = useSupabaseUser();

	const loading = ref(false);
	const error = ref<string | null>(null);

	async function login(data: LogInSchema) {
		loading.value = true;
		error.value = null;

		const { email, password } = data;

		const { error: signInError } = await client.auth.signInWithPassword({
			email,
			password
		});

		loading.value = false;

		if (signInError) {
			console.log(signInError);
			error.value = signInError.message;
			throw signInError;
		}
		return navigateTo("/dashboard");
	}

	async function signup(data: CreateAccountSchema) {
		loading.value = true;
		error.value = null;

		const { fullName, email, password } = data;

		const { error: signUpError } = await client.auth.signUp({
			email,
			password,
			options: {
				data: {
					fullName
				}
			}
		});

		loading.value = false;

		if (signUpError) {
			console.log(signUpError);
			error.value = signUpError.message;
			throw signUpError;
		}
		navigateTo("/dashboard");
	}

	async function logout() {
		loading.value = true;
		error.value = null;

		const { error: logoutError } = await client.auth.signOut();

		navigateTo("/login");

		loading.value = false;

		if (logoutError) {
			error.value = logoutError.message;
			throw logoutError;
		}
	}

	return {
		user,
		loading,
		error,
		login,
		signup,
		logout
	};
}
