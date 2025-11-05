import React, { useCallback } from "react";
import { FlatList, View, ActivityIndicator, Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native"; // 👈 important
import PostListItem from "@/src/components/PostListItem";
import { fetchPosts } from "@/src/services/postService";

export default function HomePage() {

  const {
    data: posts,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 3, 
  });


  // useFocusEffect(
  //   useCallback(() => {
  //     refetch();
  //   }, [refetch])
  // );

  // 🌀 Loading state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 💥 Error state
  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error fetching posts 😢</Text>
      </View>
    );
  }

  // 🏡 Main UI
  return (
    <View className="flex-1">
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostListItem post={item} />}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={refetch}
        refreshing={isFetching} // use isFetching to show spinner when refetching
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}
