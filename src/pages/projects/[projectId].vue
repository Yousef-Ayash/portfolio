<script setup>
import { computed, shallowRef, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBlogStore } from "@/stores/blogStore";
import { Layers, ArrowLeft, Github, ExternalLink } from "lucide-vue-next";
import GenericCard from "@/components/content/GenericCard.vue";
import { useHead } from "@unhead/vue";

const route = useRoute();
const router = useRouter();
const blogStore = useBlogStore();

const projectId = computed(() => route.params.projectId);
const projectData = computed(() => blogStore.projects[projectId.value]);

const MarkdownContent = shallowRef(null);

watchEffect(async () => {
	if (Object.keys(blogStore.projects).length === 0) {
		await blogStore.loadPosts();
	}

	if (!projectData.value && !blogStore.loading) {
		router.replace("/404");
		return;
	}

	if (projectId.value) {
		try {
			const module = await import(`../../markdown/projects/${projectId.value}.md`);
			MarkdownContent.value = module.default;
		} catch (e) {
			console.error("Project Markdown file not found:", e);
		}
	}
});

useHead({
	title: computed(() => projectData.value?.title || "Project Showcase"),
	meta: [
		{
			name: "description",
			content: computed(
				() => projectData.value?.description || "Technical deep dive into this project.",
			),
		},
		{
			property: "og:title",
			content: computed(() => projectData.value?.title),
		},
		{
			property: "og:description",
			content: computed(() => projectData.value?.description),
		},
	],
});
</script>

<template>
	<div
		v-if="projectData"
		class="min-h-screen bg-light pb-20 pt-32 transition-colors duration-300 dark:bg-dark"
	>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<router-link
				to="/projects"
				class="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary dark:text-gray-400"
			>
				<ArrowLeft class="h-4 w-4" /> Back to Projects
			</router-link>

			<div class="mb-12 rounded-3xl bg-white p-8 shadow-lg dark:bg-gray-900/50 sm:p-12">
				<div
					class="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-0"
				>
					<div>
						<div
							class="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary"
						>
							<Layers class="h-7 w-7" />
						</div>
						<h1
							class="mb-4 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl"
						>
							{{ projectData.title }}
						</h1>
						<p class="max-w-2xl text-lg text-gray-600 dark:text-gray-300">
							{{ projectData.description }}
						</p>
					</div>

					<div class="flex flex-col sm:flex-row gap-3">
						<a
							v-if="projectData.demoUrl"
							:href="projectData.demoUrl"
							target="_blank"
							class="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:-translate-y-1"
						>
							Live Demo <ExternalLink class="h-4 w-4" />
						</a>
						<a
							v-if="projectData.repoUrl"
							:href="projectData.repoUrl"
							target="_blank"
							class="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-6 py-3 text-sm font-bold text-gray-900 transition-all hover:bg-gray-200 hover:-translate-y-1 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
						>
							<Github class="h-4 w-4" /> Source Code
						</a>
					</div>
				</div>

				<div v-if="projectData.technologies" class="mt-8 flex flex-wrap gap-2">
					<span
						v-for="tech in projectData.technologies"
						:key="tech"
						class="rounded-md border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:text-gray-400"
					>
						{{ tech }}
					</span>
				</div>
			</div>

			<article v-if="MarkdownContent" class="prose-tech max-w-none mb-20">
				<component :is="MarkdownContent" />
			</article>

			<div class="border-t border-gray-200 pt-12 dark:border-gray-800">
				<h2 class="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
					Project Logs & Articles
				</h2>

				<div
					v-if="projectData.posts && projectData.posts.length > 0"
					class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
				>
					<GenericCard v-for="post in projectData.posts" :key="post.slug" :post="post" />
				</div>
				<div v-else class="text-gray-500 italic">
					No logs or articles written for this project yet.
				</div>
			</div>
		</div>
	</div>
</template>
