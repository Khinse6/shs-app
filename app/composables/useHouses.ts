import type { HouseWithCode, MemberInfo } from "~/types/database.dto";

export default function useHouses() {
	const client = useSupabaseClient();
	const user = useSupabaseUser();

	const memberId = computed(() => user.value?.id);
	const houses = ref<HouseWithCode[]>([]);
	const houseMembers = ref<MemberInfo[]>([]);
	const loading = ref(false);
	const error = ref<Error | null>(null);

	const handleError = (e: unknown) => {
		error.value = e instanceof Error ? e : new Error(String(e));
		console.error("House composable error:", e);
	};

	async function getHouses() {
		if (!memberId.value) return;
		if (houses.value.length > 0) return;

		loading.value = true;
		error.value = null;

		try {
			const { data, error: err } = await client
				.from("house_members")
				.select("name, houses(id, code)")
				.eq("member_id", memberId.value)
				.order("name", { ascending: true });

			if (err) throw err;

			houses.value =
				data?.map((row) => ({
					id: row.houses?.id ?? "",
					code: row.houses?.code ?? "",
					name: row.name || "House"
				})) ?? [];
		} catch (e) {
			handleError(e);
		} finally {
			loading.value = false;
		}
	}

	async function getHouseMembers(houseId: string) {
		if (!houseId) return;
		if (houseMembers.value.length > 0) return;

		loading.value = true;
		error.value = null;

		try {
			const { data, error: err } = await client
				.from("house_members")
				.select("members(id, full_name)")
				.eq("house_id", houseId)
				.order("full_name", { foreignTable: "members", ascending: true });

			if (err) throw err;

			houseMembers.value =
				data
					?.flatMap((row) => (row.members ? [row.members] : []))
					.filter((m): m is MemberInfo => m !== null) ?? [];
		} catch (e) {
			handleError(e);
			houseMembers.value = [];
		} finally {
			loading.value = false;
		}
	}

	async function createHouse(nickname?: string) {
		if (!memberId.value) {
			error.value = new Error("User not authenticated");
			return;
		}

		loading.value = true;
		error.value = null;

		try {
			const { data: code, error: codeError } = await client.rpc(
				"generate_hex_code"
			);
			if (!code || codeError) throw codeError;

			const { data: houseData, error: houseError } = await client
				.from("houses")
				.insert({ code })
				.select()
				.single();

			if (!houseData || houseError) throw houseError;

			const { error: memberError } = await client.from("house_members").insert({
				house_id: houseData.id,
				member_id: memberId.value,
				name: nickname || code
			});

			if (memberError) throw memberError;

			houses.value.push({
				id: houseData.id,
				code,
				name: nickname || code
			});
		} catch (e) {
			handleError(e);
		} finally {
			loading.value = false;
		}
	}

	async function joinHouse(code: string, nickname?: string) {
		if (!memberId.value) {
			error.value = new Error("User not authenticated");
			return;
		}

		loading.value = true;
		error.value = null;

		try {
			const { data: houseData, error: houseError } = await client
				.from("houses")
				.select("id, code")
				.eq("code", code)
				.single();

			if (!houseData || houseError) throw new Error("House not found");

			const { data: existing } = await client
				.from("house_members")
				.select("id")
				.eq("house_id", houseData.id)
				.eq("member_id", memberId.value)
				.maybeSingle();

			if (existing) {
				throw new Error("Already a member of this house");
			}

			const { error: memberError } = await client.from("house_members").insert({
				house_id: houseData.id,
				member_id: memberId.value,
				name: nickname || code
			});

			if (memberError) throw memberError;

			await refreshHouses();
		} catch (e) {
			handleError(e);
		} finally {
			loading.value = false;
		}
	}

	async function leaveHouse(houseId: string) {
		if (!memberId.value) return;

		loading.value = true;
		error.value = null;

		try {
			const { error: deleteError } = await client
				.from("house_members")
				.delete()
				.eq("house_id", houseId)
				.eq("member_id", memberId.value);

			if (deleteError) throw deleteError;

			houses.value = houses.value.filter((h) => h.id !== houseId);
		} catch (e) {
			handleError(e);
		} finally {
			loading.value = false;
		}
	}

	async function refreshHouses() {
		houses.value = [];
		await getHouses();
	}

	watch(
		memberId,
		(newId) => {
			if (newId && houses.value.length === 0) {
				getHouses();
			}
		},
		{ immediate: true }
	);

	return {
		houses: readonly(houses),
		houseMembers: readonly(houseMembers),
		loading: readonly(loading),
		error: readonly(error),
		getHouses,
		getHouseMembers,
		createHouse,
		joinHouse,
		leaveHouse,
		refreshHouses
	};
}
