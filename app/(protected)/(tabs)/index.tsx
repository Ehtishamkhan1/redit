import React from "react";
import { FlatList, View, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import PostListItem from "@/src/components/PostListItem";

export default function HomePage() {

  // Define your fetch function (must return data or throw error)
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, group:groups(*), user:users!posts_user_id_fkey(*)");

    if (error) throw new Error(error.message);
    return data;
  };

  // Use TanStack Query to fetch and cache data
  const {
    data: posts,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["posts"], // unique cache key
    queryFn: fetchPosts, // function to run
  });

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error fetching posts 😢</Text>
      </View>
    );
  }

  // Success: render FlatList
  return (
    <View className="flex-1">
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostListItem post={item} />}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={refetch}
        refreshing={isLoading}
      />
    </View>
  );
}
