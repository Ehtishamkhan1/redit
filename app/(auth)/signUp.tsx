import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as React from "react";
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // ✅ Handle sign-up
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      // Create sign-up with email and password only
      await signUp.create({
        emailAddress,
        password,
        // Store username as metadata (NOT as sign-in identifier)
        unsafeMetadata: {
          displayName: username,
        },
      });

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error("SignUp Error:", JSON.stringify(err, null, 2));

      if (err.errors && err.errors.length > 0) {
        Alert.alert(
          "Sign Up Error",
          err.errors[0].longMessage || "Something went wrong"
        );
      } else {
        Alert.alert("Sign Up Error", "Unknown error occurred");
      }
    }
  };

  // ✅ Handle verification
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/"); // Redirect to home
      } else {
        console.error(
          "Verification incomplete:",
          JSON.stringify(signUpAttempt, null, 2)
        );
      }
    } catch (err: any) {
      console.error("Verification Error:", JSON.stringify(err, null, 2));
      Alert.alert(
        "Verification Error",
        "Invalid or expired code. Please try again."
      );
    }
  };

  if (pendingVerification) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>Verify Your Email</Text>
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter verification code"
          placeholderTextColor="#aaa"
          onChangeText={setCode}
        />
        <Button title="Verify" onPress={onVerifyPress} />
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#aaa"
        onChangeText={setEmailAddress}
      />
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={username}
        placeholder="Enter username"
        placeholderTextColor="#aaa"
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Continue" onPress={onSignUpPress} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
});
