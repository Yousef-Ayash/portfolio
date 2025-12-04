<script setup>
import { computed, shallowRef, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import BlogLayout from "@/components/layouts/BlogLayout.vue";
import { useBlogStore } from "@/stores/blogStore";
import { useHead } from "@unhead/vue";

const route = useRoute();
const router = useRouter();
const blogStore = useBlogStore();

const isNote = computed(() => route.path.startsWith("/notes"));
const folder = computed(() => (isNote.value ? "notes" : "blog"));
const slug = computed(() => route.params.slug);

const postMeta = computed(() => {
	return blogStore.getPost(slug.value, isNote.value ? "note" : "blog");
});

const MarkdownContent = shallowRef(null);

watchEffect(async () => {
	if (blogStore.posts.length === 0) {
		await blogStore.loadPosts();
	}

	try {
		const module = await import(`../../markdown/${folder.value}/${slug.value}.md`);
		MarkdownContent.value = module.default;
	} catch (e) {
		console.error(e);
		router.replace("/404");
	}
});

useHead({
	title: computed(() => postMeta.value?.title || "Article"),
	meta: [
		{
			name: "description",
			content: computed(() => postMeta.value?.description || "Reading technical article..."),
		},
		{
			property: "og:title",
			content: computed(() => postMeta.value?.title),
		},
		{
			property: "og:description",
			content: computed(() => postMeta.value?.description),
		},
		{
			property: "og:type",
			content: "article",
		},
		{
			name: "author",
			content: "Yousef Ayash",
		},
		{
			property: "article:published_time",
			content: computed(() => postMeta.value?.date),
		},
	],
});
</script>

<template>
	<BlogLayout v-if="postMeta && MarkdownContent" :frontmatter="postMeta">
		<div
			v-if="isNote"
			class="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-900/30 dark:bg-yellow-900/10 dark:text-yellow-200"
		>
			🌱 <strong>Digital Garden Note:</strong> This is a raw learning log. It may be updated
			frequently.
		</div>

		<component :is="MarkdownContent" />
	</BlogLayout>
</template>
