<script setup>
import { storeToRefs } from "pinia";
import { useBlogStore } from "@/stores/blogStore";
import { FolderGit2, ArrowRight, Layers } from "lucide-vue-next";
import { useHead } from "@unhead/vue";

const blogStore = useBlogStore();
const { projects, loading } = storeToRefs(blogStore);

useHead({
	title: "Engineering Showcase",
	meta: [
		{
			name: "description",
			content:
				"Explore featured projects, detailed case studies on design, architecture, and technology stacks.",
		},
		{ property: "og:title", content: "Portfolio Projects & Case Studies" },
		{ property: "og:description", content: "Explore featured projects and case studies." },
	],
});
</script>

<template>
	<div class="min-h-screen bg-light pb-20 pt-32 transition-colors duration-300 dark:bg-dark">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="mb-16 max-w-2xl">
				<div
					class="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm dark:text-primary-light"
				>
					<FolderGit2 class="h-3 w-3" />
					<span>Engineering Showcase</span>
				</div>
				<h1
					class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl"
				>
					Selected <span class="text-primary">Projects</span>
				</h1>
				<p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
					A collection of applications, tools, and experiments I've built. Click on a
					project to see the technical deep-dives.
				</p>
			</div>

			<div v-if="loading" class="py-20 text-center">
				<div
					class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"
				></div>
			</div>

			<div v-else class="grid gap-8 lg:grid-cols-2">
				<router-link
					v-for="(project, id) in projects"
					:key="id"
					:to="`/projects/${id}`"
					class="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-primary/30"
				>
					<div
						class="relative h-32 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900/50"
					>
						<div
							class="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"
						></div>
						<div class="absolute bottom-0 left-0 p-6">
							<div
								class="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-700"
							>
								<Layers class="h-6 w-6 text-primary" />
							</div>
						</div>
					</div>

					<div class="flex flex-1 flex-col p-8 pt-4">
						<div class="flex items-start justify-between">
							<h3
								class="text-2xl font-bold text-gray-900 transition-colors group-hover:text-primary dark:text-white"
							>
								{{ project.title }}
							</h3>
							<ArrowRight
								class="h-5 w-5 -rotate-45 text-gray-400 transition-transform group-hover:rotate-0 group-hover:text-primary"
							/>
						</div>

						<p
							class="mt-4 flex-1 text-base leading-relaxed text-gray-600 dark:text-gray-300"
						>
							{{ project.description }}
						</p>

						<div
							class="mt-8 flex items-center gap-4 border-t border-gray-100 pt-6 text-sm dark:border-gray-800"
						>
							<span
								class="flex items-center gap-1.5 text-gray-500 dark:text-gray-400"
							>
								<span class="font-semibold text-gray-900 dark:text-white">{{
									project.posts.length
								}}</span>
								articles
							</span>
							<span class="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
						</div>
					</div>
				</router-link>
			</div>
		</div>
	</div>
</template>
