<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import { useBlogStore } from "@/stores/blogStore";
import { useThemeStore } from "@/stores/themeStore";
import { useCommandStore } from "@/stores/commandStore";
import { storeToRefs } from "pinia";
import {
	Search,
	FileText,
	Layers,
	StickyNote,
	Home,
	BookOpen,
	Moon,
	Sun,
	ArrowRight,
} from "lucide-vue-next";

const commandStore = useCommandStore();
const { isOpen } = storeToRefs(commandStore);

const query = ref("");
const searchInput = ref(null);
const activeIndex = ref(0);

const router = useRouter();
const blogStore = useBlogStore();
const themeStore = useThemeStore();

// Watch for opening to focus input
watch(isOpen, (val) => {
	if (val) {
		query.value = "";
		activeIndex.value = 0;
		nextTick(() => searchInput.value?.focus());
	}
});

// Actions
const staticActions = computed(() => [
	{
		group: "Navigation",
		items: [
			{ title: "Go to Home", icon: Home, path: "/", type: "Page" },
			{ title: "Browse Topics", icon: BookOpen, path: "/topics", type: "Page" },
			{ title: "View Projects", icon: Layers, path: "/projects", type: "Page" },
			{ title: "Digital Garden", icon: FileText, path: "/posts", type: "Page" },
		],
	},
	{
		group: "System",
		items: [
			{
				title: "Toggle Theme",
				icon: themeStore.theme === "dark" ? Sun : Moon,
				action: () => themeStore.toggleTheme(),
				type: "Action",
				meta: `Switch to ${themeStore.nextTheme} mode`,
			},
		],
	},
]);

// Search logic
const searchResults = computed(() => {
	const q = query.value.toLowerCase();
	if (!q) return [];
	const posts = blogStore.posts
		.filter((p) => p.title.toLowerCase().includes(q))
		.map((p) => ({
			type: p.type === "note" ? "Note" : "Article",
			icon: p.type === "note" ? StickyNote : FileText,
			title: p.title,
			meta: p.description ? p.description.substring(0, 40) + "..." : p.date,
			path: `/${p.type === "note" ? "notes" : "blog"}/${p.slug}`,
		}));

	const projects = Object.values(blogStore.projects)
		.filter((p) => p.title.toLowerCase().includes(q))
		.map((p) => ({
			type: "Project",
			icon: Layers,
			title: p.title,
			meta: "Showcase",
			path: `/projects/${p.slug}`,
		}));

	const topics = Object.values(blogStore.topics)
		.filter((t) => t.title.toLowerCase().includes(q))
		.map((t) => ({
			type: "Topic",
			icon: BookOpen,
			title: t.title,
			meta: "Series",
			path: `/topics/${t.slug}`,
		}));

	return [...topics, ...projects, ...posts].slice(0, 7);
});

// Helper for display items
const flatStaticItems = computed(() => staticActions.value.flatMap((group) => group.items));
const displayedItems = computed(() => (query.value ? searchResults.value : flatStaticItems.value));

const executeItem = (item) => {
	if (item.action) {
		item.action();
		commandStore.close();
	} else if (item.path) {
		router.push(item.path);
		commandStore.close();
	}
};

const onKeydown = (e) => {
	if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
		e.preventDefault();
		commandStore.open();
	}
	if (e.key === "Escape") commandStore.close();
	if (!isOpen.value) return;

	// Arrow Logic
	const max = displayedItems.value.length;
	if (e.key === "ArrowDown") {
		e.preventDefault();
		activeIndex.value = (activeIndex.value + 1) % max;
	} else if (e.key === "ArrowUp") {
		e.preventDefault();
		activeIndex.value = activeIndex.value === 0 ? max - 1 : activeIndex.value - 1;
	} else if (e.key === "Enter" && max > 0) {
		executeItem(displayedItems.value[activeIndex.value]);
	}
};

onMounted(() => window.addEventListener("keydown", onKeydown));
onUnmounted(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
	<div v-if="isOpen" class="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
		<div
			@click="commandStore.close()"
			class="absolute inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/60 transition-opacity"
		></div>

		<div
			class="relative w-full max-w-xl transform overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 transition-all dark:bg-[#161b22] dark:ring-white/10"
		>
			<div class="relative border-b border-gray-100 dark:border-gray-800">
				<Search class="pointer-events-none absolute left-4 top-4 h-5 w-5 text-gray-400" />
				<input
					ref="searchInput"
					v-model="query"
					class="h-14 w-full border-0 bg-transparent pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-base dark:text-gray-100 outline-none"
					placeholder="Where do you want to go?"
				/>
				<div
					class="absolute right-4 top-4 rounded border border-gray-200 px-1.5 py-0.5 text-xs font-medium text-gray-400 dark:border-gray-700"
				>
					ESC
				</div>
			</div>

			<ul v-if="query && displayedItems.length > 0" class="max-h-[60vh] overflow-y-auto p-2">
				<li
					v-for="(item, index) in displayedItems"
					:key="item.path"
					@click="executeItem(item)"
					:class="[
						'flex cursor-pointer select-none items-center gap-4 rounded-lg px-4 py-3 transition-colors',
						activeIndex === index
							? 'bg-primary/10 dark:bg-primary/20'
							: 'hover:bg-gray-50 dark:hover:bg-gray-800',
					]"
				>
					<div
						:class="[
							'flex h-10 w-10 items-center justify-center rounded-lg',
							activeIndex === index
								? 'bg-primary/20 text-primary dark:text-primary-light'
								: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
						]"
					>
						<component :is="item.icon" class="h-5 w-5" />
					</div>
					<div class="flex-1 overflow-hidden">
						<div
							:class="[
								'truncate font-medium',
								activeIndex === index
									? 'text-primary dark:text-primary-light'
									: 'text-gray-900 dark:text-gray-200',
							]"
						>
							{{ item.title }}
						</div>
						<div class="truncate text-xs text-gray-500 dark:text-gray-400">
							<span class="capitalize">{{ item.type }}</span> • {{ item.meta }}
						</div>
					</div>
					<ArrowRight v-if="activeIndex === index" class="h-4 w-4 text-primary" />
				</li>
			</ul>

			<div v-else-if="!query" class="max-h-[60vh] overflow-y-auto p-2">
				<div v-for="group in staticActions" :key="group.group" class="mb-2">
					<h3 class="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
						{{ group.group }}
					</h3>
					<ul>
						<li
							v-for="item in group.items"
							:key="item.title"
							@click="executeItem(item)"
							:class="[
								'flex cursor-pointer select-none items-center gap-3 rounded-lg px-4 py-2.5 transition-colors',
								activeIndex === flatStaticItems.indexOf(item)
									? 'bg-primary/10 dark:bg-primary/20'
									: 'hover:bg-gray-50 dark:hover:bg-gray-800',
							]"
						>
							<component
								:is="item.icon"
								class="h-4 w-4 text-gray-500 dark:text-gray-400"
							/>
							<span
								class="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200"
								>{{ item.title }}</span
							>
						</li>
					</ul>
				</div>
			</div>

			<div v-else class="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
				No results found.
			</div>
		</div>
	</div>
</template>
