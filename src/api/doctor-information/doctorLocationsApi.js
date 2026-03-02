import { baseApi } from '../baseApi';

export const doctorLocationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDoctorLocations: builder.query({
      query: (doctorId) => ({
        url: '/Doctors/GetDoctorLocations',
        params: { DoctorID: doctorId },
      }),
      providesTags: (result, error, id) => [{ type: 'DoctorLocations', id }],
    }),

    addLocationToDoctor: builder.mutation({
      query: (locationData) => ({
        url: '/Doctors/AddDoctorLocation',
        method: 'POST',
        body: locationData,
      }),
      invalidatesTags: (result, error, { doctorId }) => [
        { type: 'DoctorLocations', id: doctorId },
      ],
    }),

    updateDoctorLocation: builder.mutation({
      query: (locationData) => ({
        url: '/Doctors/UpdateDoctorLocation',
        method: 'PUT',
        body: locationData,
      }),
      invalidatesTags: (result, error, { locationId, doctorId }) => [
        { type: 'DoctorLocations', id: doctorId },
      ],
    }),

    activateDoctorLocation: builder.mutation({
      query: ({ locationId }) => ({
        url: '/Doctors/ActivateDoctorLocation',
        method: 'GET',
        params: { LocationId: locationId },
      }),
      // optimistic update
      onQueryStarted: async ({ locationId, doctorId }, { dispatch, queryFulfilled }) => {
        // 1. Optimistically update the cache for getDoctorLocations(doctorId)
        const patchResult = dispatch(
          doctorLocationsApi.util.updateQueryData('getDoctorLocations', doctorId, (draft) => {
            const location = draft?.data?.find((loc) => loc.locationID === locationId);
            if (location) {
              location.isActive = true;
            }
          })
        );
        try {
          await queryFulfilled;
          // Optionally, you could update with the exact server response if needed
        } catch {
          patchResult.undo();
        }
      },
      // invalidatesTags: (result, error, { doctorId }) => [
      //   { type: 'DoctorLocations', id: doctorId },
      // ],
    }),

    deactivateDoctorLocation: builder.mutation({
      query: ({ locationId }) => ({
        url: '/Doctors/DeactivateDoctorLocation',
        method: 'GET',
        params: { LocationId: locationId },
      }),
      onQueryStarted: async ({ locationId, doctorId }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          doctorLocationsApi.util.updateQueryData('getDoctorLocations', doctorId, (draft) => {
            const location = draft?.data?.find((loc) => loc.locationID === locationId);
            if (location) {
              location.isActive = false;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      // invalidatesTags: (result, error, { doctorId }) => [
      //   { type: 'DoctorLocations', id: doctorId },
      // ],
    }),

  }),
});

export const {
  useGetDoctorLocationsQuery,
  useAddLocationToDoctorMutation,
  useUpdateDoctorLocationMutation,
  useActivateDoctorLocationMutation,
  useDeactivateDoctorLocationMutation,
} = doctorLocationsApi;