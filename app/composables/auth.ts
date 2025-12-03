export const useAuth = () => {
	const client = useSupabaseClient();
	function signIn(email: string, password: string) {
		return client.auth.signInWithPassword({ email, password });
	}
	function signUp(email: string, password: string, full_name: string) {
		return client.auth.signUp({
			email,
			password,
			options: { data: { full_name } },
		});
	}
	function signOut() {
		return client.auth.signOut();
	}
	return { signIn, signUp, signOut };
};
