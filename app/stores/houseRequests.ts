export const useHouseRequestsStore = defineStore('houseRequests', () => {
	const client = useSupabaseClient();

	const requestsMap = ref<Record<string, any[]>>({});
	const pendingMap = ref<Record<string, boolean>>({});
	const errorMap = ref<Record<string, Error | null>>({});

	async function getHouseRequests(houseCode: string, forceRefresh = false) {
		if (!forceRefresh && requestsMap.value[houseCode]?.length) return;

		pendingMap.value[houseCode] = true;
		errorMap.value[houseCode] = null;

		try {
			const { data, error } = await client
				.from('house_requests')
				.select('house_id, user:users(id, full_name)')
				.eq('house_id', houseCode);
			if (error) throw error;

			requestsMap.value[houseCode] = data ?? [];
		} catch (err: any) {
			errorMap.value[houseCode] = err;
			throw err;
		} finally {
			pendingMap.value[houseCode] = false;
		}
	}

	function reset() {
		requestsMap.value = {};
		pendingMap.value = {};
		errorMap.value = {};
	}

	return {
		requestsMap,
		pendingMap,
		errorMap,
		getHouseRequests,
		reset,
	};
});
