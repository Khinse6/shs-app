export const pages = ref([
	{
		label: "Home",
		to: "/dashboard",
		icon: "heroicons:home"
	},
	{
		label: "Products",
		to: "/dashboard/products",
		icon: "heroicons:academic-cap",
		children: [
			{
				label: "Rice",
				to: "/dashboard/products/rice"
			},
			{
				label: "Beans",
				to: "/dashboard/products/beans"
			}
		]
	}
]);
