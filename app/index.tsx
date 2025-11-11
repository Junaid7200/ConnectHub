import { Redirect } from 'expo-router';

export default function StartPage() {
  // For now, we always redirect to the login page.
  // Later, we will add logic here to check if the user
  // is already logged in.
  return <Redirect href="/(auth)/login" />;
}