<script setup>
import { computed } from "vue";
import ContentLayout from "./ContentLayout.vue";
import { Calendar, Clock, Tag, BookOpen, Layers, StickyNote, FileText } from "lucide-vue-next";

const props = defineProps({
	frontmatter: { type: Object, default: () => ({}) },
});

const breadcrumbs = computed(() => {
	// Path: Home > Digital Garden > Topic? > Title
	const crumbs = [
		{ label: "Home", to: "/" },
		{ label: "Digital Garden", to: "/posts" },
	];
	if (props.frontmatter.topicData) {
		crumbs.push({
			label: props.frontmatter.topicData.title,
			to: `/topics/${props.frontmatter.topicData.slug}`,
		});
	}
	crumbs.push({ label: props.frontmatter.title, to: null });
	return crumbs;
});
</script>

<template>
	<ContentLayout :breadcrumbs="breadcrumbs">
		<template #mobile-header>
			<div
				v-if="frontmatter.topicData || frontmatter.projectData"
				class="grid grid-cols-2 gap-3"
			>
				<router-link
					v-if="frontmatter.topicData"
					:to="`/topics/${frontmatter.topicData.slug}`"
					class="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50 p-3 transition-colors active:scale-95 dark:border-gray-800 dark:bg-gray-800/50"
					:class="{ 'col-span-2': !frontmatter.projectData }"
				>
					<div
						class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400"
					>
						<BookOpen class="h-3 w-3" /> Series
					</div>
					<div class="truncate text-sm font-semibold text-gray-900 dark:text-gray-200">
						{{ frontmatter.topicData.title }}
					</div>
				</router-link>

				<router-link
					v-if="frontmatter.projectData"
					:to="`/projects/${frontmatter.projectData.slug}`"
					class="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50 p-3 transition-colors active:scale-95 dark:border-gray-800 dark:bg-gray-800/50"
					:class="{ 'col-span-2': !frontmatter.topicData }"
				>
					<div
						class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400"
					>
						<Layers class="h-3 w-3" /> Project
					</div>
					<div class="truncate text-sm font-semibold text-gray-900 dark:text-gray-200">
						{{ frontmatter.projectData.title }}
					</div>
				</router-link>
			</div>
		</template>

		<template #header>
			<h1
				class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-6"
			>
				{{ frontmatter.title }}
			</h1>
			<div
				class="flex flex-wrap items-center gap-x-6 gap-y-4 text-sm text-gray-500 dark:text-gray-400"
			>
				<div class="flex items-center gap-2">
					<Calendar class="h-4 w-4 text-accent" />
					<time>{{ frontmatter.date }}</time>
				</div>
				<div v-if="frontmatter.readTime" class="flex items-center gap-2">
					<Clock class="h-4 w-4 text-accent" />
					<span>{{ frontmatter.readTime }} min read</span>
				</div>
				<router-link
					v-if="frontmatter.topicData"
					:to="`/topics/${frontmatter.topicData.slug}`"
					class="flex items-center gap-2 hover:text-primary transition-colors"
				>
					<BookOpen class="h-4 w-4 text-accent" />
					<span>{{ frontmatter.topicData.title }}</span>
				</router-link>
				<div v-if="frontmatter.tags" class="flex items-center gap-2">
					<Tag class="h-4 w-4 text-accent" />
					<div class="flex gap-2">
						<span v-for="tag in frontmatter.tags" :key="tag" class="hover:text-primary">
							#{{ tag }}
						</span>
					</div>
				</div>
			</div>
		</template>

		<template #sidebar>
			<div
				v-if="frontmatter.projectData || frontmatter.topicData"
				class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#161b22]"
			>
				<div v-if="frontmatter.topicData" class="mb-6">
					<h3
						class="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
					>
						<BookOpen class="h-4 w-4" /> Series
					</h3>
					<router-link
						:to="`/topics/${frontmatter.topicData.slug}`"
						class="group block rounded-lg bg-gray-50 p-3 hover:bg-primary/5 dark:bg-gray-800 dark:hover:bg-primary/10 transition-colors"
					>
						<div
							class="text-sm font-bold text-gray-900 group-hover:text-primary dark:text-gray-200"
						>
							{{ frontmatter.topicData.title }}
						</div>
					</router-link>
				</div>
				<div v-if="frontmatter.projectData">
					<h3
						class="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
					>
						<Layers class="h-4 w-4" /> Project
					</h3>
					<router-link
						:to="`/projects/${frontmatter.projectData.slug}`"
						class="group block rounded-lg bg-gray-50 p-3 hover:bg-primary/5 dark:bg-gray-800 dark:hover:bg-primary/10 transition-colors"
					>
						<div
							class="text-sm font-bold text-gray-900 group-hover:text-primary dark:text-gray-200"
						>
							{{ frontmatter.projectData.title }}
						</div>
					</router-link>
				</div>
			</div>
		</template>

		<slot />

		<template #footer>
			<div v-if="frontmatter.relatedPosts && frontmatter.relatedPosts.length > 0">
				<h3 class="mb-6 text-sm font-bold uppercase tracking-wider text-gray-500">
					Related Connections
				</h3>
				<div class="grid gap-4 sm:grid-cols-2">
					<router-link
						v-for="link in frontmatter.relatedPosts"
						:key="link.slug"
						:to="`/${link.type === 'note' ? 'notes' : 'blog'}/${link.slug}`"
						class="flex items-center gap-3 rounded-lg border border-gray-100 p-4 transition-all hover:border-primary/30 hover:shadow-sm dark:border-gray-800 dark:hover:border-primary/30"
					>
						<component
							:is="link.type === 'note' ? StickyNote : FileText"
							class="h-5 w-5 text-gray-400"
						/>
						<span class="font-medium text-gray-700 dark:text-gray-300">{{
							link.title
						}}</span>
					</router-link>
				</div>
			</div>
		</template>
	</ContentLayout>
</template>
