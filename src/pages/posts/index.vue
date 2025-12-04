<script setup>
import { storeToRefs } from "pinia";
import { Search, PenTool, StickyNote, Filter, Sprout } from "lucide-vue-next";
import { useBlogStore } from "@/stores/blogStore";
import { useRoute, useRouter } from "vue-router";
import { watch, onMounted } from "vue";
import GenericCard from "@/components/content/GenericCard.vue";
import { useHead } from "@unhead/vue";

const route = useRoute();
const router = useRouter();
const blogStore = useBlogStore();
const { filteredPosts, searchQuery, selectedTags, allTags, loading, activeType } =
	storeToRefs(blogStore);
const { toggleTag, resetFilters } = blogStore;

const tabs = [
	{ id: "all", hash: "", label: "All", icon: Filter },
	{ id: "blog", hash: "#articles", label: "Articles", icon: PenTool },
	{ id: "note", hash: "#notes", label: "Notes", icon: StickyNote },
];

const setTab = (tab) => {
	activeType.value = tab.id;
	router.replace({
		path: "/posts",
		hash: tab.hash,
	});
};

const syncHashToTab = () => {
	const hash = route.hash;
	if (hash === "#articles") activeType.value = "blog";
	else if (hash === "#notes") activeType.value = "note";
	else activeType.value = "all";
};

onMounted(() => {
	syncHashToTab();
});

watch(
	() => route.hash,
	() => {
		syncHashToTab();
	},
);

useHead({
	title: "Digital Garden",
	meta: [
		{
			name: "description",
			content:
				"A comprehensive list of all technical articles, guides, and personal development posts written by Yousef Ayash.",
		},
		{ property: "og:title", content: "Digital Garden & Blog" },
		{ property: "og:description", content: "Explore articles, notes, and technical guides." },
	],
});
</script>

<template>
	<div class="min-h-screen bg-light pb-20 pt-32 transition-colors duration-300 dark:bg-dark">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="mb-12">
				<div
					class="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100/50 px-3 py-1 text-xs font-medium text-green-700 backdrop-blur-sm dark:bg-green-500/10 dark:text-green-300"
				>
					<Sprout class="h-3 w-3" />
					<span>Digital Garden</span>
				</div>

				<h1
					class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl"
				>
					Exploration & <span class="text-primary">Thoughts</span>
				</h1>
				<p class="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
					A collection of polished tutorials and raw learning notes.
				</p>
			</div>

			<div
				class="sticky top-20 z-30 mb-8 space-y-4 rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur-md ring-1 ring-gray-900/5 dark:bg-dark/80 dark:ring-white/10 md:space-y-0 md:flex md:items-center md:justify-between"
			>
				<div class="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
					<button
						v-for="tab in tabs"
						:key="tab.id"
						@click="setTab(tab)"
						class="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all hover:cursor-pointer"
						:class="[
							activeType === tab.id
								? 'bg-white text-gray-900 shadow-sm dark:bg-[#161b22] dark:text-white'
								: 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200',
						]"
					>
						<component :is="tab.icon" class="h-4 w-4" />
						{{ tab.label }}
					</button>
				</div>

				<div class="relative w-full md:w-64">
					<Search
						class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
					/>
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Filter list..."
						class="h-10 w-full rounded-lg border-0 bg-transparent pl-9 pr-4 text-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:ring-gray-700 dark:focus:ring-primary dark:text-white"
					/>
				</div>
			</div>

			<div class="mb-10 flex flex-wrap gap-2">
				<button
					v-for="tag in allTags"
					:key="tag"
					@click="toggleTag(tag)"
					class="rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200"
					:class="[
						selectedTags.includes(tag)
							? 'border-accent bg-accent text-white'
							: 'border-gray-200 bg-transparent text-gray-500 hover:border-accent hover:text-accent dark:border-gray-800 dark:text-gray-400',
					]"
				>
					{{ tag }}
				</button>
				<button
					v-if="selectedTags.length"
					@click="resetFilters"
					class="text-xs text-gray-400 underline hover:text-gray-900 dark:hover:text-white"
				>
					Clear
				</button>
			</div>

			<div v-if="loading" class="py-20 text-center">
				<div
					class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"
				></div>
			</div>

			<div v-else-if="filteredPosts.length > 0">
				<div v-if="activeType !== 'note'" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					<GenericCard
						v-for="post in filteredPosts"
						:key="post.slug"
						:post="post"
						:layout="activeType === 'note' ? 'list' : 'grid'"
					/>
				</div>
				<div v-else class="mx-auto max-w-3xl space-y-4">
					<GenericCard v-for="post in filteredPosts" :key="post.slug" :post="post" />
				</div>
			</div>

			<div v-else class="flex flex-col items-center justify-center py-20 text-center">
				<h3 class="text-lg font-medium text-gray-900 dark:text-white">No content found</h3>
			</div>
		</div>
	</div>
</template>
