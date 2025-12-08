<script setup>
import { ref, computed } from "vue";
import { useCopyCode } from "@/composables/useCopyCode";
import { Check, Copy, FileCode } from "lucide-vue-next";

const props = defineProps({
	tabs: { type: Array, default: () => [] },
	fileName: { type: String, default: "" },
	language: { type: String, default: "" },
	showLineNumbers: { type: Boolean, default: true },
});

const { isCopied, copyToClipboard } = useCopyCode();
const activeTab = ref(props.tabs[0] || "default");
const contentRef = ref(null);

const selectTab = (tab) => {
	activeTab.value = tab;
};

const handleCopy = () => {
	if (contentRef.value) {
		const codeText = contentRef.value.innerText;
		copyToClipboard(codeText);
	}
};

const hasTabs = computed(() => props.tabs && props.tabs.length > 0);
</script>

<template>
	<div
		class="code-block-wrapper group relative my-8 overflow-hidden rounded-xl bg-[#f6f8fa] text-sm shadow-sm ring-1 ring-gray-200 transition-all dark:bg-[#0d1117] dark:ring-gray-800"
		:class="{ 'line-numbers-enabled': showLineNumbers }"
	>
		<div
			class="relative flex min-h-[44px] items-center border-b border-gray-100/50 px-4 py-2 dark:border-gray-800/50"
			:class="{ 'border-b-0': hasTabs }"
		>
			<div class="flex shrink-0 gap-1.5">
				<div class="h-3 w-3 rounded-full bg-[#ff5f56] shadow-sm"></div>
				<div class="h-3 w-3 rounded-full bg-[#ffbd2e] shadow-sm"></div>
				<div class="h-3 w-3 rounded-full bg-[#27c93f] shadow-sm"></div>
			</div>

			<div
				v-if="fileName"
				class="absolute inset-x-0 top-0 bottom-0 flex items-center justify-center pointer-events-none px-[25%] transition-all"
			>
				<span
					class="flex min-w-0 items-center gap-2 truncate text-xs font-medium text-gray-500 dark:text-gray-400"
					:title="fileName"
				>
					<FileCode class="h-3.5 w-3.5 shrink-0 opacity-70" />
					<span class="truncate">{{ fileName }}</span>
				</span>
			</div>

			<div class="ml-auto flex shrink-0 items-center pl-2">
				<span
					v-if="language"
					class="hidden font-mono text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:block pr-3"
				>
					{{ language }}
				</span>
				<button
					@click="handleCopy"
					class="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-all hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
					:title="isCopied ? 'Copied!' : 'Copy code'"
				>
					<Check v-if="isCopied" class="h-3.5 w-3.5 text-green-500" />
					<Copy v-else class="h-3.5 w-3.5" />
				</button>
			</div>
		</div>

		<div
			v-if="hasTabs"
			class="flex min-w-0 flex-1 overflow-hidden border-t border-b border-gray-100/50 px-4 dark:border-gray-800/50"
		>
			<div class="no-scrollbar flex w-full items-center gap-1 overflow-x-auto py-1">
				<button
					v-for="tab in tabs"
					:key="tab"
					@click="selectTab(tab)"
					class="shrink-0 whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium transition-all"
					:class="[
						activeTab === tab
							? 'bg-white text-primary shadow-sm dark:bg-gray-800 dark:text-primary-light'
							: 'text-gray-500 hover:bg-gray-200/50 dark:text-gray-400 dark:hover:bg-gray-800/50',
					]"
				>
					{{ tab }}
				</button>
			</div>
		</div>

		<div ref="contentRef" class="code-content relative overflow-x-auto">
			<template v-if="hasTabs">
				<div v-for="tab in tabs" :key="tab" v-show="activeTab === tab">
					<slot :name="tab"></slot>
				</div>
			</template>
			<template v-else>
				<slot></slot>
			</template>
		</div>
	</div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
	display: none;
}
.no-scrollbar {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
</style>
