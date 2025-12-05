export const useHouse = () => {
	const client = useSupabaseClient();
	const { data: houses } = useNuxtData('houses');
	const lazy = true;
	const server = false;

	function getHouses() {
		return useAsyncData(
			'houses',
			async () => {
				const { data, error } = await client
					.from('houses')
					.select(
						'id, user_id, user_house_settings(house_display_name), owner:houses_user_id_fkey(full_name)'
					)
					.order('house_display_name', {
						referencedTable: 'user_house_settings',
						ascending: false,
					});
				if (error) throw error;
				return data;
			},
			{
				lazy,
				server,
				transform: (data) =>
					data
						?.map((row) => ({
							id: row.id,
							owner: row.owner.full_name,
							displayName: row.user_house_settings?.[0]?.house_display_name,
						}))
						.sort((a, b) => {
							if (!a.displayName) return -1;
							if (!b.displayName) return 1;
							return a.displayName.localeCompare(b.displayName);
						}),

				getCachedData(key, nuxtApp, context) {
					if (context.cause.startsWith('refresh')) return undefined;
					return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
				},
			}
		);
	}

	async function createHouse(displayName: string) {
		const { error } = await client.rpc('create_house', {
			display_name: displayName,
		});
		if (error) return error;

		await refreshNuxtData('houses');
	}

	const housePages = computed(
		() =>
			houses.value?.map((row: any) => ({
				label: row.displayName,
				to: '/dashboard/houses/' + row.id,
			})) ?? []
	);

	return {
		getHouses,
		createHouse,
		housePages,
	};
};
