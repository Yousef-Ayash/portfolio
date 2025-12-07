<script setup>
import { computed } from "vue";
import ContentLayout from "./ContentLayout.vue";
import GenericCard from "@/components/content/GenericCard.vue";
import { Github, ExternalLink } from "lucide-vue-next";

const props = defineProps({
	frontmatter: { type: Object, default: () => ({}) },
});

const breadcrumbs = computed(() => [
	{ label: "Home", to: "/" },
	{ label: "Projects", to: "/projects" },
	{ label: props.frontmatter.title, to: null },
]);
</script>

<template>
	<ContentLayout :breadcrumbs="breadcrumbs">
		<template #mobile-header>
			<div class="grid grid-cols-2 gap-3">
				<a
					v-if="frontmatter.demoUrl"
					:href="frontmatter.demoUrl"
					target="_blank"
					class="flex flex-col gap-1 rounded-xl bg-primary/10 p-3 text-center transition-colors active:scale-95 dark:bg-primary/20"
					:class="{ 'col-span-2': !frontmatter.repoUrl }"
				>
					<div
						class="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary dark:text-primary-light"
					>
						<ExternalLink class="h-3 w-3" /> Live Demo
					</div>
				</a>

				<a
					v-if="frontmatter.repoUrl"
					:href="frontmatter.repoUrl"
					target="_blank"
					class="flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-3 text-center transition-colors active:scale-95 dark:border-gray-700 dark:bg-gray-800"
					:class="{ 'col-span-2': !frontmatter.demoUrl }"
				>
					<div
						class="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300"
					>
						<Github class="h-3 w-3" /> Source
					</div>
				</a>
			</div>
		</template>

		<template #header>
			<h1
				class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4"
			>
				{{ frontmatter.title }}
			</h1>
			<p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-8 leading-relaxed">
				{{ frontmatter.description }}
			</p>

			<div class="flex flex-col sm:flex-row gap-4 mb-8">
				<a
					v-if="frontmatter.demoUrl"
					:href="frontmatter.demoUrl"
					target="_blank"
					class="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:-translate-y-0.5"
				>
					Live Demo <ExternalLink class="h-4 w-4" />
				</a>
				<a
					v-if="frontmatter.repoUrl"
					:href="frontmatter.repoUrl"
					target="_blank"
					class="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-6 py-3 text-sm font-bold text-gray-900 transition-all hover:bg-gray-200 hover:-translate-y-0.5 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
				>
					<Github class="h-4 w-4" /> Source Code
				</a>
			</div>

			<div class="flex flex-wrap gap-2">
				<span
					v-for="tech in frontmatter.technologies"
					:key="tech"
					class="rounded-md border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-900"
				>
					{{ tech }}
				</span>
			</div>
		</template>

		<slot />

		<template #footer>
			<h2 class="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
				Project Logs & Articles
			</h2>
			<div v-if="frontmatter.posts?.length" class="grid gap-6 sm:grid-cols-2">
				<GenericCard v-for="post in frontmatter.posts" :key="post.slug" :post="post" />
			</div>
			<div
				v-else
				class="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-gray-700"
			>
				No articles written for this project yet.
			</div>
		</template>
	</ContentLayout>
</template>
