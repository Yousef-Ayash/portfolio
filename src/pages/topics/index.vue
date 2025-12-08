<script setup>
import { storeToRefs } from "pinia";
import { useBlogStore } from "@/stores/blogStore";
import { BookOpen, ArrowRight, Layers, FileText } from "lucide-vue-next";
import { useHead } from "@unhead/vue";

const blogStore = useBlogStore();
const { topics, loading } = storeToRefs(blogStore);

useHead({
	title: "Curated Series",
	meta: [
		{
			name: "description",
			content:
				"Browse all articles and notes organized by technical topic, category, and tag.",
		},
		{ property: "og:title", content: "Explore Topics & Categories" },
	],
});
</script>

<template>
	<div class="min-h-screen bg-light pb-20 pt-32 transition-colors duration-300 dark:bg-dark">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="mb-16 max-w-2xl">
				<div
					class="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent backdrop-blur-sm"
				>
					<BookOpen class="h-3 w-3" />
					<span>Curated Series</span>
				</div>
				<h1
					class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl"
				>
					Topics & <span class="text-accent">Series</span>
				</h1>
				<p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
					Grouped collections of projects, notes, and articles. Pick a path to explore.
				</p>
			</div>

			<div v-if="loading" class="py-20 text-center">
				<div
					class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent"
				></div>
			</div>

			<div v-else class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				<router-link
					v-for="(topic, id) in topics"
					:key="id"
					:to="`/topics/${id}`"
					class="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-accent/30"
				>
					<div
						class="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
					>
						<img
							v-if="topic.cover"
							:src="topic.cover"
							class="w-full h-full object-cover opacity-80"
						/>
						<div v-else class="absolute inset-0 opacity-10"></div>
					</div>

					<div class="flex flex-1 flex-col p-6">
						<h3
							class="text-xl font-bold text-gray-900 transition-colors group-hover:text-accent dark:text-white"
						>
							{{ topic.title }}
						</h3>

						<p
							class="mt-2 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-3"
						>
							{{ topic.description }}
						</p>

						<div
							class="mt-6 flex items-center gap-4 border-t border-gray-100 pt-4 text-xs dark:border-gray-800"
						>
							<div class="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
								<Layers class="h-4 w-4 text-primary" />
								<span class="font-semibold text-gray-900 dark:text-white">{{
									topic.projects.length
								}}</span>
								Projects
							</div>
							<div class="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
								<FileText class="h-4 w-4 text-accent" />
								<span class="font-semibold text-gray-900 dark:text-white">{{
									topic.posts.length
								}}</span>
								Posts
							</div>

							<ArrowRight
								class="ml-auto h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-accent"
							/>
						</div>
					</div>
				</router-link>
			</div>
		</div>
	</div>
</template>
