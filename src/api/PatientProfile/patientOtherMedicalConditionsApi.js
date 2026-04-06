import { baseApi } from '../baseApi';

const transformSeverityToAPI = (severity) => {
  const severityMap = {
    'Mild': 0,
    'Moderate': 1, 
    'Severe': 2
  };
  return severityMap[severity] ?? null;
};

const transformSeverityToUI = (severity) => {
  const severityMap = {
    0: 'Mild',
    1: 'Moderate',
    2: 'Severe'
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
    severity: item.severity,
    severityValue: item.severity,
    diagnosedDate: item.diagnosedDate,
    isActive: item.isActive,
    notes: item.notes,
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
      notes: response.data.notes,
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
      query: ({ patientId, conditionData }) => (
        console.log('API Request Params:', { patientId, conditionData }),
        {
        url: '/PatientMedicalConditions/AddExternalPatientMedicalConditions',
        method: 'POST',
        body: {
          patientId,
          medicalConditionId: conditionData.medicalConditionId,
          severity: transformSeverityToAPI(conditionData.severity),
          diagnosisDate: conditionData.diagnosisDate,
          diagnosedByName: conditionData.diagnosedByName || '',
          isActive: conditionData.isActive ?? true,
          notes: conditionData.notes || ''
        }
      }),

      async onQueryStarted(
        { patientId, conditionData },
        { dispatch, queryFulfilled, getState }
      ) {
        const tempId = `temp-${Date.now()}`;
        const state = getState();
        const queries = state[baseApi.reducerPath]?.queries ?? [];
        const patches = [];

        Object.values(queries).forEach(entry => {
          if (entry?.endpointName === 'getExternalPatientMedicalConditions') {
            patches.push(
              dispatch(
                patientMedicalConditionsApi.util.updateQueryData(
                  'getExternalPatientMedicalConditions',
                  entry.originalArgs,
                  draft => {
                    draft.data.unshift({
                      id: tempId,
                      medicalConditionId: tempId,
                      medicalConditionName: conditionData.medicalConditionName,
                      severity: conditionData.severity,
                      diagnosedDate: conditionData.diagnosisDate,
                      isActive: conditionData.isActive ?? true,
                      notes: conditionData.notes,
                      createdAt: new Date().toISOString(),
                      optimistic: true
                    });
                    draft.totalCount += 1;
                  }
                )
              )
            );
          }
        });

        try {
          const { data } = await queryFulfilled;
          patches.forEach(p => p.undo());

          Object.values(queries).forEach(entry => {
            if (entry?.endpointName === 'getExternalPatientMedicalConditions') {
              dispatch(
                patientMedicalConditionsApi.util.updateQueryData(
                  'getExternalPatientMedicalConditions',
                  entry.originalArgs,
                  draft => {
                    draft.data.unshift(data.data);
                  }
                )
              );
            }
          });
        } catch {
          patches.forEach(p => p.undo());
        }
      }
    }),

    // Update external patient medical condition
    updateExternalPatientMedicalCondition: builder.mutation({
  query: ({ conditionId, updates }) => (
    console.log('API Request Params:', { conditionId, updates }),
    {
    url: '/PatientMedicalConditions/UpdateExternalPatientMedicalConditions',
    method: 'PUT',
    body: {
      id: conditionId,
      ...updates
    }
  }),

  async onQueryStarted(
    { conditionId },
    { dispatch, queryFulfilled, getState }
  ) {
    const state = getState();
    const queries = state[baseApi.reducerPath]?.queries ?? {};

    try {
      const { data } = await queryFulfilled;
      const updated = data?.data;
      if (!updated) return;

      Object.values(queries).forEach(entry => {
        if (entry?.endpointName === 'getExternalPatientMedicalConditions') {
          dispatch(
            patientMedicalConditionsApi.util.updateQueryData(
              'getExternalPatientMedicalConditions',
              entry.originalArgs,
              draft => {
                const idx = draft.data.findIndex(
                  r => r.id === updated.id
                );
                if (idx !== -1) {
                  draft.data[idx] = {
                    ...draft.data[idx],
                    ...updated
                  };
                }
              }
            )
          );
        }
      });
    } catch {
      // rollback handled automatically
    }
  }
    }),


    // Delete Medical Condition - Fixed parameter
    deleteExternalPatientMedicalCondition: builder.mutation({
  query: ({ conditionId }) => ({
    url: `/PatientMedicalConditions/DeleteExternalPatientMedicalCondition?id=${conditionId}`,
    method: 'DELETE'
  }),

  async onQueryStarted(
    { conditionId },
    { dispatch, queryFulfilled, getState }
  ) {
    const state = getState();
    const queries = state[baseApi.reducerPath]?.queries ?? {};
    const patches = [];

    // Optimistic remove
    Object.values(queries).forEach(entry => {
      if (entry?.endpointName === 'getExternalPatientMedicalConditions') {
        const patch = dispatch(
          patientMedicalConditionsApi.util.updateQueryData(
            'getExternalPatientMedicalConditions',
            entry.originalArgs,
            draft => {
              const prevLength = draft.data.length;
              draft.data = draft.data.filter(
                item => item.id !== conditionId
              );
              if (draft.data.length !== prevLength) {
                draft.totalCount -= 1;
              }
            }
          )
        );
        patches.push(patch);
      }
    });

    try {
      await queryFulfilled;
      // success → نسيب الحالة زي ما هي
    } catch {
      // rollback
      patches.forEach(p => p.undo());
    }
  }
}),

  }),
});

export const {
  useGetExternalPatientMedicalConditionsQuery,
  useLazyGetExternalPatientMedicalConditionsQuery,
  useAddExternalPatientMedicalConditionMutation,
  useUpdateExternalPatientMedicalConditionMutation,
  useDeleteExternalPatientMedicalConditionMutation, // Fixed export name
} = patientMedicalConditionsApi;