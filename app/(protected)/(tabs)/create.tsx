
import { useSupabase } from "@/lib/supabase";
import { SelectedgroupAtom } from "@/src/components/atoms";
import { AntDesign } from "@expo/vector-icons";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import { useAtom } from "jotai";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";


const insertFunction = async(title:string,body:string,group:string,supabase:any)=>{
      const { data, error } = await supabase
      .from('posts')
      .insert({ title,description:body,group_id:group }).select().single();

    if (error) throw error;
    return data;
}

export default function CreatePostScreen() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [group, setGroup] = useAtom(SelectedgroupAtom);
  const supabase = useSupabase();
   
  const queryCLient=useQueryClient();

const {mutate,data, isPending} = useMutation({
  mutationFn:  () => {
    if (!group){
      throw new Error("No group selected");
    }
    return insertFunction(title,body,group.id,supabase);
  },
  onSuccess: () => {
    console.log(data)
     queryCLient.invalidateQueries({queryKey:["posts"]});
    goBack();
  },
  onError: (error) => {
    console.log(error)
    Alert.alert("Error", error.message);
  }
});

console.log(data)

  const goBack = () => {
    setTitle("");
    setBody("");
    setGroup(null);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <AntDesign
          name="close"
          size={30}
          color="black"
          onPress={() => goBack()}
        />
        <Pressable
          onPress={() => mutate()}
          style={styles.postButton}
          disabled={isPending} 
        >
          <Text style={styles.postText}>{isPending?"Posting...":"post"}</Text>
        </Pressable>
      </View>

      {/* Keyboard handling */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
        >
          {/* Community Selection */}
          <Link href={"/groupSelector"} asChild>
            <Pressable style={styles.communityContainer}>
              {group ? (
                <>
                  <Image
                    source={{ uri: group.image }}
                    style={{ width: 20, height: 20, borderRadius: 10 }}
                  />
                  <Text style={{ fontWeight: 600 }}>{group.name}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.rStyles}>r/</Text>
                  <Text>Select a community</Text>
                </>
              )}
            </Pressable>
          </Link>

          {/* Title Input */}
          <TextInput
            placeholder="Title"
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            multiline
            scrollEnabled={false} // Prevent extra scroll
          />

          {/* Body Input */}
          <TextInput
            placeholder="Body text (Optional)"
            style={styles.bodyInput}
            value={body}
            onChangeText={setBody}
            multiline
            textAlignVertical="top" 
          />
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  postButton: {
    marginLeft: "auto",
  },
  postText: {
    color: "white",
    backgroundColor: "#115bca",
    fontWeight: "bold",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  rStyles: {
    backgroundColor: "black",
    color: "white",
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 10,
    fontWeight: "bold",
  },
  communityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ededed",
    padding: 10,
    borderRadius: 20,
    gap: 5,
    alignSelf: "flex-start",
    marginVertical: 10,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 14,
    minHeight: 50,
  },
  bodyInput: {
    fontSize: 16,
    paddingVertical: 14,
    minHeight: 150,

    borderRadius: 8,
    paddingHorizontal: 10,
  },
});
