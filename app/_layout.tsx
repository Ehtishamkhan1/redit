import { tokenCache } from "@/cache";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { Slot } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { QueryClient , QueryClientProvider } from '@tanstack/react-query'
import { useReactQueryDevTools } from '@dev-plugins/react-query';

  const queryClient= new QueryClient();
export default function RootLayout() {
  const PublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

   useReactQueryDevTools(queryClient);



  if (!PublishableKey) {
    throw new Error("Missing PublishableKey");
  }

  return (
    <QueryClientProvider client={queryClient}>
    <ClerkProvider tokenCache={tokenCache} publishableKey={PublishableKey}>
      <ClerkLoaded>
        <KeyboardProvider statusBarTranslucent>
          <Slot />
        </KeyboardProvider>
      </ClerkLoaded>
    </ClerkProvider>
    </QueryClientProvider>
  );
}
