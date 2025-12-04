<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import {
	Calendar,
	Clock,
	Tag,
	ChevronLeft,
	ArrowUp,
	List,
	X,
	Layers,
	Link as LinkIcon,
	StickyNote,
	FileText,
} from "lucide-vue-next";
import BlogTOC from "../content/BlogTOC.vue";

const route = useRoute();
const isNote = computed(() => route.path.startsWith("/notes"));

defineProps({
	frontmatter: {
		type: Object,
		default: () => ({}),
	},
});

// Floating Controls Logic
const showScrollTop = ref(false);
const showMobileTOC = ref(false);

const handleScroll = () => {
	showScrollTop.value = window.scrollY > 300;
};

const scrollToTop = () => {
	window.scrollTo({ top: 0, behavior: "smooth" });
};

const toggleMobileTOC = () => {
	showMobileTOC.value = !showMobileTOC.value;
};

onMounted(() => window.addEventListener("scroll", handleScroll));
onUnmounted(() => window.removeEventListener("scroll", handleScroll));
</script>

<template>
	<div
		class="min-h-screen bg-light dark:bg-dark transition-colors duration-300 pt-24 pb-16 relative"
	>
		<div class="mx-auto max-w-7xl px-6 lg:px-8 mb-12 md:mb-20">
			<div class="max-w-3xl">
				<a
					:href="isNote ? '/journey' : '/blog'"
					class="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light transition-colors"
				>
					<ChevronLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
					Back to {{ isNote ? "Notes" : "Articles" }}
				</a>

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
						<time :datetime="frontmatter.date">{{ frontmatter.date }}</time>
					</div>
					<div v-if="frontmatter.readTime" class="flex items-center gap-2">
						<Clock class="h-4 w-4 text-accent" />
						<span>{{ frontmatter.readTime }} min read</span>
					</div>
					<div v-if="frontmatter.tags" class="flex items-center gap-2">
						<Tag class="h-4 w-4 text-accent" />
						<div class="flex gap-2">
							<span
								v-for="tag in frontmatter.tags"
								:key="tag"
								class="hover:text-primary cursor-pointer"
							>
								#{{ tag }}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<div class="lg:grid lg:grid-cols-12 lg:gap-12">
				<article class="lg:col-span-8 xl:col-span-9">
					<div class="prose-tech blog-content text-lg leading-relaxed">
						<slot />
					</div>

					<div class="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
						<p class="text-gray-500 italic">Thanks for reading!</p>
					</div>
				</article>

				<aside class="hidden lg:block lg:col-span-4 xl:col-span-3">
					<div class="sticky top-32 space-y-8">
						<div
							v-if="
								frontmatter.projectData ||
								(frontmatter.relatedPosts && frontmatter.relatedPosts.length > 0)
							"
							class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#161b22]"
						>
							<div v-if="frontmatter.projectData" class="mb-6">
								<h3
									class="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
								>
									<Layers class="h-4 w-4" />
									Project
								</h3>
								<router-link
									:to="`/projects/${frontmatter.projectData.slug}`"
									class="group block rounded-lg bg-gray-50 p-3 hover:bg-primary/5 dark:bg-gray-800 dark:hover:bg-primary/10 transition-colors"
								>
									<div
										class="text-sm font-bold text-gray-900 group-hover:text-primary dark:text-gray-200 dark:group-hover:text-primary-light"
									>
										{{ frontmatter.projectData.title }}
									</div>
									<div class="text-xs text-gray-500 mt-1">View Case Study →</div>
								</router-link>
							</div>

							<div
								v-if="
									frontmatter.relatedPosts && frontmatter.relatedPosts.length > 0
								"
							>
								<h3
									class="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
								>
									<LinkIcon class="h-4 w-4" />
									Related Connections
								</h3>
								<ul class="space-y-2">
									<li v-for="link in frontmatter.relatedPosts" :key="link.slug">
										<router-link
											:to="`/${link.type === 'note' ? 'notes' : 'blog'}/${link.slug}`"
											class="flex items-start gap-2 text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light transition-colors"
										>
											<component
												:is="link.type === 'note' ? StickyNote : FileText"
												class="h-4 w-4 mt-0.5 opacity-70 shrink-0"
											/>
											<span class="leading-tight">{{ link.title }}</span>
										</router-link>
									</li>
								</ul>
							</div>
						</div>

						<BlogTOC />
					</div>
				</aside>
			</div>
		</div>

		<div class="fixed bottom-8 right-8 z-40 flex flex-col gap-3">
			<button
				@click="toggleMobileTOC"
				class="flex lg:hidden h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg shadow-gray-200/50 ring-1 ring-gray-900/5 transition-all hover:bg-gray-50 active:scale-90 dark:bg-gray-800 dark:shadow-none dark:ring-white/10 dark:hover:bg-gray-700"
			>
				<List class="h-5 w-5 text-gray-700 dark:text-gray-200" />
			</button>
			<button
				v-if="showScrollTop"
				@click="scrollToTop"
				class="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover hover:-translate-y-1 active:scale-90"
			>
				<ArrowUp class="h-5 w-5" />
			</button>
		</div>

		<transition
			enter-active-class="transition duration-200 ease-out"
			enter-from-class="opacity-0 translate-y-10"
			enter-to-class="opacity-100 translate-y-0"
			leave-active-class="transition duration-150 ease-in"
			leave-from-class="opacity-100 translate-y-0"
			leave-to-class="opacity-0 translate-y-10"
		>
			<div
				v-if="showMobileTOC"
				class="fixed inset-0 z-50 flex items-end justify-center lg:hidden"
			>
				<div
					@click="showMobileTOC = false"
					class="absolute inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/60"
				></div>

				<div
					class="relative w-full max-w-md rounded-t-2xl bg-white p-6 shadow-2xl dark:bg-[#161b22] dark:ring-1 dark:ring-white/10 max-h-[70vh] overflow-y-auto"
				>
					<div class="flex items-center justify-between mb-4">
						<h3 class="text-lg font-bold text-gray-900 dark:text-white">
							On this page
						</h3>
						<button
							@click="showMobileTOC = false"
							class="p-2 text-gray-500 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-800"
						>
							<X class="h-5 w-5" />
						</button>
					</div>

					<BlogTOC @close="showMobileTOC = false" />

					<div
						v-if="frontmatter.relatedPosts && frontmatter.relatedPosts.length > 0"
						class="mt-8 border-t border-gray-100 pt-4 dark:border-gray-800"
					>
						<h4 class="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
							Related
						</h4>
						<ul class="space-y-3">
							<li v-for="link in frontmatter.relatedPosts" :key="link.slug">
								<router-link
									:to="`/${link.type === 'note' ? 'notes' : 'blog'}/${link.slug}`"
									class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
								>
									<component
										:is="link.type === 'note' ? StickyNote : FileText"
										class="h-4 w-4"
									/>
									{{ link.title }}
								</router-link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<style scoped>
h1 {
	text-shadow: 0 0 0px transparent;
	transition: text-shadow 0.3s;
}
:global(.dark) h1 {
	text-shadow: 0 0 30px rgba(0, 153, 255, 0.15);
}
</style>
