---
title: "Fixing the SPA Tax: Migrating to Static Site Generation (SSG)"
description: "A crucial architectural shift for the Digital Garden: how we moved from a vulnerable Single Page Application (SPA) to a robust, pre-rendered static site using Vite-SSG, eliminating 404s and boosting SEO."
date: "2025-12-06"
tags: ["Vue.js", "Vite-SSG", "Pinia", "Routing", "Node.js FS"]
project: "portfolio"
---

<script setup>
import CodeBlock from '@/components/content/CodeBlock.vue'
</script>

## The Architectural Necessity: From Client-Side Render to SSG

When I first created this portfolio, it was a **Single Page Application (SPA)**. This provided a great interactive experience, but it introduced a major reliability and SEO weakness: **The 404 Tax**.

If you navigated to a deep link—like one of my blog posts—and hit refresh or shared the URL, the server had no idea what to do. The URL `/projects/portfolio` only existed in **client-side JavaScript**. The server would inevitably return a `404 Not Found` because the physical file wasn't there.

The solution wasn't to rebuild with a massive framework but rather to use **Vite-SSG** and transform the build step into a **Static Site Generator (SSG)**. This process pre-renders every single dynamic markdown file into a dedicated HTML file at build time instead of in runtime.

This required three core changes, ensuring the build process could:

1.  **Discover** all dynamic routes.
2.  **Load** all Pinia data before rendering.
3.  **Hydrate** the data seamlessly on the client.

---

## 1. Decoupling the Router 🧩

The standard Vue 3 setup exports a fully initialized router instance. However, for SSG to work, it needs to be able to create the app and router internally during the build.

The fix was simple: refactor `src/router/index.js` to only export the `routes` array.

**Old vs. New: `src/router/index.js`**

| Old (SPA)                                  | New (SSG Ready)                                           |
| :----------------------------------------- | :-------------------------------------------------------- |
| Exports `const router = createRouter(...)` | Exports `export const routes = [...]`                     |
| Imports in `main.js`: `app.use(router)`    | Imports in `main.js`: `import { routes } from './router'` |

This provided the raw input needed for `vite-ssg` to take over.

---

## 2. Dynamic Route Discovery with Node FS 🔍

This was the important step for a file-system based CMS like mine. Since the routes are dynamic (e.g., `/blog/:slug`), Vite-SSG doesn’t know what values to plug into that slug until we tell it.

I imported **Node.js's `fs` (File System)** module directly inside `vite.config.js`. This function now scans the `/src/markdown` folders (projects, notes, blogs, topics) and programmatically pushes every single file slug into the `includedRoutes` array, telling the build engine to pre-render that specific page.

<CodeBlock fileName="vite.config.js (ssgOptions)">

```javascript
// Add Node FS imports at the top
import fs from 'node:fs';
import path from 'node:path';

// ... defineConfig setup ...

ssgOptions: {
  script: 'async',
  formatting: 'minify',
  includedRoutes(paths, routes) {
    const staticRoutes = paths.filter(p => !p.includes(':'));
    const extraRoutes = [];

    // CORE LOGIC: Iterate over markdown files to generate paths
    const projectsDir = path.resolve(__dirname, './src/markdown/projects');
    if (fs.existsSync(projectsDir)) {
      const files = fs.readdirSync(projectsDir);
      files.forEach(file => {
        if (file.endsWith('.md')) {
          const slug = file.replace('.md', '');
          extraRoutes.push(`/projects/${slug}`); // Generates /projects/portfolio
        }
      });
    }

    // ... Repeat for /blog, /notes, /topics ...

    return [...staticRoutes, ...extraRoutes, '/404'];
  }
}
```

</CodeBlock>

---

## 3. Data Transfer and Pinia Hydration 💧

Having the routes is not enough; the pre-rendered HTML would be blank without data. We need to load the Pinia store (`blogStore.loadPosts()`) during the build process and then transfer that populated state to the client.

We Then use `vite-ssg`'s `initialState` object, which acts as a bridge between the server (build time) and the client (browser load).

**The Logic in `src/main.js`:**

<CodeBlock fileName="src/main.js (ViteSSG Setup)">

```javascript
import { ViteSSG } from "vite-ssg";
// ... imports ...

export const createApp = ViteSSG(
	App,
	{ routes, base: import.meta.env.BASE_URL /* ... */ },
	({ app, pinia, isClient, initialState }) => {
		// ... setup Pinia and Components ...

		// Conditional logic based on execution environment
		if (import.meta.env.SSR) {
			// 1. SERVER (Build Time): Load data and serialize the state
			const blogStore = useBlogStore(pinia);
			return blogStore.loadPosts().then(() => {
				initialState.pinia = pinia.state.value; // Store the state in HTML
			});
		} else {
			// 2. CLIENT (Browser Load): Hydrate the state from HTML
			if (initialState.pinia) {
				pinia.state.value = initialState.pinia; // Restore the state
			} else {
				// Fallback for client-only transitions
				const blogStore = useBlogStore(pinia);
				blogStore.loadPosts();
			}
		}
	},
);
```

</CodeBlock>

By hooking into the `SSR` (Server-Side Rendering) phase, we ensure the HTML is generated with the content baked in. Upon the browser receiving the page, the JavaScript simply **hydrates** the static content, making it fully interactive without any noticeable loading spinner or data fetch.

## The Payoff: Reliability, Speed, and SEO

This migration was a significant investment, but the payoff is considerable:

- **Reliability:** The 404 Tax is gone. Every deep link is now a valid physical file.
- **Performance:** Users get the content faster because the browser is parsing HTML immediately instead of waiting for the JS bundle to fetch data.
- **SEO:** Search engine crawlers (like Googlebot) are guaranteed to see the full, complete page content with all metadata, immediately improving indexing.

The "Digital Garden" is now technically complete, running as a modern Vue application with the reliability and speed of a traditional static site.
