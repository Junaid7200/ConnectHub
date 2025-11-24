import { Redirect } from 'expo-router';

import { useAppSelector } from '@/src/hooks/useRedux';

export default function StartPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return <Redirect href={isAuthenticated ? '/(app)/home' : '/(auth)/login'} />;
}
