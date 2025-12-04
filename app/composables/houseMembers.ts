export const useHouseMembers = () => {
	const client = useSupabaseClient();
	const lazy = true;
	const server = false;

	function getHouseMembers(houseCode: string) {
		return useAsyncData(
			'members-' + houseCode,
			async () => {
				const { data, error } = await client
					.from('house_users')
					.select(
						'role, house_id, user_id, user:users(full_name), house:houses(user_id)'
					)
					.eq('house_id', houseCode)
					.order('full_name', {
						referencedTable: 'users',
						ascending: true,
					});
				if (error) throw error;
				return data;
			},
			{
				lazy,
				server,
				transform: (data) =>
					data?.map((row) => ({
						id: row.user_id,
						name: row.user.full_name,
						role: row.role,
						isOwner: row.user_id === row.house.user_id,
					})),
				getCachedData(key, nuxtApp, context) {
					if (context.cause.startsWith('refresh')) return undefined;
					return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
				},
			}
		);
	}
	return { getHouseMembers };
};
