import type { BreadcrumbItem } from "@nuxt/ui";
import type { RouteLocationNormalizedLoaded } from "vue-router";

/**
 * Generates a breadcrumb array for Nuxt UI's UBreadcrumb component.
 *
 * This function assumes that all dynamic route segments are slugs,
 * where hyphens (`-`) are converted to spaces and each word is capitalized.
 *
 * @param route - The current route object from useRoute()
 * @returns An array of BreadcrumbItem objects for UBreadcrumb
 *
 * @example
 * // Route: /products/fancy-chair
 * generateBreadcrumb(route)
 * // Returns:
 * // [
 * //   { label: 'Home', to: '/' },
 * //   { label: 'Products', to: '/products' },
 * //   { label: 'Fancy Chair', to: '/products/fancy-chair' }
 * // ]
 */
export function generateBreadcrumb(
	route: RouteLocationNormalizedLoaded
): BreadcrumbItem[] {
	const items: BreadcrumbItem[] = [];
	let pathAccumulator = "";

	const segments = route.path.split("/").filter(Boolean);

	segments.forEach((seg) => {
		pathAccumulator += `/${seg}`;

		const label = seg
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");

		items.push({ label, to: pathAccumulator });
	});

	return items;
}
