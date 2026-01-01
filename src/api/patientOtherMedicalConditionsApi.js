import { baseApi } from './baseApi';

const transformSeverityToAPI = (severity) => {
  const severityMap = {
    'Mild': 1,
    'Moderate': 2, 
    'Severe': 3
  };
  return severityMap[severity] ?? null;
};

const transformSeverityToUI = (severity) => {
  const severityMap = {
    1: 'Mild',
    2: 'Moderate',
    3: 'Severe'
  };
  return severityMap[severity] ?? 'Mild';
};

const transformConditionTypeToAPI = (conditionType) => {
  const conditionTypeMap = {
    'External': 0,
    'Chronic': 1,
    'Acute': 2
  };
  return conditionTypeMap[conditionType] ?? null;
};

const transformConditionTypeToUI = (conditionType) => {
  const conditionTypeMap = {
    0: 'External',
    1: 'Chronic', 
    2: 'Acute'
  };
  return conditionTypeMap[conditionType] ?? 'External';
};

const transformMedicalConditionsData = (response, searchTerm = "") => {
  if (!response || !response.succeeded) {
    return {
      data: [],
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      searchTerm: searchTerm,
      succeeded: false
    };
  }

  if (!response.data) return {
    ...response,
    data: [],
    searchTerm: searchTerm
  };

  const transformedData = response.data.map(item => ({
    id: item.id,
    medicalConditionId: item.id,
    medicalConditionName: item.medicalConditionName,
    categoryName: item.categoryName,
    severity: transformSeverityToUI(item.severity),
    severityValue: item.severity,
    diagnosedDate: item.diagnosedDate,
    isActive: item.isActive,
    note: item.notes,
    conditionType: transformConditionTypeToUI(item.conditionType),
    conditionTypeValue: item.conditionType,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    highlightInfo: response.meta?.matchedItems?.find(matched => matched.id === item.id)
  }));

  return {
    ...response,
    data: transformedData,
    searchTerm: searchTerm
  };
};

// Fixed: Complete the transform function
const transformSingleMedicalCondition = (response) => {
  if (!response || !response.succeeded || !response.data) {
    return {
      succeeded: false,
      data: null,
      error: response?.error || 'Operation failed'
    };
  }

  return {
    succeeded: true,
    data: {
      id: response.data.id,
      medicalConditionId: response.data.id,
      medicalConditionName: response.data.medicalConditionName,
      categoryName: response.data.categoryName,
      severity: transformSeverityToUI(response.data.severity),
      severityValue: response.data.severity,
      diagnosedDate: response.data.diagnosedDate,
      isActive: response.data.isActive,
      note: response.data.note,
      conditionType: transformConditionTypeToUI(response.data.conditionType),
      conditionTypeValue: response.data.conditionType,
      createdAt: response.data.createdAt,
      updatedAt: response.data.updatedAt
    },
    message: response.message
  };
};

export const patientMedicalConditionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExternalPatientMedicalConditions: builder.query({
      query: ({ 
        patientId, 
        filter = {}, 
        orderBy, 
        pageNumber = 1, 
        pageSize = 10 
      }) => {
        const params = {
          PatientId: patientId,
          ...(filter.searchValue && { 'PatientMedicalConditionFilter.SearchValue': filter.searchValue }),
          ...(filter.isActive !== undefined && { 'PatientMedicalConditionFilter.IsActive': filter.isActive }),
          ...(filter.severity !== undefined && { 'PatientMedicalConditionFilter.Severity': transformSeverityToAPI(filter.severity) }),
          ...(filter.conditionType !== undefined && { 'PatientMedicalConditionFilter.ConditionType': transformConditionTypeToAPI(filter.conditionType) }),
          ...(filter.diagnosisDateFrom && { 'PatientMedicalConditionFilter.DateFrom': filter.diagnosisDateFrom }),
          ...(filter.diagnosisDateTo && { 'PatientMedicalConditionFilter.DateTo': filter.diagnosisDateTo }),
          ...(orderBy && { 'OrderBy': orderBy }),
          ...(pageNumber && { 'PageNumber': pageNumber }),
          ...(pageSize && { 'PageSize': pageSize }),
          orderBy:1
        };

        console.log('API Request Params:', params); 

        return {
          url: '/PatientMedicalConditions/GetExternalPatientMedicalConditions',
          params,
          timeout: 10000
        };
      },
      transformResponse: (response, meta, args) => {
        console.log('API Response:', response); 
        return transformMedicalConditionsData(response, args.filter?.searchValue);
      },
      transformErrorResponse: (response, meta, args) => {
        console.error('API Error:', response); 
        return transformMedicalConditionsData(
          { 
            succeeded: false, 
            error: response.data,
            status: response.status 
          }, 
          args.filter?.searchValue
        );
      },
      providesTags: (result, error, { patientId }) => [
        { type: 'PatientMedicalConditions', id: patientId }
      ],
    }),
    
   // Add external patient medical condition - FIXED VERSION
addExternalPatientMedicalCondition: builder.mutation({
  query: (data) => {
    console.log('Add External Patient Medical Condition Data:', data);
    const params = {
      PatientId: data.patientId, 
      MedicalConditionId: data.conditionData.MedicalConditionId, 
      Severity: transformSeverityToAPI(data.conditionData.severity),
      DiagnosisDate: data.conditionData.diagnosisDate,
      DiagnosedByName: data.conditionData.diagnosedByName || '',
      IsActive: data.conditionData.isActive !== undefined ? data.conditionData.isActive : true,
      Notes: data.conditionData.notes || ''
    };

    console.log('Add External Patient Medical Condition Params:', params);

    return {
      url: '/PatientMedicalConditions/AddExternalPatientMedicalConditions',
      method: 'POST',
      params: params
    };
  },
  transformResponse: (response) => {
    console.log('Add External Patient Medical Condition Response:', response);
    return transformSingleMedicalCondition(response);
  },
  invalidatesTags: (result, error, data) => [
    { type: 'PatientMedicalConditions', id: data.patientId }
  ],
}),

    // Update external patient medical condition
    updateExternalPatientMedicalCondition: builder.mutation({
      query: (data) => { // Changed to accept single data object
        const params = {
          Id: data.conditionId,
          MedicalConditionId: data.updates.medicalConditionId,
          Severity: transformSeverityToAPI(data.updates.severity),
          DiagnosisDate: data.updates.diagnosisDate,
          DiagnosedByName: data.updates.diagnosedByName || '',
          IsActive: data.updates.isActive,
          Notes: data.updates.notes || ''
        };

        console.log('Update External Patient Medical Condition Params:', params);

        return {
          url: '/PatientMedicalConditions/UpdateExternalPatientMedicalConditions',
          method: 'PUT',
          params: params
        };
      },
      transformResponse: (response) => {
        console.log('Update External Patient Medical Condition Response:', response);
        return transformSingleMedicalCondition(response);
      },
      invalidatesTags: (result, error, { conditionId }) => [
        { type: 'PatientMedicalConditions', id: conditionId }
      ],
    }),

    // Delete Medical Condition - Fixed parameter
    deleteExternalPatientMedicalCondition: builder.mutation({
      query: (data) => ({ // Accept object with conditionId
        url: `/PatientMedicalConditions/DeleteExternalPatientMedicalCondition?id=${data.conditionId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'PatientMedicalConditions', id: patientId }
      ],
    })
  }),
});

export const {
  useGetExternalPatientMedicalConditionsQuery,
  useLazyGetExternalPatientMedicalConditionsQuery,
  useAddExternalPatientMedicalConditionMutation,
  useUpdateExternalPatientMedicalConditionMutation,
  useDeleteExternalPatientMedicalConditionMutation, // Fixed export name
} = patientMedicalConditionsApi;