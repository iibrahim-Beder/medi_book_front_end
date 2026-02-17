import { baseApi } from '../baseApi';
import { ENDPOINTS } from '../endpoints';

// transformers
import {transformPatientData} from '../transformers';

export const patientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Patient Basic Info
    getPatientBasicInfo: builder.query({
      query: (patientId) => ({
        url: ENDPOINTS.PATIENT.BASIC_INFO,
        params: { PatientId: patientId }
      }),
      transformResponse: (response) => transformPatientData(response),
      providesTags: (result, error, patientId) => [
        { type: 'Patient', id: patientId }
      ],
    }),

    // Update Patient Info
    updatePatientInfo: builder.mutation({
      query: ({ patientId, updates }) => ({
        url: ENDPOINTS.PATIENT.BASIC_INFO,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'Patient', id: patientId }
      ],
    }),

    // Get Multiple Patients
    getMultiplePatients: builder.query({
      query: (patientIds) => ({
        url: ENDPOINTS.PATIENT.BATCH_INFO,
        params: { patientIds: patientIds.join(',') }
      }),
      // Note: You might need to create this endpoint in backend
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetPatientBasicInfoQuery,
  useUpdatePatientInfoMutation,
  useGetMultiplePatientsQuery,
} = patientApi;