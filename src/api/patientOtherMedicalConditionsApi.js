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
    note: item.note,
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
          ...(pageSize && { 'PageSize': pageSize })
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
    // Adding a new Medical Condition (in the future)
    addPatientMedicalCondition: builder.mutation({
      query: ({ patientId, medicalConditionData }) => ({
        url: '/PatientMedicalConditions/AddPatientMedicalCondition',
        method: 'POST',
        body: {
          patientId,
          ...medicalConditionData
        }
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'PatientMedicalConditions', id: patientId }
      ],
    }),

    // Update Medical Condition (in the future)
    updatePatientMedicalCondition: builder.mutation({
      query: ({ medicalConditionId, updates }) => ({
        url: `/PatientMedicalConditions/UpdatePatientMedicalCondition/${medicalConditionId}`,
        method: 'PUT',
        body: updates
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'PatientMedicalConditions', id: patientId }
      ],
    }),

    // Delete Medical Condition (in the future)
    deletePatientMedicalCondition: builder.mutation({
      query: (medicalConditionId) => ({
        url: `/PatientMedicalConditions/DeletePatientMedicalCondition/${medicalConditionId}`,
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
  useAddPatientMedicalConditionMutation,
  useUpdatePatientMedicalConditionMutation,
  useDeletePatientMedicalConditionMutation,
} = patientMedicalConditionsApi;