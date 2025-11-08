

export const fetchGroups = async ( name: string, supabase: any  ) => {
    const { data, error } = await supabase
        .from("groups")
        .select("*").ilike("name", `%${name}%`);

    if (error) throw new Error(error.message);
    return data;
};