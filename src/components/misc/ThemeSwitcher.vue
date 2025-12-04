<script setup>
import { nextTick } from "vue";
import { useThemeStore } from "@/stores/themeStore";

const themeStore = useThemeStore();

const handleToggle = async (event) => {
	if (!document.startViewTransition) {
		themeStore.toggleTheme();
		return;
	}

	const x = event.clientX;
	const y = event.clientY;

	const endRadius = Math.hypot(
		Math.max(x, window.innerWidth - x),
		Math.max(y, window.innerHeight - y),
	);

	const transition = document.startViewTransition(async () => {
		themeStore.toggleTheme();
		await nextTick();
	});

	await transition.ready;

	const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];

	document.documentElement.animate(
		{
			clipPath: clipPath,
		},
		{
			duration: 500,
			easing: "ease-in-out",
			pseudoElement: "::view-transition-new(root)",
		},
	);
};
</script>

<template>
	<button
		@click="handleToggle"
		class="rounded-full p-1.5 hover:cursor-pointer focus:ring-2 focus:ring-primary/50 text-gray-500 dark:text-gray-400 transition-colors hover:text-primary dark:hover:text-primary-light"
		aria-label="Toggle Theme"
	>
		<svg
			v-if="themeStore.nextTheme === 'light'"
			class="h-5 w-5"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
			></path>
		</svg>

		<svg
			v-if="themeStore.nextTheme === 'dark'"
			class="h-5 w-5"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
			></path>
		</svg>
	</button>
</template>
