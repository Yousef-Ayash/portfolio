<script setup>
import { computed, shallowRef, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBlogStore } from "@/stores/blogStore";
import { BookOpen, ArrowLeft, Layers, FileText } from "lucide-vue-next";
import GenericCard from "@/components/content/GenericCard.vue";
import { useHead } from "@unhead/vue";

const route = useRoute();
const router = useRouter();
const blogStore = useBlogStore();

const topicId = computed(() => route.params.topicId);
const topicData = computed(() => blogStore.topics[topicId.value]);

const MarkdownContent = shallowRef(null);

watchEffect(async () => {
	if (Object.keys(blogStore.topics).length === 0) {
		await blogStore.loadPosts();
	}

	if (!topicData.value && !blogStore.loading) {
		router.replace("/404");
		return;
	}

	if (topicId.value) {
		try {
			const module = await import(`../../markdown/topics/${topicId.value}.md`);
			MarkdownContent.value = module.default;
		} catch (e) {
			console.error("Topic Markdown not found", e);
		}
	}
});

useHead({
	title: computed(() => topicData.value?.title || "Topic Series"),
	meta: [
		{
			name: "description",
			content: computed(
				() => topicData.value?.description || "Browse articles in this series.",
			),
		},
		{
			property: "og:title",
			content: computed(() => topicData.value?.title),
		},
		{
			property: "og:description",
			content: computed(() => topicData.value?.description),
		},
	],
});
</script>

<template>
	<div
		v-if="topicData"
		class="min-h-screen bg-light pb-20 pt-32 transition-colors duration-300 dark:bg-dark"
	>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<router-link
				to="/topics"
				class="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-accent dark:text-gray-400"
			>
				<ArrowLeft class="h-4 w-4" /> Back to Topics
			</router-link>

			<div class="mb-12">
				<div
					class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent"
				>
					<BookOpen class="h-6 w-6" />
				</div>
				<h1 class="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
					{{ topicData.title }}
				</h1>
				<p class="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
					{{ topicData.description }}
				</p>
			</div>

			<article v-if="MarkdownContent" class="prose-tech max-w-none mb-16">
				<component :is="MarkdownContent" />
			</article>

			<div v-if="topicData.projects.length > 0" class="mb-20">
				<h2
					class="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white mb-8"
				>
					<Layers class="h-6 w-6 text-primary" />
					Projects in this Series
				</h2>

				<div class="grid gap-6 md:grid-cols-2">
					<router-link
						v-for="project in topicData.projects"
						:key="project.slug"
						:to="`/projects/${project.slug}`"
						class="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-primary/50 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
					>
						<h3
							class="text-xl font-bold text-gray-900 group-hover:text-primary dark:text-white"
						>
							{{ project.title }}
						</h3>
						<p class="mt-2 flex-1 text-sm text-gray-600 dark:text-gray-400">
							{{ project.description }}
						</p>
						<div class="mt-4 text-sm font-medium text-primary">View Project &rarr;</div>
					</router-link>
				</div>
			</div>

			<div v-if="topicData.posts.length > 0">
				<h2
					class="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white mb-8"
				>
					<FileText class="h-6 w-6 text-accent" />
					Notes & Articles
				</h2>

				<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					<GenericCard v-for="post in topicData.posts" :key="post.slug" :post="post" />
				</div>
			</div>

			<div
				v-if="topicData.projects.length === 0 && topicData.posts.length === 0"
				class="text-center py-12 text-gray-500"
			>
				This topic is currently empty. Check back soon!
			</div>
		</div>
	</div>
</template>
