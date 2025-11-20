// patientDiagnosesApi.js
import { baseApi } from './baseApi';

const transformDiagnosesData = (response, searchValue = "") => {
  if (!response || !response.succeeded) {
    return {
      data: [],
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      searchValue: searchValue,
      succeeded: false
    };
  }

  if (!response.data) return {
    ...response,
    data: [],
    searchValue: searchValue
  };

  const transformedData = response.data.map(item => ({
    id: item.diagnosisId,
    diagnosisId: item.diagnosisId,
    diagnosisName: item.diagnosisName,
    code: item.code,
    symptomsDescription: item.symptomsDescription,
    description: item.description,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    prescriptionOverviews: item.prescriptionOverviews || [],
    diagnosisNoteOverviews: item.diagnosisNoteOverviews || [],
    patientInternalMedicalConditionLinkOverViews: item.patientInternalMedicalConditionLinkOverViews || []
  }));

  return {
    ...response,
    data: transformedData,
    currentPage: response.currentPage || 1,
    totalPages: response.totalPages || 1,
    totalCount: response.totalCount || 0,
    pageSize: response.pageSize || 10,
    hasPreviousPage: response.hasPreviousPage || false,
    hasNextPage: response.hasNextPage || false,
    searchValue: searchValue
  };
};

export const patientDiagnosesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatientDiagnoses: builder.query({
      query: ({ 
        patientId, 
        filter = {}, 
        orderBy, 
        pageNumber = 1, 
        pageSize = 10 
      }) => {
        const params = {
          PatientId: patientId,
          ...(filter.searchValue && { 'DiagnosisSearchFilter.SearchValue': filter.searchValue }),
          ...(filter.fromDate && { 'DiagnosisSearchFilter.FromDate': filter.fromDate }),
          ...(filter.toDate && { 'DiagnosisSearchFilter.ToDate': filter.toDate }),
          ...(filter.prescriptionStatus !== undefined && { 'DiagnosisSearchFilter.PrescriptionStatus': filter.prescriptionStatus }),
          ...(filter.medicalConditionId && { 'DiagnosisSearchFilter.MedicalConditionId': filter.medicalConditionId }),
          ...(filter.medicationId && { 'DiagnosisSearchFilter.MedicationId': filter.medicationId }),
          ...(filter.medicationCategoryId && { 'DiagnosisSearchFilter.MedicationCategoryId': filter.medicationCategoryId }),
          ...(orderBy && { 'DiagnosisOrder': orderBy }),
          ...(pageNumber && { 'PageNumber': pageNumber }),
          ...(pageSize && { 'PageSize': pageSize })
        };

        console.log('Patient Diagnoses API Request Params:', params);

        return {
          url: '/PatientDiagnoses/GetPatientDiagnoses',
          params,
          timeout: 10000
        };
      },
      transformResponse: (response, meta, args) => {
        console.log('Patient Diagnoses API Response:', response);
        return transformDiagnosesData(response, args.filter?.searchValue);
      },
      transformErrorResponse: (response, meta, args) => {
        console.error('Patient Diagnoses API Error:', response);
        return transformDiagnosesData(
          { 
            succeeded: false, 
            error: response.data,
            status: response.status 
          }, 
          args.filter?.searchValue
        );
      },
      providesTags: (result, error, { patientId }) => [
        { type: 'PatientDiagnoses', id: patientId }
      ],
    }),

    // Add new diagnosis
    addPatientDiagnosis: builder.mutation({
      query: ({ patientId, diagnosisData }) => ({
        url: '/PatientDiagnoses/AddPatientDiagnosis',
        method: 'POST',
        body: {
          patientId,
          ...diagnosisData
        }
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'PatientDiagnoses', id: patientId }
      ],
    }),

   updatePatientDiagnosis: builder.mutation({
  query: ({ diagnosisId, patientId, updates }) => { 
    const params = {
      DiagnosisId: diagnosisId,
      PatientId: patientId, 
      DiagnosisName: updates.diagnosisName,
      code: updates.code,
      symptomsDescription: updates.symptomsDescription,
      description: updates.description
    };

    console.log('Update Diagnosis Params:', params);

    return {
      url: '/PatientDiagnoses/UpdatePatientDiagnosis',
      method: 'PATCH',
      params: params
    };
  },
  invalidatesTags: (result, error, { patientId }) => [
    { type: 'PatientDiagnoses', id: patientId }
  ],
}),

    // Delete diagnosis
    deletePatientDiagnosis: builder.mutation({
      query: (diagnosisId) => ({
        url: `/PatientDiagnoses/DeletePatientDiagnosis/${diagnosisId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'PatientDiagnoses', id: patientId }
      ],
    })
  }),
});

export const {
  useGetPatientDiagnosesQuery,
  useLazyGetPatientDiagnosesQuery,
  useAddPatientDiagnosisMutation,
  useUpdatePatientDiagnosisMutation,
  useDeletePatientDiagnosisMutation,
} = patientDiagnosesApi;