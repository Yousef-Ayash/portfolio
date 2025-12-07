---
title: "Fixing Theme Amnesia: Persisting User Preferences in Vite-SSG"
description: "Moving to Static Site Generation caused a frustrating regression: the application would 'forget' the user's dark mode preference on every refresh. This post details how to restore state persistence using a head script and proper Pinia hydration."
date: "2025-12-07"
tags: ["Vite-SSG", "Pinia", "LocalStorage", "Client Hydration"]
project: "portfolio"
related:
	- "portfolio-ssg"
---

## The Problem: Static "Amnesia"

After migrating from a Single Page Application (SPA) to Static Site Generation (SSG), I encountered a frustrating UX regression. While the site was faster, it suffered from what I call "Theme Amnesia."

A user would switch to **Dark Mode**, browse happily, and then hit refresh—only to be blinded by the default **Light Mode**. The application was failing to read or respect the user's preference stored in `localStorage`.

### Why This Happens in SSG

In a standard SPA, the application mounts immediately, reads `localStorage`, and sets the state.

In an SSG architecture, `vite-ssg` pre-renders the site into static HTML files during the build process. Since the build server has no concept of "Dark Mode" or `localStorage`, it generates every page with the default (Light) state. When the user visits, they are served this static, light-mode HTML first. Without explicit intervention, the browser simply renders what it was given, ignoring the user's previous choice.

To fix this, we need a two-pronged approach: one script to handle the **visuals** immediately, and one update to handle the **application state**.

---

## 1. Visual Restoration: The Head Script

To ensure the correct theme is applied _before_ the user sees the page, we cannot wait for Vue to load. We need a tiny, blocking script placed directly in the `<head>` of our `index.html`.

This script runs instantly when the HTML is parsed. It checks `localStorage` (or the system preference) and manually manipulates the DOM class list.

<CodeBlock fileName="index.html (inside <head>)">

```html
<script>
	// Immediately check for saved preference
	(() => {
		try {
			const saved = localStorage.getItem("theme");
			const prefersDark =
				window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

			// Use saved value OR system preference, defaulting to light
			const theme = saved || (prefersDark ? "dark" : "light");

			// Manually apply the class before the body renders
			if (theme === "dark") document.documentElement.classList.add("dark");
			else document.documentElement.classList.remove("dark");
		} catch (e) {
			// Silently fail if localStorage is blocked
		}
	})();
</script>
```

</CodeBlock>

This ensures that by the time the browser paints the pixels, the correct CSS variables for Dark Mode are already active.

---

## 2. State Synchronization: Pinia Hydration

Visuals are only half the battle. If we only changed the CSS class, our **Pinia Theme Store** would still think the app is in "Light Mode" (its default state). The first time the user tried to toggle the theme, the button logic would be inverted or broken.

We need to tell the application state to match what the `<head>` script just did.

We do this in `src/main.js`, inside the `ViteSSG` setup function. We use the `isClient` flag to ensure this logic only runs in the browser (hydration phase), not on the server.

<CodeBlock fileName="src/main.js (inside ViteSSG function)">

```javascript
// other imports
import { useThemeStore } from "./stores/themeStore";

export const createApp = ViteSSG(
	// ... App configuration ...
	({ app, router, routes, isClient, initialState }) => {
		// ... Pinia setup ...

		const themeStore = useThemeStore();

		// STRICTLY CLIENT-SIDE LOGIC
		// If we are in the browser, initialize the store from localStorage
		if (isClient) {
			themeStore.initTheme();
		}

		// ... rest of the app logic ...
	},
);
```

</CodeBlock>

### The Complete Flow

1.  **Browser Request:** The user requests the page.
2.  **Head Script:** The `<script>` tag executes, sees `theme: 'dark'` in storage, and adds `class="dark"` to the `<html>` tag.
3.  **Visual Render:** The page renders in Dark Mode.
4.  **Vue Hydration:** `main.js` executes.
5.  **State Sync:** The `if (isClient)` block runs `themeStore.initTheme()`, which reads the same storage value and updates the reactive Pinia state to match the UI.

By decoupling the visual restoration from the Vue lifecycle, we ensure a seamless and persistent experience across refreshes and new sessions.
