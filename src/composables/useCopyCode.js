import { ref } from "vue";

export function useCopyCode() {
	const isCopied = ref(false);

	const copyToClipboard = async (text) => {
		if (!text) return;

		try {
			await navigator.clipboard.writeText(text);
			isCopied.value = true;

			// Reset after 2 seconds
			setTimeout(() => {
				isCopied.value = false;
			}, 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	return {
		isCopied,
		copyToClipboard,
	};
}
