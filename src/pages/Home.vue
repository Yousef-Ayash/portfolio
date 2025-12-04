<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useBlogStore } from "@/stores/blogStore";
import { useHead } from "@unhead/vue";
import GenericCard from "@/components/content/GenericCard.vue";

useHead({
	titleTemplate: null,
	title: "Yousef Ayash | Software Engineer & Creative Developer",
	meta: [
		{
			name: "description",
			content:
				"Portfolio of Yousef Ayash. Specializing in Vue.js, SQL, and backend architecture. Documenting the journey of learning through building.",
		},
		{
			property: "og:title",
			content: "Yousef Ayash | Software Engineer & Creative Developer",
		},
		{
			property: "og:description",
			content:
				"Portfolio of Yousef Ayash. Specializing in Vue.js, SQL, and backend architecture.",
		},
	],
});

const blogStore = useBlogStore();
const { posts } = storeToRefs(blogStore);

// Get the 3 most recent posts
const recentPosts = computed(() => posts.value.slice(0, 3));
</script>

<template>
	<div class="min-h-screen bg-light transition-colors duration-300 dark:bg-dark">
		<section class="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
			<div
				class="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-[100px] dark:bg-primary/10"
			></div>
			<div
				class="absolute top-1/2 right-0 h-96 w-96 -translate-y-1/2 rounded-full bg-accent/20 blur-[100px] dark:bg-accent/10"
			></div>

			<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="lg:items-center">
					<div class="max-w-4xl">
						<div
							v-if="false"
							class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm dark:border-primary/30 dark:bg-primary/10 dark:text-primary-light"
						>
							<span class="relative flex h-2 w-2">
								<span
									class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"
								></span>
								<span
									class="relative inline-flex h-2 w-2 rounded-full bg-accent"
								></span>
							</span>
							Available for hire
						</div>

						<h1
							class="mt-6 text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl"
						>
							Learning Through <br />
							<span
								class="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
							>
								Building.
							</span>
						</h1>

						<p
							class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 flex flex-col gap-5"
						>
							<span>
								I'm Yousef, a 23-year-old developer living in Rif Dimashq. Databases
								are my comfort zone — especially SQL Server and MySQL — and I enjoy
								pairing them with Vue.js on the frontend and Laravel when needed.
							</span>
							<span>
								I've spent the past couple of years at Hifz Al-Nema charity,
								finishing an incomplete internal system and migrating data from
								their old one. What started as a barely-functional tool with 2 users
								now serves 40+ employees across the organization.
							</span>
							<span>
								These days I'm learning more about networking, servers, and
								infrastructure — and documenting the journey along the way.
							</span>
						</p>

						<div class="mt-10 flex items-center gap-x-6">
							<router-link
								to="/projects"
								class="rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-primary/30 transition-all hover:bg-primary-hover hover:shadow-primary/50 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
							>
								View Work
							</router-link>
							<router-link
								to="/posts"
								class="group text-sm font-semibold leading-6 text-gray-900 dark:text-white"
							>
								Read the Blog
								<span
									aria-hidden="true"
									class="inline-block transition-transform group-hover:translate-x-1"
									>→</span
								>
							</router-link>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section class="py-20">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="flex items-end justify-between mb-10">
					<div>
						<h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
							Latest Writing
						</h2>
						<p class="mt-2 text-gray-600 dark:text-gray-400">
							Thoughts on development, design, and tools.
						</p>
					</div>
					<router-link
						to="/posts"
						class="hidden text-sm font-semibold text-primary hover:text-primary-hover md:block"
					>
						View all posts
					</router-link>
				</div>

				<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					<GenericCard v-for="post in recentPosts" :key="post.slug" :post="post" />
				</div>

				<div class="mt-10 text-center md:hidden">
					<router-link
						to="/blog"
						class="text-sm font-semibold text-primary hover:text-primary-hover"
					>
						View all posts →
					</router-link>
				</div>
			</div>
		</section>
	</div>
</template>
