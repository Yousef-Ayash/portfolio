<script setup>
import { computed, shallowRef, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBlogStore } from "@/stores/blogStore";
import { Github, ExternalLink } from "lucide-vue-next";
import GenericCard from "@/components/content/GenericCard.vue";
import { useHead } from "@unhead/vue";
import ProjectLayout from "@/components/layouts/ProjectLayout.vue";

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
	<ProjectLayout
		v-if="projectData"
		:title="projectData.title"
		:frontmatter="{ ...projectData, type: 'project' }"
	>
		<template #header-meta>
			<div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
				<a
					v-if="projectData.demoUrl"
					:href="projectData.demoUrl"
					target="_blank"
					class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover"
				>
					Live Demo <ExternalLink class="h-4 w-4" />
				</a>
				<a
					v-if="projectData.repoUrl"
					:href="projectData.repoUrl"
					target="_blank"
					class="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white"
				>
					<Github class="h-4 w-4" /> Source
				</a>
			</div>
			<div class="w-full h-px bg-gray-200 dark:bg-gray-800 my-2 sm:hidden"></div>
			<div class="flex flex-wrap gap-2">
				<span
					v-for="tech in projectData.technologies"
					:key="tech"
					class="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:text-gray-400"
				>
					{{ tech }}
				</span>
			</div>
		</template>

		<template #sidebar>
			<div
				class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#161b22]"
			>
				<h3 class="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">About</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400">
					{{ projectData.description }}
				</p>
			</div>
		</template>

		<component :is="MarkdownContent" v-if="MarkdownContent" />

		<template #footer>
			<h2 class="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
				Project Logs & Articles
			</h2>
			<div v-if="projectData.posts?.length" class="grid gap-8 sm:grid-cols-2">
				<GenericCard v-for="post in projectData.posts" :key="post.slug" :post="post" />
			</div>
			<div v-else class="text-gray-500 italic">No logs written yet.</div>
		</template>
	</ProjectLayout>
</template>
