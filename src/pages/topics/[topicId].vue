<script setup>
import { computed, shallowRef, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBlogStore } from "@/stores/blogStore";
import { BookOpen, Layers, FileText } from "lucide-vue-next";
import GenericCard from "@/components/content/GenericCard.vue";
import { useHead } from "@unhead/vue";
import TopicLayout from "@/components/layouts/TopicLayout.vue";

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
	<TopicLayout
		v-if="topicData"
		:title="topicData.title"
		:frontmatter="{ ...topicData, type: 'topic' }"
	>
		<template #header-meta>
			<div class="flex items-center gap-2 text-accent font-medium">
				<BookOpen class="h-5 w-5" />
				<span>Curated Series</span>
			</div>
			<p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
				{{ topicData.description }}
			</p>
		</template>

		<component :is="MarkdownContent" v-if="MarkdownContent" />

		<template #footer>
			<div v-if="topicData.projects.length > 0" class="mb-16">
				<h2
					class="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white mb-6"
				>
					<Layers class="h-6 w-6 text-primary" /> Projects
				</h2>
				<div class="grid gap-6 md:grid-cols-2">
					<router-link
						v-for="project in topicData.projects"
						:key="project.slug"
						:to="`/projects/${project.slug}`"
						class="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 hover:border-primary/50 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 transition-all"
					>
						<h3 class="text-xl font-bold group-hover:text-primary dark:text-white">
							{{ project.title }}
						</h3>
						<p class="mt-2 text-sm text-gray-500 line-clamp-2">
							{{ project.description }}
						</p>
					</router-link>
				</div>
			</div>

			<div v-if="topicData.posts.length > 0">
				<h2
					class="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white mb-6"
				>
					<FileText class="h-6 w-6 text-accent" /> Notes & Articles
				</h2>
				<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					<GenericCard v-for="post in topicData.posts" :key="post.slug" :post="post" />
				</div>
			</div>
		</template>
	</TopicLayout>
</template>
