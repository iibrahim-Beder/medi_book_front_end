import { baseApi } from '../baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUserAccount: builder.mutation({
      query: (userData) => ({
        url:'/Auth/CreateUserAccount' ,
        method: 'POST',
        body: userData,
      }),

    }),
  }),
});

export const {
  useCreateUserAccountMutation,
} = authApi;