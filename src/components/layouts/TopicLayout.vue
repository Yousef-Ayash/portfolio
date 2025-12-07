<script setup>
import { computed } from "vue";
import ContentLayout from "./ContentLayout.vue";
import GenericCard from "@/components/content/GenericCard.vue";
import { Layers, FileText } from "lucide-vue-next";

const props = defineProps({
	frontmatter: { type: Object, default: () => ({}) },
});

const breadcrumbs = computed(() => [
	{ label: "Home", to: "/" },
	{ label: "Topics", to: "/topics" },
	{ label: props.frontmatter.title, to: null },
]);
</script>

<template>
	<ContentLayout :breadcrumbs="breadcrumbs">
		<template #header>
			<h1
				class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4"
			>
				{{ frontmatter.title }}
			</h1>
			<p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
				{{ frontmatter.description }}
			</p>
		</template>

		<slot />

		<template #footer>
			<div class="space-y-16">
				<div v-if="frontmatter.projects?.length">
					<h2
						class="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white mb-8"
					>
						<Layers class="h-6 w-6 text-primary" />
						Projects in this Series
					</h2>
					<div class="grid gap-6 md:grid-cols-2">
						<router-link
							v-for="project in frontmatter.projects"
							:key="project.slug"
							:to="`/projects/${project.slug}`"
							class="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-primary/50 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
						>
							<h3
								class="text-xl font-bold text-gray-900 group-hover:text-primary dark:text-white"
							>
								{{ project.title }}
							</h3>
							<p class="mt-2 text-sm text-gray-500 line-clamp-2">
								{{ project.description }}
							</p>
							<div class="mt-4 text-sm font-medium text-primary">
								View Project &rarr;
							</div>
						</router-link>
					</div>
				</div>

				<div v-if="frontmatter.posts?.length">
					<h2
						class="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white mb-8"
					>
						<FileText class="h-6 w-6 text-accent" />
						Notes & Articles
					</h2>
					<div class="grid gap-6 sm:grid-cols-2">
						<GenericCard
							v-for="post in frontmatter.posts"
							:key="post.slug"
							:post="post"
						/>
					</div>
				</div>
			</div>
		</template>
	</ContentLayout>
</template>
