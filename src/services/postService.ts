

  export const fetchPosts = async (supabase: any) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, group:groups(*)").order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  };


    export const fetchPostsById = async (id: string, supabase: any) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, group:groups(*), upvotes(value.sum())").eq("id", id).single();

    if (error) throw new Error(error.message);
    return data;
  };


 export const deletePostById = async (id: string, supabase: any) => {
    const { data, error } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return data;
  };