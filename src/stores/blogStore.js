import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useBlogStore = defineStore("blog", () => {
	// ==========================================
	// 1. STATE
	// ==========================================
	const posts = ref([]);
	const projects = ref({});
	const topics = ref({});
	const loading = ref(false);
	const error = ref(null);

	// Filter State
	const searchQuery = ref("");
	const selectedTags = ref([]);
	const activeType = ref("all");

	// ==========================================
	// 2. ACTIONS
	// ==========================================

	const processModules = (modules, type) => {
		return Object.keys(modules).map((path) => {
			const mod = modules[path];
			const filename = path.split("/").pop().replace(/\.md$/, "");

			const metadata = mod.frontmatter ? mod.frontmatter : { ...mod, default: undefined };

			return {
				slug: filename,
				path: path,
				type: type,
				...metadata,
			};
		});
	};

	const loadPosts = async () => {
		if (posts.value.length > 0) return;
		loading.value = true;

		try {
			const topicModules = import.meta.glob("@/markdown/topics/*.md", { eager: true });
			const projectModules = import.meta.glob("@/markdown/projects/*.md", { eager: true });
			const blogModules = import.meta.glob("@/markdown/blog/**/*.md", { eager: true });
			const noteModules = import.meta.glob("@/markdown/notes/**/*.md", { eager: true });

			const rawTopics = processModules(topicModules, "topic");
			const rawProjects = processModules(projectModules, "project");
			const rawBlogs = processModules(blogModules, "blog");
			const rawNotes = processModules(noteModules, "note");

			const topicMap = {};
			const projectMap = {};
			const contentMap = new Map();

			rawTopics.forEach((t) => {
				topicMap[t.slug] = {
					...t,
					projects: [],
					posts: [],
					allItems: [],
				};
			});

			rawProjects.forEach((p) => {
				projectMap[p.slug] = { ...p, posts: [] };
			});

			const allContent = [...rawBlogs, ...rawNotes].sort((a, b) => {
				const da = a.date ? new Date(a.date).getTime() : 0;
				const db = b.date ? new Date(b.date).getTime() : 0;
				return db - da;
			});

			allContent.forEach((post) => {
				contentMap.set(post.slug, post);
			});

			Object.values(projectMap).forEach((proj) => {
				if (proj.topic && topicMap[proj.topic]) {
					topicMap[proj.topic].projects.push(proj);
				}
			});

			allContent.forEach((post) => {
				if (post.project && projectMap[post.project]) {
					projectMap[post.project].posts.push(post);
					post.projectData = {
						title: projectMap[post.project].title,
						slug: post.project,
					};
				}

				if (post.topic && topicMap[post.topic]) {
					topicMap[post.topic].posts.push(post);
					topicMap[post.topic].allItems.push(post);
					post.topicData = {
						title: topicMap[post.topic].title,
						slug: post.topic,
					};
				}

				if (post.topic && topicMap[post.topic]) {
					topicMap[post.topic].posts.push(post);
					topicMap[post.topic].allItems.push(post);
				}

				if (post.related && Array.isArray(post.related)) {
					post.relatedPosts = post.related
						.map((slug) => {
							const found = contentMap.get(slug);
							return found
								? {
										title: found.title,
										slug: found.slug,
										type: found.type,
									}
								: null;
						})
						.filter(Boolean);
				}
			});

			posts.value = allContent;
			projects.value = projectMap;
			topics.value = topicMap;
		} catch (err) {
			console.error("Failed to load content:", err);
			error.value = err.message;
		} finally {
			loading.value = false;
		}
	};

	const toggleTag = (tag) => {
		if (selectedTags.value.includes(tag)) {
			selectedTags.value = selectedTags.value.filter((t) => t !== tag);
		} else {
			selectedTags.value.push(tag);
		}
	};

	const resetFilters = () => {
		searchQuery.value = "";
		selectedTags.value = [];
	};

	// ==========================================
	// 3. GETTERS
	// ==========================================

	const filteredPosts = computed(() => {
		// ... (Same as before)
		return posts.value.filter((post) => {
			if (activeType.value !== "all" && post.type !== activeType.value) return false;
			const matchesSearch = searchQuery.value
				? post.title?.toLowerCase().includes(searchQuery.value.toLowerCase())
				: true;
			const matchesTags = selectedTags.value.length
				? selectedTags.value.every((tag) => post.tags?.includes(tag))
				: true;
			return matchesSearch && matchesTags;
		});
	});

	const allTags = computed(() => {
		const tags = new Set();
		posts.value.forEach((post) => {
			if (post.tags) post.tags.forEach((tag) => tags.add(tag));
		});
		return Array.from(tags).sort();
	});

	const getPost = (slug, type) => {
		return posts.value.find((p) => p.slug === slug && p.type === type);
	};

	return {
		posts,
		projects,
		topics,
		loading,
		searchQuery,
		selectedTags,
		activeType,
		loadPosts,
		toggleTag,
		resetFilters,
		getPost,
		filteredPosts,
		allTags,
	};
});
