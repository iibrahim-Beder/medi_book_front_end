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

    getDoctorPatients: builder.query({
      query: ({ 
        doctorId, 
        filter = {}, 
        orderBy, 
        pageNumber = 1, 
        pageSize = 10 
      }) => {
        const params = {
          DoctorId: 1,
          ...(filter.searchText && { 'SearchValue': filter.searchText }),
          ...(filter.fromDate && { 'StartDate': filter.fromDate }),
          ...(filter.toDate && { 'EndDate': filter.toDate }),
          ...(pageNumber && { 'PageNumber': pageNumber }),
          ...(pageSize && { 'PageSize': pageSize })
        };

        console.log('Doctor patients API Request Params:', params);

        return {
          url: '/Patient/GetPatientsOverviewForWeb',
          params,
          timeout: 10000
        };
      },
      transformResponse: (response, meta, args) => {
        console.log('Doctor doctor patients API Response:', response);
        return response;
      },
      transformErrorResponse: (response, meta, args) => {
        console.error('Doctor doctor patients API Error:', response);
        return response;
      },
      providesTags: (result, error, { patientId }) => [
        { type: 'doctorPatients', id: patientId }
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
  useGetDoctorPatientsQuery,
  useUpdatePatientInfoMutation,
  useGetMultiplePatientsQuery,
} = patientApi;