import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import Markdown from "unplugin-vue-markdown/vite";
import anchor from "markdown-it-anchor";
import tailwindcss from "@tailwindcss/vite";
import Shiki from "@shikijs/markdown-it";
import matter from "gray-matter";
import { transformerMetaHighlight } from "@shikijs/transformers";

// Import Node.js filesystem tools to scan for files
import fs from "node:fs";
import path from "node:path";

// Helper to calculate minutes
function getReadingTime(content) {
	const wordsPerMinute = 200;
	const words = content.match(/\w+/g)?.length || 0;
	return Math.ceil(words / wordsPerMinute) || 1;
}

export default defineConfig({
	plugins: [
		{
			name: "auto-read-time",
			enforce: "pre", // Run before Vue compiles the markdown
			transform(code, id) {
				if (!id.endsWith(".md")) return;

				// Parse frontmatter
				const file = matter(code);
				// Calculate time from the raw content body
				const minutes = getReadingTime(file.content);

				// Reconstruct the file with the new readTime field
				return code.replace(/^---/, `---\nreadTime: ${minutes}`);
			},
		},
		vue({
			include: [/\.vue$/, /\.md$/],
		}),
		vueDevTools(),
		tailwindcss(),
		Markdown({
			// Enable frontmatter
			frontmatter: true,

			// Configure wrapper class
			wrapperClasses: "prose-tech",
			async: true,

			MarkdownItOptions: {
				html: true,
				linkify: true,
				typographer: true,
			},

			headEnabled: true,

			async markdownItSetup(md) {
				// Anchor links setup
				md.use(anchor, {
					permalink: anchor.permalink.linkInsideHeader({
						symbol: "#",
						placement: "before",
						class: "header-anchor",
					}),
					level: [2, 3],
					slugify: (s) =>
						String(s)
							.trim()
							.toLowerCase()
							.replace(/\s+/g, "-")
							.replace(/[^\w\-]+/g, "") // Remove non-word chars (emojis, punctuation)
							.replace(/\-\-+/g, "-") // Replace multiple dashes with single
							.replace(/^-+/, "") // Trim starting dash
							.replace(/-+$/, ""), // Trim ending dash
				});

				// Shiki Setup for Dual Themes
				md.use(
					await Shiki({
						themes: {
							light: "github-light",
							dark: "github-dark",
						},
						// This prevents Shiki from forcing a background color style on the <pre>,
						// allowing your CSS/Tailwind to control the background if needed.
						defaultColor: false,

						// Adds a prefix to CSS variables
						cssVariablePrefix: "--s-",

						transformers: [
							transformerMetaHighlight(), // Enables // [!code highlight]
							{
								// Custom transformer to ensure every line has class="line"
								// This is required for CSS Line Numbers
								name: "add-line-class",
								code(node) {
									// The root node of the code block is 'pre', its child is 'code'
									// We want to apply classes to the children of 'code' (the lines)
									node.children.forEach((child) => {
										if (child.type === "element" && child.tagName === "span") {
											// Shiki usually outputs spans for lines, ensure they have class 'line'
											if (!child.properties.class)
												child.properties.class = "";
											if (!child.properties.class.includes("line")) {
												child.properties.class += " line";
											}
										}
									});
								},
								// // Force splitting into lines if Shiki doesn't do it by default for your language
								// preprocess(code) {
								// 	// This ensures strict line breaking for the transformer to work on
								// 	return code.endsWith("\n") ? code : `${code}\n`;
								// },
							},
						],
					}),
				);
			},
		}),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	// SSG Config
	ssgOptions: {
		script: "async",
		formatting: "minify",
		// This function tells Vite-SSG which routes to build
		includedRoutes(paths, routes) {
			// Default routes (home, projects index, etc.)
			const staticRoutes = paths.filter((p) => !p.includes(":") && !p.includes("404"));

			const extraRoutes = [];

			// Scan for Projects
			const projectsDir = path.resolve(__dirname, "./src/markdown/projects");
			if (fs.existsSync(projectsDir)) {
				const files = fs.readdirSync(projectsDir);
				files.forEach((file) => {
					if (file.endsWith(".md")) {
						const slug = file.replace(".md", "");
						extraRoutes.push(`/projects/${slug}`);
					}
				});
			}

			// Scan for Blogs
			const blogDir = path.resolve(__dirname, "./src/markdown/blog");
			// Note: Depending on your folder structure you might need recursive scanning
			// This is a simple scan assuming flat files for brevity
			if (fs.existsSync(blogDir)) {
				const files = fs.readdirSync(blogDir);
				files.forEach((file) => {
					if (file.endsWith(".md")) {
						const slug = file.replace(".md", "");
						extraRoutes.push(`/blog/${slug}`);
					}
				});
			}

			// Scan for Notes
			const notesDir = path.resolve(__dirname, "./src/markdown/notes");
			if (fs.existsSync(notesDir)) {
				const files = fs.readdirSync(notesDir);
				files.forEach((file) => {
					if (file.endsWith(".md")) {
						const slug = file.replace(".md", "");
						extraRoutes.push(`/notes/${slug}`);
					}
				});
			}

			// Scan for Topics
			const topicsDir = path.resolve(__dirname, "./src/markdown/topics");
			if (fs.existsSync(topicsDir)) {
				const files = fs.readdirSync(topicsDir);
				files.forEach((file) => {
					if (file.endsWith(".md")) {
						const slug = file.replace(".md", "");
						extraRoutes.push(`/topics/${slug}`);
					}
				});
			}

			return [...staticRoutes, ...extraRoutes, "/404"];
		},
	},
});
