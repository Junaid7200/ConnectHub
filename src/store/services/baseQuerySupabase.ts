
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

export const supabaseBaseQuery: BaseQueryFn<any> = async (queryPromise) => {
  try {
    const { data, error } = await queryPromise;
    if (error) {
      // Normalize Supabase errors to a serializable shape for RTK Query
      return { error: { message: error.message ?? 'Request failed', status: (error as any).status } };
    }
    return { data };
  } catch (error: any) {
    return { error: { message: error?.message ?? 'Request failed' } };
  }
};
