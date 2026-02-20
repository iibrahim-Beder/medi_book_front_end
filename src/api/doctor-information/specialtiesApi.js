import { baseApi } from '../baseApi';

export const specialtiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpecialties: builder.query({
      query: () => '/Speciality/List',
      providesTags: ['Specialty'],
    }),
  }),
});

export const { useGetSpecialtiesQuery } = specialtiesApi;