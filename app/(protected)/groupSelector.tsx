import group from "@/assets/data/groups.json";
import { SelectedgroupAtom } from "@/src/components/atoms";
import { fetchGroups } from "@/src/services/groupService";
import { AntDesign } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useSetAtom } from "jotai";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GroupSelector = () => {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = React.useState<string>("");
  const setGroup = useSetAtom(SelectedgroupAtom);

  const {data,isLoading,error}=useQuery({
    queryKey: ["groups",{search}],
    queryFn: () => fetchGroups(search), 
    staleTime: 10000,
    placeholderData: (previousData)=> previousData
  });



  const onSelectGroup = (group: any) => {
    setGroup(group);
    router.back();
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        <Text>Loading...</Text>
      </View>
    );
  }


  

  if (error) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        <Text>Error: {error.message}</Text>
      </View>
    );
  }


  //   const filteredData = data?.filter((item) =>
  //   item.name.toLowerCase().includes(search.toLowerCase())
  // );


  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <AntDesign
          name="close"
          size={24}
          color="black"
          onPress={() => router.back()}
        />
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
          }}
        >
          Post to
        </Text>
      </View>

      {/* search bar */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "lightgrey",
          alignItems: "center",
          gap: 5,
          borderRadius: 10,
          paddingHorizontal: 10,
          width: "98%",
          alignSelf: "center",
        }}
      >
        <AntDesign name="search1" size={24} color="grey" />
        <TextInput
          placeholder="Search for communities"
          placeholderTextColor={"grey"}
          style={{ paddingVertical: 10, flex: 1 }}
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
        {search.length > 0 && (
          <AntDesign
            name="close"
            size={24}
            color="black"
            onPress={() => setSearch("")}
          />
        )}
      </View>

      {/* render data */}
      <FlatList
        data={data}
        style={{ marginTop: 10 }}
        renderItem={({ item }) => (
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
              width: "98%",
              alignSelf: "center",
            }}
            onPress={() => onSelectGroup(item)}
          >
            <Image
              source={{ uri: item.image }}
              style={{ width: 40, aspectRatio: 1 }}
            />
            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
});

export default GroupSelector;
