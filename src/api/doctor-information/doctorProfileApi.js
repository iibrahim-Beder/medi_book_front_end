import { baseApi } from '../baseApi';

export const doctorProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDoctorProfileAndSpecialties: builder.query({
      query: (doctorId) => ({
        url: '/Doctors/GetDoctorProfileAndSpecialties',
        params: { DoctorID: doctorId },
      }),
      providesTags: (result, error, id) => [{ type: 'DoctorProfile', id }],
    }),

    addProfileAndSpecialties: builder.mutation({
      query: (profileData) => ({
        url: '/Doctors/AddProfileAndSpecialties',
        method: 'POST',
        body: profileData,
      }),
      invalidatesTags: (result, error, { doctorID }) => [
        { type: 'DoctorProfile', id: doctorID },
      ],
    }),
      updateProfileAndSpecialties: builder.mutation({
      query: (profileData) => ({
        url: '/Doctors/UpdateProfileAndSpecialties',
        method: 'POST',
        body: profileData,
      }),
      invalidatesTags: (result, error, { doctorID }) => [
        { type: 'DoctorProfile', id: doctorID },
      ],
    }),
  }),
});

export const {
  useGetDoctorProfileAndSpecialtiesQuery,
  useAddProfileAndSpecialtiesMutation,
  useUpdateProfileAndSpecialtiesMutation
} = doctorProfileApi;