
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

export const supabaseBaseQuery: BaseQueryFn<any> = async (queryPromise) => {
  try {
    const { data, error } = await queryPromise;
    if (error) return { error };
    return { data };
  } catch (error: any) {
    return { error };
  }
};