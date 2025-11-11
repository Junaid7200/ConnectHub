import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = () => {
    // We will add Supabase auth logic here
    Alert.alert('Login Pressed', `Email: ${email}`);
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-4xl font-bold mb-8 text-center text-blue-500">
        ConnectHub
      </Text>

      <Text className="text-lg font-semibold mb-2">Login</Text>

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
        secureTextEntry // This hides the password
      />

      {/* Login Button */}
      <Pressable
        onPress={onLogin}
        className="w-full bg-blue-500 rounded-lg h-12 justify-center items-center mb-4"
      >
        <Text className="text-white text-base font-bold">Login</Text>
      </Pressable>

      {/* Sign Up Link */}
      <View className="flex-row justify-center">
        <Text className="text-base text-gray-600">
          Don't have an account?{' '}
        </Text>
        <Link href="/(auth)/signup" asChild>
          <Pressable>
            <Text className="text-base text-blue-500 font-semibold">
              Sign up
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}