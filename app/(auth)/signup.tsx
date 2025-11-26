import { useSignUpMutation } from '@/src/store/services/authApi';
import { useCreateProfileMutation } from '@/src/store/services/profilesApi';
import { Link, router } from 'expo-router'; // Import router
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');

  const [signUpMutation, { isLoading, error }] = useSignUpMutation();
  const [ createProfile ] = useCreateProfileMutation();

  async function onSignUp() {
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedDisplayName = displayName.trim();
    if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
      Alert.alert("Invalid Username", "Username must be between 3 and 30 characters.");
      return;
    }
    try {
      const data = await signUpMutation({ email, password }).unwrap();
      const userId = data?.user?.id;
      if (!userId) {
        throw new Error('User ID not found after sign up');
      }
      await createProfile({ id: userId, username: trimmedUsername, display_name: trimmedDisplayName }).unwrap();

      Alert.alert("Success", "Account created successfully!");
      router.replace('/(auth)/login'); // Navigate to home screen
    }
    catch (err) {
      Alert.alert("Error", "Failed to create account. Please try again.");
    }
  }

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    className="flex-1 bg-white">

    
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-4xl font-bold mb-8 text-center text-blue-500">
        Create Account
      </Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#9ca3af"
        className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 text-base"
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!isLoading}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="#9ca3af"
        className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 text-base"
        secureTextEntry
        editable={!isLoading}
      />
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        placeholderTextColor="#9ca3af"
        className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 text-base"
        editable={!isLoading}
      />
      <TextInput
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Display Name"
        placeholderTextColor="#9ca3af"
        className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 text-base"
        editable={!isLoading}
      />

      <Pressable
        onPress={onSignUp}
        disabled={isLoading}
        className="w-full bg-blue-500 rounded-lg h-12 justify-center items-center mb-4"
      >
        <Text className="text-white text-base font-bold">
          {isLoading ? 'Creating...' : 'Sign up'}
        </Text>
      </Pressable>

      <View className="flex-row justify-center">
        <Text className="text-base text-gray-600">
          Already have an account?{' '}
        </Text>
        <Link href="/(auth)/login" asChild>
          <Pressable>
            <Text className="text-base text-blue-500 font-semibold">
              Login
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
    </KeyboardAvoidingView>
  );
}