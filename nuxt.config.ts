import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
	compatibilityDate: "2025-05-15",
	devtools: { enabled: true },
	ssr: false,
	css: ["~/assets/css/main.css"],
	modules: ["@nuxt/ui", "@nuxtjs/supabase"],
	vite: {
		clearScreen: false,
		envPrefix: ["VITE_", "TAURI_"],
		server: { strictPort: true },
		plugins: [tailwindcss()]
	},
	ignore: ["**/src-tauri/**"],
	supabase: {
		redirect: true,
		useSsrCookies: false,
		redirectOptions: {
			login: "/login",
			callback: "/confirm"
		}
	},
	runtimeConfig: {
		public: {
			platform: ""
		}
	}
});
