import tailwindcss from '@tailwindcss/vite';

const isWeb = process.env.NUXT_PUBLIC_PLATFORM === 'web';

export default defineNuxtConfig({
	compatibilityDate: '2025-05-15',
	devtools: {
		enabled: true,
		timeline: {
			enabled: true,
		},
	},
	experimental: {
		payloadExtraction: true,
	},
	ssr: false,
	css: ['~/assets/css/main.css'],
	modules: ['@nuxt/ui', '@nuxtjs/supabase', '@nuxt/hints'],
	vite: {
		clearScreen: false,
		envPrefix: ['VITE_', 'TAURI_'],
		server: { strictPort: true },
		plugins: [tailwindcss()],
	},
	ignore: ['**/src-tauri/**'],
	supabase: {
		redirect: true,
		useSsrCookies: false,
		redirectOptions: {
			login: isWeb ? '/dashboard/login' : '/login',
			callback: isWeb ? '/dashboard/login' : '/login',
			include: isWeb ? ['/dashboard(/*)?'] : ['/'],
		},
	},
	runtimeConfig: {
		public: {
			platform: '',
		},
	},
	dir: {
		pages: isWeb ? 'pages' : 'pages/dashboard',
	},
	hooks: {
		'pages:extend'(pages) {
			if (isWeb) return;

			pages.forEach((page) => {
				const originalPath = page.path === '/' ? '' : page.path;
				page.alias = ['/dashboard' + originalPath];
			});
		},
	},
});
