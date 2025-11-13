import { Redirect } from 'expo-router';

export default function StartPage() {
  // redirect is same as router.replace
  return <Redirect href="/(auth)/login" />;
}