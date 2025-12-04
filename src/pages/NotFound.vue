<script setup>
import { ChevronLeft } from "lucide-vue-next";
import { useHead } from "@unhead/vue";

useHead({
	title: "Page Not Found",
	meta: [
		{
			name: "description",
			content: "The page you requested could not be found.",
		},
		{
			name: "robots",
			content: "noindex, nofollow",
		},
	],
});
</script>

<template>
	<div
		class="flex min-h-screen flex-col items-center justify-center bg-light px-6 text-center transition-colors duration-300 dark:bg-dark"
	>
		<div class="relative mb-8">
			<h1
				class="select-none text-9xl font-black tracking-tighter text-gray-200 dark:text-gray-800 sm:text-[12rem]"
			>
				404
			</h1>
			<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
				<div
					class="rounded-xl bg-gray-900 px-8 py-6 text-left shadow-2xl ring-1 ring-white/10"
				>
					<div class="mb-4 flex gap-2">
						<div class="h-3 w-3 rounded-full bg-red-500"></div>
						<div class="h-3 w-3 rounded-full bg-yellow-500"></div>
						<div class="h-3 w-3 rounded-full bg-green-500"></div>
					</div>
					<div class="font-mono text-sm text-gray-300">
						<p>
							<span class="text-purple-400">const</span>
							<span class="text-blue-400"> page</span> =
							<span class="text-yellow-300">undefined</span>;
						</p>
						<p class="mt-2"><span class="text-purple-400">if</span> (!page) {</p>
						<p class="pl-4">
							<span class="text-red-400">throw new Error</span>(<span
								class="text-green-400"
								>'Lost in space'</span
							>);
						</p>
						<p>}</p>
					</div>
				</div>
			</div>
		</div>

		<h2 class="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Page Not Found</h2>
		<p class="mb-10 max-w-md text-gray-600 dark:text-gray-400">
			The page you are looking for doesn't exist or has been moved. Double-check the URL or
			head back to the mothership.
		</p>

		<router-link
			to="/"
			class="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
		>
			<ChevronLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
			Back to Home
		</router-link>
	</div>
</template>
