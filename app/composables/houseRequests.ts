export const useHouseRequests = () => {
	const client = useSupabaseClient();
	const lazy = true;
	const server = false;

	function getHouseRequests(houseCode: string) {
		return useAsyncData(
			'requests-' + houseCode,
			async () => {
				const { data, error } = await client
					.from('house_requests')
					.select('house_id, user:users(id, full_name)')
					.eq('house_id', houseCode);
				if (error) throw error;
				return data;
			},
			{
				lazy,
				server,
				transform: (data) =>
					data.map((row) => ({
						house_id: row.house_id,
						user_id: row.user.id,
						full_name: row.user.full_name,
					})),
				getCachedData(key, nuxtApp, context) {
					if (context.cause.startsWith('refresh')) return undefined;
					return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
				},
			}
		);
	}

	return {
		getHouseRequests,
	};
};
