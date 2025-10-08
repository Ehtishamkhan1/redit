import { tokenCache } from "@/cache";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { Slot } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function RootLayout() {
  const PublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!PublishableKey) {
    throw new Error("Missing PublishableKey");
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={PublishableKey}>
      <ClerkLoaded>
        <KeyboardProvider statusBarTranslucent>
          <Slot />
        </KeyboardProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
