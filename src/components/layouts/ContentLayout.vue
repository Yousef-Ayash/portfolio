<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { ChevronLeft, ArrowUp, List, X } from "lucide-vue-next";
import BlogTOC from "../content/BlogTOC.vue";
import Breadcrumbs from "../Breadcrumbs.vue";

defineProps({
	breadcrumbs: { type: Array, required: true },
	showTOC: { type: Boolean, default: true },
});

const router = useRouter();

// Smart Back Logic
const goBack = () => {
	if (window.history.state && window.history.state.back) {
		router.back();
	} else {
		router.push("/");
	}
};

// Scroll & Drawer Logic
const showScrollTop = ref(false);
const showMobileTOC = ref(false);

const handleScroll = () => {
	showScrollTop.value = window.scrollY > 300;
};
const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

onMounted(() => window.addEventListener("scroll", handleScroll));
onUnmounted(() => window.removeEventListener("scroll", handleScroll));
</script>

<template>
	<div
		class="min-h-screen bg-light dark:bg-dark transition-colors duration-300 pt-24 pb-16 relative"
	>
		<div class="mx-auto max-w-7xl px-6 lg:px-8 mb-12 md:mb-16">
			<div class="max-w-4xl">
				<div class="mb-6 flex flex-col gap-4">
					<Breadcrumbs :items="breadcrumbs" />
					<button
						@click="goBack"
						class="w-fit group inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light transition-colors"
					>
						<ChevronLeft
							class="h-4 w-4 transition-transform group-hover:-translate-x-1"
						/>
						Back
					</button>
				</div>
				<slot name="header" />
			</div>
		</div>

		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<div class="lg:grid lg:grid-cols-12 lg:gap-12">
				<article class="lg:col-span-8 xl:col-span-9 flex flex-col gap-12">
					<div class="prose-tech blog-content text-lg leading-relaxed">
						<slot />
					</div>
					<div class="border-t border-gray-100 dark:border-gray-800 pt-12">
						<slot name="footer" />
					</div>
				</article>

				<aside class="hidden lg:block lg:col-span-4 xl:col-span-3">
					<div class="sticky top-32 space-y-8">
						<slot name="sidebar" />
						<BlogTOC v-if="showTOC" />
					</div>
				</aside>
			</div>
		</div>

		<div class="fixed bottom-8 right-8 z-40 flex flex-col gap-3">
			<button
				v-if="showTOC"
				@click="showMobileTOC = !showMobileTOC"
				class="flex lg:hidden h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg shadow-gray-200/50 ring-1 ring-gray-900/5 transition-all dark:bg-gray-800 dark:shadow-none dark:ring-white/10 text-gray-700 dark:text-gray-200"
			>
				<List class="h-5 w-5" />
			</button>
			<button
				v-if="showScrollTop"
				@click="scrollToTop"
				class="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover hover:-translate-y-1"
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
					class="relative w-full max-w-md rounded-t-2xl bg-white shadow-2xl dark:bg-[#161b22] max-h-[85vh] flex flex-col"
				>
					<div
						class="flex items-center justify-between p-6 pb-2 border-b border-gray-100 dark:border-gray-800/50"
					>
						<h3
							class="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
						>
							Contents & Context
						</h3>
						<button
							@click="showMobileTOC = false"
							class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
						>
							<X class="h-5 w-5" />
						</button>
					</div>

					<div class="overflow-y-auto p-6 pt-4">
						<div class="mb-6">
							<slot name="mobile-header" />
						</div>

						<BlogTOC @close="showMobileTOC = false" />
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>
