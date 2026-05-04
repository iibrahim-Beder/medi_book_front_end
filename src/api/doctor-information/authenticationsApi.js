import { baseApi } from '../baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUserAccount: builder.mutation({
      query: (userData) => ({
        url: '/Auth/CreateUserAccount',
        method: 'POST',
        body: userData,
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: '/Auth/LoginWithEmailAndPassWord',
        method: 'POST',
        body: credentials,
      }),

      // why: extract only useful data
      transformResponse: (response) => {
        return {
          ...response,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        };
      },
    }),
  }),
});

export const {
  useCreateUserAccountMutation,
  useLoginMutation,
} = authApi;