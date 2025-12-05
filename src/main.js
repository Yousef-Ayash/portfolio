import { ViteSSG } from "vite-ssg";
import { createPinia } from "pinia";
import App from "./App.vue";
import { routes } from "./router";
import "./styles/main.css";
import CodeBlock from "./components/content/CodeBlock.vue";
import { useBlogStore } from "@/stores/blogStore";

// Replace createApp with ViteSSG
export const createApp = ViteSSG(
	App,
	{
		routes,
		base: import.meta.env.BASE_URL,
		scrollBehavior(to, from, savedPosition) {
			if (savedPosition) return savedPosition;
			if (to.hash) return { el: to.hash, behavior: "smooth" };
			return { top: 0 };
		},
	},
	({ app, router, routes, isClient, initialState }) => {
		const pinia = createPinia();
		app.use(pinia);
		app.component("CodeBlock", CodeBlock);

		// Load posts BEFORE app renders content during build process

		// We use 'router.isReady' to ensure we are in the routing lifecycle
		if (import.meta.env.SSR) {
			// During Build: Load data and save it to initialState
			const blogStore = useBlogStore(pinia);

			return blogStore.loadPosts().then(() => {
				initialState.pinia = pinia.state.value;
			});
		} else {
			// On Client: If we have initial state from server, use it
			if (initialState.pinia) {
				pinia.state.value = initialState.pinia;
			} else {
				// Fallback for SPA navigation
				const blogStore = useBlogStore(pinia);
				blogStore.loadPosts();
			}
		}
	},
);
