import { Link, router } from 'expo-router'; // Import router
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { supabase } from '../../src/lib/supabase'; // Import supabase

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSignUp() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Sign Up Error', error.message);
    } else {
      // Supabase sends a confirmation email.
      // For this project, we can assume auto-login or just show a message.
      Alert.alert(
        'Success',
        'Account created! Please check your email to confirm.'
      );
      // Send user to the (app) home page after successful signup
      router.replace('/(app)/home'); 
    }
    setLoading(false);
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
        editable={!loading}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="#9ca3af"
        className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 text-base"
        secureTextEntry
        editable={!loading}
      />

      <Pressable
        onPress={onSignUp}
        disabled={loading}
        className="w-full bg-blue-500 rounded-lg h-12 justify-center items-center mb-4"
      >
        <Text className="text-white text-base font-bold">
          {loading ? 'Creating...' : 'Sign up'}
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