<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import ThemeSwitcher from "./misc/ThemeSwitcher.vue";
import { useCommandStore } from "@/stores/commandStore";
import { Menu, X, Github, Linkedin, ArrowRight, Search, Command } from "lucide-vue-next";
import Logo from "./Logo.vue";

const commandStore = useCommandStore();
const isOpen = ref(false);
const isScrolled = ref(false);

const links = [
	{ name: "Digital Garden", href: "/posts", id: "posts" },
	{ name: "Projects", href: "/projects", id: "projects" },
	{ name: "Series", href: "/topics", id: "topic" },
];

const outerLinks = [
	{ name: "GitHub", href: "https://github.com/yousef-ayash" },
	{ name: "LinkedIn", href: "https://linkedin.com/in/yousefayash65" },
];

const handleScroll = () => {
	isScrolled.value = window.scrollY > 20;
};

onMounted(() => window.addEventListener("scroll", handleScroll));
onUnmounted(() => window.removeEventListener("scroll", handleScroll));
</script>

<template>
	<nav
		class="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out"
		:class="[
			isScrolled
				? 'border-b border-primary/10 bg-light/80 dark:bg-dark/90 shadow-sm dark:shadow-primary/5 backdrop-blur-md dark:border-primary/20'
				: 'bg-transparent border-b border-transparent',
		]"
	>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex-shrink-0 group cursor-pointer">
					<router-link
						to="/"
						class="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-500 ease-out"
					>
						<div class="h-10 w-10">
							<Logo />
						</div>

						<div
							class="text-2xl font-bold tracking-tighter text-primary dark:text-primary-light"
						>
							Yousef <span class="text-accent">Ayash</span>
						</div>
					</router-link>
				</div>

				<div class="hidden md:block">
					<div class="ml-10 flex items-center space-x-2">
						<router-link
							v-for="link in links"
							:key="link.name"
							:to="link.href"
							active-class="text-primary dark:text-primary-light bg-primary/20 dark:bg-primary/10"
							class="relative rounded-lg px-4 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 transition-all duration-200 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary/10"
						>
							{{ link.name }}
						</router-link>

						<div class="mx-4 h-5 w-px bg-gray-200 dark:bg-gray-700/50"></div>

						<div class="flex items-center gap-3">
							<button
								@click="commandStore.open()"
								class="group flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-500 hover:border-primary/30 hover:text-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-primary-light transition-all"
								title="Command Palette (Ctrl+K)"
							>
								<Search class="h-4 w-4" />
								<span class="hidden lg:inline">Search...</span>
								<span
									class="hidden lg:flex items-center gap-0.5 rounded bg-gray-200 px-1 py-0.5 font-mono text-[10px] dark:bg-gray-700"
								>
									<Command class="h-3 w-3" /> K
								</span>
							</button>

							<a
								:href="outerLinks[0].href"
								target="_blank"
								class="p-1.5 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light"
								><Github class="h-5 w-5"
							/></a>
							<a
								:href="outerLinks[1].href"
								target="_blank"
								class="p-1.5 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light"
								><Linkedin class="h-5 w-5"
							/></a>

							<ThemeSwitcher />
						</div>
					</div>
				</div>

				<div class="-mr-2 flex md:hidden gap-3 items-center">
					<button
						@click="commandStore.open()"
						class="p-2 text-gray-500 hover:text-primary dark:text-gray-300"
					>
						<Search class="h-5 w-5" />
					</button>

					<ThemeSwitcher />

					<button
						@click="isOpen = !isOpen"
						class="group inline-flex items-center justify-center rounded-full p-2 text-gray-500 dark:text-gray-300"
					>
						<div class="relative w-6 h-6">
							<Menu
								class="absolute inset-0 h-6 w-6 transition-all duration-300 transform"
								:class="
									isOpen
										? 'opacity-0 rotate-90 scale-50'
										: 'opacity-100 rotate-0 scale-100'
								"
							/>
							<X
								class="absolute inset-0 h-6 w-6 transition-all duration-300 transform"
								:class="
									!isOpen
										? 'opacity-0 -rotate-90 scale-50'
										: 'opacity-100 rotate-0 scale-100'
								"
							/>
						</div>
					</button>
				</div>
			</div>
		</div>

		<transition
			enter-active-class="transition duration-200 ease-out"
			enter-from-class="transform -translate-y-4 opacity-0 scale-95"
			enter-to-class="transform translate-y-0 opacity-100 scale-100"
			leave-active-class="transition duration-150 ease-in"
			leave-from-class="transform translate-y-0 opacity-100 scale-100"
			leave-to-class="transform -translate-y-4 opacity-0 scale-95"
		>
			<div
				v-if="isOpen"
				class="absolute left-0 right-0 top-16 border-b border-primary/10 bg-light/95 dark:bg-dark/95 shadow-xl backdrop-blur-xl dark:border-primary/20 md:hidden"
			>
				<div class="space-y-1 px-4 pb-6 pt-4">
					<router-link
						v-for="link in links"
						:key="link.name"
						:to="link.href"
						@click="isOpen = false"
						class="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 transition-all hover:bg-primary/5 hover:text-primary dark:hover:bg-primary/10 dark:hover:text-primary-light"
					>
						{{ link.name }}
						<ArrowRight class="h-4 w-4 opacity-50" />
					</router-link>

					<div
						class="mt-6 flex justify-center gap-6 border-t border-gray-100 dark:border-gray-800 pt-6"
					>
						<a
							:href="outerLinks[0].href"
							target="_blank"
							class="flex flex-col items-center gap-1 text-xs font-medium text-gray-500 hover:text-primary dark:text-gray-400"
							><Github class="h-5 w-5" />Github</a
						>
						<a
							:href="outerLinks[1].href"
							target="_blank"
							class="flex flex-col items-center gap-1 text-xs font-medium text-gray-500 hover:text-primary dark:text-gray-400"
							><Linkedin class="h-5 w-5" />LinkedIn</a
						>
					</div>
				</div>
			</div>
		</transition>
	</nav>
</template>
