<script setup>
import { ChevronRight, Home } from "lucide-vue-next";

defineProps({
	items: { type: Array, default: () => [] },
	// items format: [{ label: 'Name', to: '/path' }]
});
</script>

<template>
	<nav class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6 overflow-x-auto">
		<router-link to="/" class="hover:text-primary transition-colors">
			<Home class="h-4 w-4" />
		</router-link>

		<template v-for="(item, index) in items" :key="item.to">
			<ChevronRight class="h-4 w-4 mx-2 text-gray-300 dark:text-gray-600 flex-shrink-0" />
			<router-link
				v-if="item.to"
				:to="item.to"
				class="hover:text-primary transition-colors whitespace-nowrap"
			>
				{{ item.label }}
			</router-link>
			<span
				v-else
				class="text-gray-900 dark:text-gray-200 font-medium whitespace-nowrap truncate max-w-[200px]"
			>
				{{ item.label }}
			</span>
		</template>
	</nav>
</template>
