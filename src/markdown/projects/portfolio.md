---
title: "Personal Portfolio & Digital Garden"
description: "A static-site generator built with Vue 3, Vite, and Tailwind CSS v4. Features a file-system based CMS, view transitions, and a custom command palette."
date: "2025-02-14"
technologies: ["Vue.js", "Vite", "Tailwind CSS v4", "Pinia", "Shiki"]
demoUrl: "https://yousef-ayash.netlify.app"
repoUrl: "https://github.com/yousef-ayash/portfolio"
---

## The Philosophy

There are multiple ways I could create my personal website:

1. A heavy framework like NuxtJS.
2. A Laravel full fledged backend with database and SPA with VueJS.
3. Build something super lightweight and easy to use and use it as an opportunity to learn a new set of technology.

I chose the latter.

This website I like to call it a **Digital Garden**. unlike any other blog where everything is refined and "finished", my digital garden is a collection of working notes, snippets, and polished articles; Where I walk through learning, building, and writing my journey around tech and projects.

## The Stack

I built this using the **Vue 3** library, but with a specific focus on modern tooling:

1.  **Vite**: For lightning-fast HMR and building.
2.  **Tailwind CSS v4**: Utilizing the CSS-first configuration, and moving from the monolith pure css files.
3.  **Pinia**: To manage the "database" of markdown files, and manage state.
4.  **unplugin-vue-markdown**: A Vite plugin that compiles Markdown directly into Vue components, allowing me to use interactive Vue components inside my writing.

## Architecture: The "No-CMS" Approach

Instead of fetching data from an API or a Headless CMS, this project uses the file system as its database. Using Vite's `import.meta.glob`, I can load all markdown files at build time (or runtime in dev) and process them into a queryable state in Pinia.

Here is how `blogStore` aggregates content: It separates "Notes", or raw thoughts, from "Articles" (polished content) and "Projects".

<CodeBlock fileName="src/stores/blogStore.js" :tabs="['Logic', 'Data']">

<template #Logic>

```javascript
// We load all markdown files eagerly using Vite
const loadPosts = async () => {
	const topicModules = import.meta.glob("@/markdown/topics/*.md", { eager: true });
	const projectModules = import.meta.glob("@/markdown/projects/*.md", { eager: true });
	const blogModules = import.meta.glob("@/markdown/blog/**/*.md", { eager: true });

	// Helper to normalize data
	const rawProjects = processModules(projectModules, "project");

	// map relationships
	allContent.forEach((post) => {
		if (post.project && projectMap[post.project]) {
			projectMap[post.project].posts.push(post);
		}
	});

	posts.value = allContent;
};
```

</template>

<template #Data>

```json
{
	"slug": "portfolio",
	"path": "/src/markdown/projects/portfolio.md",
	"type": "project",
	"title": "Personal Portfolio",
	"technologies": ["Vue", "Vite"],
	"posts": [{ "title": "Migrating to Tailwind v4", "slug": "tailwind-migration" }]
}
```

</template>

</CodeBlock>

## Structuring Knowledge

The core value of this digital garden comes from how it connects concepts. I did not want just a flat list of blog posts. What I wanted was a relational structure that mirrors the way I learn.

For example, if I am **Learning Rust**:

1.  I create a **Topic** (`learning-rust`).
2.  I write to this Topic daily **Notes** or so - just raw, unrefined logs and working process.
3.  I create a **Project** (e.g., a command-line tool), related with that Topic.
4.  I write a polished **Article** reflecting on the Project.

However, the system is **loosely coupled**: a Project doesn't necessarily need a Topic to exist, and neither does an Article need it. We can do this with simple `Frontmatter` referencing:

<CodeBlock fileName="frontmatter-examples.md" :tabs="['Topic', 'Project', 'Note']">

<template #Topic>

```yaml
# src/markdown/topics/learning-rust.md
---
title: "Learning Rust"
description: "My journey from zero to production in Rust."
---
```

</template>

<template #Project>

```yaml
# src/markdown/projects/rust-cli.md
---
title: "Rust CLI Tool"
topic: "learning-rust"
# ^ This links the project to the topic
---
```

</template>

<template #Note>

```yaml
# src/markdown/notes/rust-borrow-checker.md
---
title: "Fighting the Borrow Checker"
topic: "learning-rust"
project: "rust-cli"
# ^ This note appears in the Topic list AND the Project page
---
```

</template>

</CodeBlock>

## Moving to Tailwind CSS v4

One of the key features of this project includes using Tailwind v4 (Alpha/Beta). No longer is the configuration done through a JavaScript configuration file called `tailwind.config.js` but rather directly in CSS, with the use of CSS variables and the `@theme` directive.

This keeps the configuration where it belongs: in the stylesheets.

<CodeBlock fileName="src/styles/main.css">

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
	/* Defining colors directly in CSS */
	--color-dark: rgb(20, 24, 30);
	--color-light: rgb(242, 250, 255);

	/* Primary Brand Colors */
	--color-primary: rgb(0, 153, 255);
	--color-accent: rgb(0, 204, 190);
}
```

</CodeBlock>

## Dark Mode & View Transitions

I enabled Dark Mode via the **View Transitions API**. This allows for the circular clip-path animation, when transitioning between themes instead of just an instant color swap.

This logic calculates the distance from the click event to the furthest corner of the screen to make sure the circle covers the entire viewport.

<CodeBlock fileName="src/components/misc/ThemeSwitcher.vue">

```javascript
const handleToggle = async (event) => {
	// Fallback for browsers without View Transition support
	if (!document.startViewTransition) {
		themeStore.toggleTheme();
		return;
	}

	const x = event.clientX;
	const y = event.clientY;

	// Calculate radius to the furthest corner
	const endRadius = Math.hypot(
		Math.max(x, window.innerWidth - x),
		Math.max(y, window.innerHeight - y),
	);

	const transition = document.startViewTransition(async () => {
		themeStore.toggleTheme();
		await nextTick();
	});

	// Animate the clip-path
	document.documentElement.animate(
		{
			clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
		},
		{
			duration: 500,
			easing: "ease-in-out",
			pseudoElement: "::view-transition-new(root)",
		},
	);
};
```

</CodeBlock>

## Interactive Components

To make the site feel like a native application, I included a **Command Palette (`Cmd+K`)**. It is completely client-side and indexes the Pinia store. With this feature, visitors can:

1.  Jump between pages.
2.  Search Articles, Notes, and Projects.
3.  Toggle themes.

The palette uses a fuzzy search implementation that filters through the `blogStore` arrays instantaneously.

## SEO & Metadata Management

Single Page Applications often struggle with SEO because the `<head>` is usually static. To solve this without adding the complexity of full Server-Side Rendering (SSR) immediately, I integrated **@unhead/vue**.

This allows every page—whether it's a static route or a dynamic markdown slug—to inject specific metadata, Open Graph tags, and dynamic titles into the DOM.

<CodeBlock fileName="src/pages/posts/[slug].vue">

```javascript
// Dynamic SEO injection based on the loaded markdown file
useHead({
	title: computed(() => postMeta.value?.title),
	meta: [
		{
			name: "description",
			content: computed(() => postMeta.value?.description),
		},
		{
			property: "og:type",
			content: "article",
		},
	],
});
```

</CodeBlock>

This portfolio is a living project.
