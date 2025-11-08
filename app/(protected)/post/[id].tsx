import React, { useCallback, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

import Comments from "@/assets/data/comments.json";
import posts from "@/assets/data/posts.json";
import CommentsListItem from "@/src/components/CommentsListItem";
import PostListItem from "@/src/components/PostListItem";
import KeyboardStickyView from "@/src/components/KeyboardStickyView";
import { fetchPostsById } from "@/src/services/postService";
import { useSupabase } from "@/lib/supabase";

export default function PostDetailed() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();
  const [comment, setComment] = useState("");
  const inputRef = useRef<TextInput>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const supabase = useSupabase();


  if (!id) {
    return <Text>Loading...</Text>;
  }

  
  const { data: detailedPost, isLoading, isError } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPostsById(id,supabase),
  });

  const handleReplyPress = useCallback((commentId: string) => {
    console.log("Reply button pressed", commentId);
    setIsInputFocused(true);
    inputRef.current?.focus();
  }, []);

  const handlePostComment = useCallback(() => {
    if (!comment.trim()) return;
    console.log("Posting comment:", comment);
    setComment("");
    inputRef.current?.blur();
  }, [comment]);

  if (isLoading) {
    return <Text>Loading post...</Text>;
  }

  if (isError || !detailedPost) {
    return <Text>Post Not Found!</Text>;
  }

  const postComments = Comments.filter(
    (comment) => comment.post_id === detailedPost.id
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={postComments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CommentsListItem
            comment={item}
            depth={0}
            handleReplyPress={handleReplyPress}
            
          />
        )}
        ListHeaderComponent={<PostListItem post={detailedPost} isDetailedPost />}
        contentContainerStyle={{ paddingBottom: 80 }}
        keyboardShouldPersistTaps="handled"
      />

      <KeyboardStickyView>
        <View
          style={[
            styles.inputContainer,
            { paddingBottom: insets.bottom || 10 },
          ]}
        >
          <TextInput
            ref={inputRef}
            placeholder="Write a comment..."
            style={styles.input}
            value={comment}
            onChangeText={setComment}
            multiline
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />
          <Pressable style={styles.postButton} onPress={handlePostComment}>
            <Text style={styles.postButtonText}>Post</Text>
          </Pressable>
        </View>
      </KeyboardStickyView>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    flex: 0.9,
    minHeight: 40,
    textAlignVertical: "top",
  },
  postButton: {
    backgroundColor: "#FF5700",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
