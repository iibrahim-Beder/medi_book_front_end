import { baseApi } from '../baseApi';

export const doctorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create doctor (basic info step)
    addDoctorBasicInfo: builder.mutation({
      query: (doctorData) => ({
        url: '/Doctors/AddDoctorBasicInfo', 
        method: 'POST',
        body: doctorData,
      }),
      invalidatesTags: [{ type: 'Doctor', id: 'LIST' }],
      transformResponse: (response, meta, arg) => {
        console.log('Add Doctor Basic Info Response:', response);
        return response;
      },
      transformErrorResponse: (response, meta, arg) => {
        console.log('Add Doctor Basic Info Error Response:', response);
        return response;
      },
    
    }),   

    // Get doctor basic info
    getDoctorBasicInfo: builder.query({
      query: (doctorId) => ({
        url: '/Doctors/GetDoctorBasicInfo',
        params: { DoctorID: doctorId },
      }),
      providesTags: (result, error, id) => [{ type: 'Doctor', id }],
    }),

    // Update doctor basic info
    updateDoctorBasicInfo: builder.mutation({
      query: ({ doctorId, ...data }) => ({
        url: '/Doctors/UpdateDoctorBasicInfo',
        method: 'PUT',
        body: { doctorId, ...data },
      }),
      invalidatesTags: (result, error, { doctorId }) => [{ type: 'Doctor', id: doctorId }],
    }),
  }),
});

export const {
  useAddDoctorBasicInfoMutation,
  useLazyGetDoctorBasicInfoQuery,
  useGetDoctorBasicInfoQuery,
  useUpdateDoctorBasicInfoMutation,
} = doctorApi;