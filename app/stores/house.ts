export const useHouseStore = defineStore('house', () => {
	const client = useSupabaseClient();

	const houses = ref<any[]>([]);
	const housesPending = ref(false);
	const housesError = ref<Error | null>(null);

	async function getHouses(forceRefresh = false) {
		if (!forceRefresh && houses.value.length) return;

		housesPending.value = true;
		housesError.value = null;

		try {
			const { data, error } = await client
				.from('houses')
				.select(
					'id, user_id, settings:user_house_settings(house_display_name), owner:houses_user_id_fkey(full_name)'
				);
			if (error) throw error;

			houses.value =
				data?.map((row) => ({
					id: row.id,
					owner: row.owner.full_name,
					displayName: row.settings[0]?.house_display_name,
				})) ?? [];
		} catch (err: any) {
			housesError.value = err;
			throw err;
		} finally {
			housesPending.value = false;
		}
	}

	async function createHouse(displayName: string) {
		const { error } = await client.rpc('create_house', {
			display_name: displayName,
		});
		if (error) throw error;
		await getHouses(true);
	}

	function reset() {
		houses.value = [];
		housesPending.value = false;
		housesError.value = null;
	}

	return {
		houses,
		housesPending,
		housesError,
		getHouses,
		createHouse,
		reset,
	};
});
