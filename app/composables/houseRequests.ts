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
				getCachedData(key, nuxtApp, context) {
					if (context.cause.startsWith('refresh')) return undefined;
					return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
				},
			}
		);
	}

	async function createHouseRequest(displayName: string, houseCode: string) {
		return client.rpc('create_request', {
			p_display_name: displayName,
			p_house_id: houseCode,
		});
	}

	async function approveHouseRequest(userId: string, houseCode: string) {
		return client.rpc('approve_house_request', {
			p_user_id: userId,
			p_house_id: houseCode,
		});
	}

	async function declineHouseRequest(userId: string, houseCode: string) {
		return client
			.from('house_requests')
			.delete()
			.eq('user_id', userId)
			.eq('house_id', houseCode);
	}
	return {
		getHouseRequests,
		createHouseRequest,
		approveHouseRequest,
		declineHouseRequest,
	};
};
