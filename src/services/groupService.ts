import { supabase } from "@/lib/supabase";

export const fetchGroups = async ( name: string  ) => {
    const { data, error } = await supabase
        .from("groups")
        .select("*").ilike("name", `%${name}%`);

    if (error) throw new Error(error.message);
    return data;
};