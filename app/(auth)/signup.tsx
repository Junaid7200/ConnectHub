import { useSignUpMutation } from '@/src/store/services/authApi';
import { useCreateProfileMutation } from '@/src/store/services/profilesApi';
import { Link, router } from 'expo-router'; // Import router
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [signUpMutation, { isLoading: signingUp, error: signUpError }] = useSignUpMutation();
  const [ createProfile, { isLoading: isCreatingProfile, error: createProfileError} ] = useCreateProfileMutation();

  const isLoading = signingUp || isCreatingProfile;

  async function onSignUp() {
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedDisplayName = displayName.trim();
    const trimmedEmail = email.trim();
    if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
      Alert.alert("Invalid Username", "Username must be between 3 and 30 characters.");
      return;
    }
    try {
      const data = await signUpMutation({ email: trimmedEmail, password }).unwrap();
      const userId = data?.user?.id;
      if (!userId) {
        throw new Error('User ID not found after sign up');
      }
      await createProfile({ id: userId, username: trimmedUsername, display_name: trimmedDisplayName || null }).unwrap();

      const hasSession = !!data?.session;
      Alert.alert("Success", hasSession ? "Signed up and signed in!" : "Account created successfully!");
      if (hasSession) {
        router.replace('/(app)/home');
      } else {
        router.replace('/(auth)/login');
      }
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

      <View className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 flex-row items-center">
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          className="flex-1 text-base"
          secureTextEntry={!showPassword}
          editable={!isLoading}
        />
        <Pressable onPress={() => setShowPassword((p) => !p)} hitSlop={8}>
          {showPassword ? <EyeOff size={20} color="#4B5563" /> : <Eye size={20} color="#4B5563" />}
        </Pressable>
      </View>
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
