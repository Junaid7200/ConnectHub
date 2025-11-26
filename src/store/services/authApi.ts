import { signIn, signOut, signUp } from "@/src/lib/auth";
import { createApi } from "@reduxjs/toolkit/query/react";
import { supabaseBaseQuery } from "./baseQuerySupabase";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: supabaseBaseQuery,
    endpoints: (builder) => ({
        signIn: builder.mutation({
            query: ({ email, password }: { email: string; password: string }) =>
                signIn(email, password),
        }),
        signOut: builder.mutation({
            query: () => signOut(),
        }),
        signUp: builder.mutation({
            query: ({email, password}: {email: string, password: string}) =>
                signUp(email, password),
        })
    })
});

export const { useSignInMutation, useSignOutMutation } = authApi;