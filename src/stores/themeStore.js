import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {
	let saved = null;
	try {
		saved = localStorage.getItem("theme");
	} catch (e) {
		saved = null;
	}

	const prefersDark =
		typeof window !== "undefined" &&
		window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches;

	// If there is a saved theme use it, otherwise use system preference
	const initial = saved || (prefersDark ? "dark" : "light");

	const theme = ref(initial);

	const nextTheme = computed(() => (theme.value === "light" ? "dark" : "light"));

	// Apply theme to documentElement
	function applyTheme(themeValue) {
		if (typeof document === "undefined") return;
		if (themeValue === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}

	// Persist theme when it changes and apply immediately
	watch(
		theme,
		(newTheme) => {
			try {
				localStorage.setItem("theme", newTheme);
			} catch (e) {
				// ignore localStorage errors (SSR / privacy modes)
			}
			applyTheme(newTheme);
		},
		{ immediate: true },
	);

	// toggle
	function toggleTheme() {
		theme.value = nextTheme.value;
	}

	function setTheme(value) {
		if (value !== "light" && value !== "dark") return;
		theme.value = value;
	}

	function initTheme() {
		applyTheme(theme.value);
	}

	// Listen to system changes if user hasn't explicitly saved a theme
	// This will update theme only if there is no saved value in localStorage
	if (typeof window !== "undefined" && window.matchMedia) {
		const mql = window.matchMedia("(prefers-color-scheme: dark)");
		const handler = (e) => {
			try {
				const stored = localStorage.getItem("theme");
				if (stored) return; // user preference exists — don't override
			} catch (e) {
				// ignore
			}
			theme.value = e.matches ? "dark" : "light";
		};
		if (mql.addEventListener) {
			mql.addEventListener("change", handler);
		} else if (mql.addListener) {
			mql.addListener(handler);
		}
	}

	return {
		theme,
		nextTheme,
		toggleTheme,
		setTheme,
		initTheme,
	};
});
