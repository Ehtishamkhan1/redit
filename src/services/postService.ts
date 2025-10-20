import { supabase } from "@/lib/supabase";

  export const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, group:groups(*), user:users!posts_user_id_fkey(*)");

    if (error) throw new Error(error.message);
    return data;
  };


    export const fetchPostsById = async (id: string) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, group:groups(*), user:users!posts_user_id_fkey(*)").eq("id", id).single();

    if (error) throw new Error(error.message);
    return data;
  };