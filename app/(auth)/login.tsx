import { Link } from 'expo-router'; // Import router
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { supabase } from '../../src/lib/supabase'; // Import supabase

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    setLoading(true);
    
    // Call the Supabase login function
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Login Error', error.message);
    } else {
      // 'replace' instead of push to prevent going back to login
      // router.replace('/(app)/home');
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white">
    {/* view is same as div with flex-col from react */}
    <View className="flex-1 justify-center p-6 bg-white">
      {/* text is same as p or h1 tags etc */}
      <Text className="text-4xl font-bold mb-8 text-center text-blue-500">
        ConnectHub
      </Text>

      <Text className="text-lg font-semibold mb-2">Login</Text>

      {/* Email Input, same as input tag in a form with type=email */}
      <TextInput
      // calue, placeholder, and className are same as in react, onChange is now onChangeText, placeholderTextColor is kinda new, autoCapitalize is new, keyboardType is type from react
        value={email}
        placeholder="Email"
        onChangeText={setEmail} // pass by reference just like in react
        placeholderTextColor="#9ca3af"
        className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 text-base"
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
      />

      {/* Password Input */}
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="#9ca3af"
        className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 text-base"
        secureTextEntry // same as type="password"
        editable={!loading} // same as disabled in react
      />

      {/* Login Button: in RN, we use pressable instead of button or a div with an onClick, and they have an OnPress prop */}
      <Pressable
        onPress={onLogin}
        disabled={loading}
        className="w-full bg-blue-500 rounded-lg h-12 justify-center items-center mb-4"
      >
        <Text className="text-white text-base font-bold">
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </Pressable>

      {/* Sign Up Link */}
      <View className="flex-row justify-center">
        <Text className="text-base text-gray-600">
          Don't have an account?{' '} {/*text component can't have raw space so just use {' '} to make space*/}
        </Text>
        {/* asChild makes the child component (Pressable) behave like a link */}
        <Link href="/(auth)/signup" asChild> 
          <Pressable>
            <Text className="text-base text-blue-500 font-semibold">
              Sign up
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
    </KeyboardAvoidingView>
  );
}