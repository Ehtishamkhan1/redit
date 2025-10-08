import Comments from "@/assets/data/comments.json";
import posts from "@/assets/data/posts.json";
import CommentsListItem from "@/src/components/CommentsListItem";
import PostListItem from "@/src/components/PostListItem";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import KeyboardStickyView from "@/src/components/KeyboardStickyView";

export default function PostDetailed() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [comment, setComment] = useState("");
  const inputRef = useRef<TextInput>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const detailedPost = posts.find((post) => post.id === id);
  const postComments = Comments.filter(
    (comment) => comment.post_id === detailedPost?.id
  );

  if (!detailedPost) {
    return <Text>Post Not Found!</Text>;
  }
  const handleReplyPress = useCallback((commentId: string) => {
    console.log("Reply button pressed", commentId);
    setIsInputFocused(true);
    inputRef.current?.focus();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={postComments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CommentsListItem
            comment={item}
            depth={0}
            handleReplyPress={handleReplyPress}
          />
        )}
        ListHeaderComponent={
          <PostListItem post={detailedPost} isDetailedPost />
        }
        contentContainerStyle={{ paddingBottom: 80 }}
        keyboardShouldPersistTaps="always"
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
          <Pressable
            style={styles.postButton}
            onPress={() => {
              console.log("Posting:", comment);
              setComment("");
              inputRef.current?.blur();
            }}
          >
            <Text style={{ color: "#fff" }}>Post</Text>
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
  },
  postButton: {
    backgroundColor: "#FF5700",
    padding: 10,
    borderRadius: 10,
  },
});
