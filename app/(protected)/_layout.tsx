import { useAuth } from "@clerk/clerk-expo";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Redirect, router, Stack } from "expo-router";
import { View } from "react-native";

export default function Layout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href="/signIn" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="groupSelector" options={{ headerShown: false }} />
      <Stack.Screen
        name="post/[id]"
        options={{
          headerTitle: "",
          headerStyle: { backgroundColor: "#FF5700" },
          headerLeft: () => (
            <AntDesign
              name="close"
              size={27}
              color="white"
              onPress={() => router.back()}
            />
          ),
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <AntDesign name="search1" size={27} color="white" />
              <MaterialIcons name="sort" size={27} color="white" />
            </View>
          ),
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}
