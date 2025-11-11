import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignUp = () => {
    // We will add Supabase auth logic here
    Alert.alert("Sign Up Pressed", `Email: ${email}`);
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-4xl font-bold mb-8 text-center text-blue-500">
        Create Account
      </Text>

      {/* Email Input */}
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#9ca3af"
        className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 text-base"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* Password Input */}
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="#9ca3af"
        className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 text-base"
        secureTextEntry
      />

      {/* Sign Up Button */}
      <Pressable
        onPress={onSignUp}
        className="w-full bg-blue-500 rounded-lg h-12 justify-center items-center mb-4"
      >
        <Text className="text-white text-base font-bold">Sign up</Text>
      </Pressable>

      {/* Login Link */}
      <View className="flex-row justify-center">
        <Text className="text-base text-gray-600">
          Already have an account?{" "}
        </Text>
        <Link href="/(auth)/login" asChild>
          <Pressable>
            <Text className="text-base text-blue-500 font-semibold">Login</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
