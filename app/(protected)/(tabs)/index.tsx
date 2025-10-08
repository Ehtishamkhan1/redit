import PostListItem from "@/src/components/PostListItem";
import React from "react";
import { FlatList, View } from "react-native";

import post from "@/assets/data/posts.json";

export default function HomePage() {
  return (
    <View>
      <FlatList
        data={post}
        renderItem={({ item }) => <PostListItem post={item} />}
      />
    </View>
  );
}
