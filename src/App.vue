<script setup>
import NavBar from "@/components/NavBar.vue";
import CommandPalette from "@/components/CommandPalette.vue";
import { useHead } from "@unhead/vue";

useHead({
	title: "Yousef Ayash",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | Yousef Ayash` : "Yousef Ayash";
	},
	meta: [
		{ name: "author", content: "Yousef Ayash" },
		{ property: "og:type", content: "website" },
		{ property: "og:site_name", content: "Yousef Ayash" },
	],
	htmlAttrs: {
		lang: "en",
	},
});
</script>

<template>
	<div class="flex min-h-screen flex-col">
		<NavBar />

		<CommandPalette />

		<main class="flex-1">
			<router-view v-slot="{ Component }">
				<transition name="fade" mode="out-in">
					<component :is="Component" />
				</transition>
			</router-view>
		</main>
	</div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
