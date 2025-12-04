import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) return savedPosition;
		if (to.hash) return { el: to.hash, behavior: "smooth" };
		return { top: 0 };
	},
	routes: [
		{
			path: "/",
			name: "home",
			component: Home,
		},
		// Posts routes
		{
			path: "/posts",
			name: "posts-index",
			component: () => import("@/pages/posts/index.vue"),
			alias: ["/blog", "/journey"],
		},
		{
			path: "/blog/:slug",
			name: "blog-post",
			component: () => import("@/pages/posts/[slug].vue"),
			meta: { type: "blog" },
		},
		{
			path: "/notes/:slug",
			name: "note-post",
			component: () => import("@/pages/posts/[slug].vue"),
			meta: { type: "note" },
		},
		// Projects routes
		{
			path: "/projects",
			name: "projects",
			component: () => import("@/pages/projects/index.vue"),
		},
		{
			path: "/projects/:projectId",
			name: "project-detail",
			component: () => import("@/pages/projects/[projectId].vue"),
		},
		// Topics routes
		{
			path: "/topics",
			name: "topics",
			component: () => import("@/pages/topics/index.vue"),
		},
		{
			path: "/topics/:topicId",
			name: "topic-detail",
			component: () => import("@/pages/topics/[topicId].vue"),
		},
		{
			path: "/:pathMatch(.*)*",
			name: "not-found",
			component: () => import("@/pages/NotFound.vue"),
		},
	],
});

export default router;
