// patientMedicalConditionsApi.js
import { baseApi } from '../baseApi';

// Helper functions
const getSeverityValue = (severityText) => {
  const severityMap = {
    "Mild": 0,
    "Moderate": 1,
    "Severe": 2
  };
  return severityMap[severityText] || 1;
};

const getSeverityText = (severity) => {
  const severityMap = {
    0: "Mild",
    1: "Moderate", 
    2: "Severe"
  };
  return severityMap[severity] || "Mild";
};

const transformMedicalConditionData = (response, searchValue = "") => {
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
    id: item.id,
    medicalConditionId: item.id,
    medicalConditionName: item.medicalConditionName,
    categoryName: item.categoryName,
    severity: getSeverityText(item.severity),
    severityValue: item.severity,
    isActive: item.isActive,
    notes: item.notes,
    conditionType: item.conditionType,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
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

export const patientMedicalConditionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get patient medical conditions
  getPatientMedicalConditions: builder.query({
      query: ({ 
        patientId, 
        filter = {}, 
        orderBy, 
        pageNumber = 1, 
        pageSize = 10 
      }) => {
        const params = {
          PatientId: patientId,
          ...(pageNumber && { 'PageNumber': pageNumber }),
          ...(pageSize && { 'PageSize': pageSize }),
          ...(orderBy && { 'OrderBy': orderBy }),
          ...(filter.searchValue && { 'PatientMedicalConditionFilter.SearchValue': filter.searchValue }),
          ...(filter.fromDate && { 'PatientMedicalConditionFilter.DateFrom': filter.fromDate }),
          ...(filter.toDate && { 'PatientMedicalConditionFilter.DateTo': filter.toDate }),
          ...(filter.severity !== undefined && { 'PatientMedicalConditionFilter.Severity': filter.severity }),
          ...(filter.conditionType && { 'PatientMedicalConditionFilter.ConditionType': filter.conditionType }),
          ...(filter.isActive !== undefined && { 'PatientMedicalConditionFilter.IsActive': filter.isActive })
        };

        console.log('Patient Medical Conditions API Request Params:', params);

        return {
          url: '/PatientMedicalConditions/GetInternalPatientMedicalConditions', // Updated URL
          params,
          timeout: 10000
        };
      },
      transformResponse: (response, meta, args) => {
        console.log('Patient Medical Conditions API Response:', response);
        return transformMedicalConditionData(response, args.filter?.searchValue);
      },
      transformErrorResponse: (response, meta, args) => {
        console.error('Patient Medical Conditions API Error:', response);
        return transformMedicalConditionData(
          { 
            succeeded: false, 
            error: response.data,
            status: response.status 
          }, 
          args.filter?.searchValue
        );
      },
      providesTags: (result, error, { patientId }) => [
        { type: 'PatientMedicalCondition', id: patientId }
      ],
    }),


    // Add internal patient medical condition
    addInternalPatientMedicalCondition: builder.mutation({
      query: ({ diagnosisId, conditionData }) => {
        const params = {
          DiagnosisId: diagnosisId,
          MedicalConditionId: conditionData.medicalConditionId,
          Severity: getSeverityValue(conditionData.severity),
          IsActive: conditionData.isActive !== undefined ? conditionData.isActive : true,
          Notes: conditionData.notes || ''
        };

        console.log('Add Internal Patient Medical Condition Params:', params);

        return {
          url: '/PatientMedicalConditions/AddInternalPatientMedicalConditions',
          method: 'POST',
          params: params
        };
      },
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'PatientMedicalCondition', id: patientId }
      ],
    }),

// Update patient medical condition 
updatePatientMedicalCondition: builder.mutation({
  query: ({ conditionId, updates }) => {
    const params = {
      Id: conditionId, 
      MedicalConditionId: updates.medicalConditionId, 
      Severity: getSeverityValue(updates.severity),
      IsActive: updates.isActive,
      Notes: updates.notes || ''
    };

    console.log('Update Patient Medical Condition Params:', params);

    return {
      url: '/PatientMedicalConditions/UpdateInternalPatientMedicalConditions', 
      method: 'PUT', 
      params: params
    };
  },
  invalidatesTags: (result, error, { conditionId }) => [
    { type: 'PatientMedicalCondition', id: conditionId }
  ],
}),
   // Delete patient medical condition 
    deletePatientMedicalCondition: builder.mutation({
      query: (conditionId) => {
        const params = {
          Id: conditionId 
        };

        console.log('Delete Patient Medical Condition Params:', params);

        return {
          url: '/PatientMedicalConditions/DeleteInternalPatientMedicalCondition', 
          method: 'DELETE',
          params: params
        };
      },
      invalidatesTags: (result, error, conditionId) => [
        { type: 'PatientMedicalCondition', id: conditionId }
      ],
    }),

  }),
});

export const {
  useGetPatientMedicalConditionsQuery,
  useLazyGetPatientMedicalConditionsQuery,
  useAddInternalPatientMedicalConditionMutation,
  useUpdatePatientMedicalConditionMutation,
  useDeletePatientMedicalConditionMutation,
  useGetAvailableMedicalConditionsQuery,
} = patientMedicalConditionsApi;