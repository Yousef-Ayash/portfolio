<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

const emit = defineEmits(["close"]);

const route = useRoute();
const headers = ref([]);
const activeId = ref("");
let observer = null;
let ticking = false;

const updateHash = (id) => {
	if (activeId.value === id) return;

	activeId.value = id;

	if (history.replaceState) {
		history.replaceState(null, null, `#${id}`);
	}
};

const initTOC = () => {
	const elements = Array.from(document.querySelectorAll(".prose-tech h2, .prose-tech h3"));

	if (elements.length === 0) return;

	headers.value = elements.map((el) => ({
		id: el.id,
		text: el.innerText,
		level: el.tagName.toLowerCase(),
	}));

	const currentHash = route.hash.replace("#", "");
	if (currentHash && headers.value.some((h) => h.id === currentHash)) {
		activeId.value = currentHash;
	} else if (headers.value.length > 0) {
		activeId.value = headers.value[0].id;
	}
};

const onScroll = () => {
	if (!ticking) {
		window.requestAnimationFrame(() => {
			updateActiveHeader();
			ticking = false;
		});
		ticking = true;
	}
};

const updateActiveHeader = () => {
	if (headers.value.length === 0) return;

	const isMobile = window.innerWidth < 768;
	const topOffset = isMobile ? 80 : 150;

	const domElements = headers.value.map((h) => document.getElementById(h.id)).filter((el) => el);

	if (domElements.length === 0) return;

	let currentActiveId = headers.value[0].id;

	for (const element of domElements) {
		const rect = element.getBoundingClientRect();

		if (rect.top <= topOffset) {
			currentActiveId = element.id;
		} else {
			break;
		}
	}

	updateHash(currentActiveId);
};

onMounted(() => {
	initTOC();

	setTimeout(() => {
		updateActiveHeader();
	}, 100);

	window.addEventListener("scroll", onScroll, { passive: true });

	window.addEventListener("resize", updateActiveHeader, { passive: true });

	const articleContent = document.querySelector("main");
	if (articleContent) {
		observer = new MutationObserver(() => {
			const currentCount = document.querySelectorAll(".prose-tech h2, .prose-tech h3").length;
			if (currentCount !== headers.value.length) {
				initTOC();
				setTimeout(updateActiveHeader, 50);
			}
		});
		observer.observe(articleContent, { childList: true, subtree: true });
	}
});

onUnmounted(() => {
	window.removeEventListener("scroll", onScroll);
	window.removeEventListener("resize", updateActiveHeader);
	if (observer) observer.disconnect();
});

const scrollTo = (id) => {
	const el = document.getElementById(id);
	if (el) {
		const isMobile = window.innerWidth < 768;
		const offset = isMobile ? 80 : 100;

		const elementPosition = el.getBoundingClientRect().top + window.scrollY;
		const offsetPosition = elementPosition - offset;

		window.scrollTo({
			top: offsetPosition,
			behavior: "smooth",
		});

		updateHash(id);
		emit("close");
	}
};
</script>

<template>
	<nav v-if="headers.length > 0" class="space-y-2 pl-4">
		<p class="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
			On this page
		</p>
		<ul class="space-y-3 border-l-2 border-gray-100 dark:border-gray-800">
			<li v-for="header in headers" :key="header.id" class="-ml-[2px]">
				<button
					@click="scrollTo(header.id)"
					class="group flex w-full items-center border-l-2 py-1 text-left text-sm transition-all duration-200"
					:class="[
						activeId === header.id
							? 'border-primary text-primary font-medium dark:text-primary-light'
							: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200',
						header.level === 'h3' ? 'pl-6' : 'pl-4',
					]"
				>
					{{ header.text }}
				</button>
			</li>
		</ul>
	</nav>
</template>
