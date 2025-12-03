export const useHouseMembersStore = defineStore('houseMembers', () => {
	const client = useSupabaseClient();

	const membersMap = ref<Record<string, any[]>>({});
	const pendingMap = ref<Record<string, boolean>>({});
	const errorMap = ref<Record<string, Error | null>>({});

	async function getHouseMembers(houseCode: string, forceRefresh = false) {
		if (!forceRefresh && membersMap.value[houseCode]?.length) return;
		pendingMap.value[houseCode] = true;
		errorMap.value[houseCode] = null;

		try {
			const { data, error } = await client
				.from('house_users')
				.select(
					'role, house_id, user_id, user:users(full_name), house:houses(user_id)'
				)
				.eq('house_id', houseCode)
				.order('full_name', { referencedTable: 'users', ascending: true });
			if (error) throw error;

			membersMap.value[houseCode] =
				data?.map((row) => ({
					id: row.user_id,
					name: row.user.full_name,
					role: row.role,
					isOwner: row.user_id === row.house.user_id,
				})) ?? [];
		} catch (err: any) {
			errorMap.value[houseCode] = err;
			throw err;
		} finally {
			pendingMap.value[houseCode] = false;
		}
	}

	function reset() {
		membersMap.value = {};
		pendingMap.value = {};
		errorMap.value = {};
	}

	return {
		membersMap,
		pendingMap,
		errorMap,
		getHouseMembers,
		reset,
	};
});
