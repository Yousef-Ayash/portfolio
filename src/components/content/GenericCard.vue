<script setup>
import { computed } from "vue";
import { Clock, ArrowRight, StickyNote } from "lucide-vue-next";

const props = defineProps({
	post: { type: Object, required: true },
	layout: { type: String, default: "grid" }, // 'grid' | 'list'
	showProject: { type: Boolean, default: true },
	blogBase: { type: String, default: "/blog" },
	notesBase: { type: String, default: "/notes" },
});

const isNote = computed(() => props.post.type === "note");

const formattedDate = computed(() => {
	const d = props.post.date ? new Date(props.post.date) : null;
	if (!d) return "";
	return d.toLocaleDateString("en-US", {
		year: props.layout === "grid" ? "numeric" : undefined,
		month: "short",
		day: "numeric",
	});
});

// route target
const target = computed(() => {
	return (isNote.value ? props.notesBase : props.blogBase) + "/" + props.post.slug;
});
</script>

<template>
	<router-link
		:to="target"
		class="group transition-all duration-300"
		:class="[
			layout === 'grid'
				? 'flex flex-col h-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 hover:-translate-y-1 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 dark:border-gray-800 dark:bg-dark dark:hover:border-accent/30'
				: 'flex items-start gap-4 rounded-xl border border-transparent p-4 hover:border-gray-200 hover:bg-white hover:shadow-sm dark:hover:border-gray-800 dark:hover:bg-[#161b22]',
		]"
	>
		<div>
			<!-- top row: note badge + date or project -->
			<div v-if="layout === 'grid'" class="mb-4 flex items-center justify-between">
				<div
					v-if="isNote"
					class="flex items-center gap-2 rounded-full bg-yellow-100/50 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
				>
					<StickyNote class="h-3 w-3" />
					<span>Note</span>
				</div>
				<div
					v-else-if="showProject && post.projectTitle"
					class="text-xs text-gray-500 dark:text-gray-400"
				>
					{{ post.projectTitle }}
				</div>

				<span class="text-xs text-gray-400 font-mono">{{ formattedDate }}</span>
			</div>

			<!-- title & description -->
			<div class="flex-1">
				<h3
					:class="
						layout === 'grid'
							? 'mb-2 text-lg font-bold text-gray-900 group-hover:text-accent dark:text-gray-100'
							: 'font-medium text-gray-900 dark:text-gray-200'
					"
				>
					{{ post.title }}
				</h3>

				<p
					v-if="post.description"
					class="text-sm leading-relaxed text-gray-500 dark:text-gray-400"
					:class="layout === 'grid' ? 'mb-4 line-clamp-3' : 'mt-1 line-clamp-2'"
				>
					{{ post.description }}
				</p>
			</div>

			<!-- footer -->
			<div class="mt-4 flex items-center justify-between text-sm">
				<div class="flex items-center gap-2">
					<span v-if="post.tags && post.tags.length" class="hidden sm:flex gap-2">
						<span
							v-for="t in post.tags.slice(0, 2)"
							:key="t"
							class="rounded-md bg-primary/5 px-2 py-1 text-xs font-medium text-primary dark:bg-primary/10 dark:text-primary-light"
						>
							#{{ t }}
						</span>
					</span>
				</div>

				<div class="flex items-center gap-3">
					<span
						v-if="post.readTime"
						class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"
					>
						<Clock class="h-4 w-4" /> {{ post.readTime }} min
					</span>

					<ArrowRight
						class="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-1"
					/>
				</div>
			</div>
		</div>
	</router-link>
</template>
