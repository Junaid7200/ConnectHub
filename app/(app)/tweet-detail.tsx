import TweetDetailScreen from '@/src/components/screens/TweetDetailScreen';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';

export default function TweetDetailRoute() {
  const params = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!params.variant) {
      router.setParams({ variant: 'other' });
    }
  }, [params.variant, router]);

  return <TweetDetailScreen />;
}
