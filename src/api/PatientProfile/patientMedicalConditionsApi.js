// patientMedicalConditionsApi.js
import { baseApi } from '../baseApi';
import { patientDiagnosesApi } from './patientDiagnosesApi';

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
    severity: item.severity,
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
          diagnosisId: diagnosisId,
          medicalConditionId: conditionData.medicalConditionId,
          severity: getSeverityValue(conditionData.severity),
          isActive: conditionData.isActive !== undefined ? conditionData.isActive : true,
          notes: conditionData.notes || ''
        };

        console.log('Add Internal Patient Medical Condition Params:', params);

        return {
          url: '/PatientMedicalConditions/AddInternalPatientMedicalConditions',
          method: 'POST',
          body: params
        };
      },
        async onQueryStarted(
    { diagnosisId, payload },
    { dispatch, queryFulfilled, getState }
  ) {
    const state = getState();
    const queries = state[baseApi.reducerPath]?.queries ?? {};

    const patches = [];
    try {
      const { data } = await queryFulfilled;
      const realCond = data.data;

      Object.values(queries).forEach(entry => {
        if (entry?.endpointName === "getPatientDiagnoses") {
          dispatch(
            patientDiagnosesApi.util.updateQueryData(
              "getPatientDiagnoses",
              entry.originalArgs,
              draft => {
                const diag = draft.data.find(d => d.diagnosisId === diagnosisId);
                if (!diag) return;

                diag.patientInternalMedicalConditionLinkOverViews =
                  diag.patientInternalMedicalConditionLinkOverViews.filter(
                    c => !c.optimistic
                  );

                diag.patientInternalMedicalConditionLinkOverViews.unshift(realCond);
              }
            )
          );
        }
      });

    } catch (err) {
      patches.forEach(p => p.undo());
    }
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
      body: params
    };
  },
async onQueryStarted(
  { conditionId, diagnosisId, updates },
  { dispatch, queryFulfilled, getState }
) {
  const state = getState();
  const queries = state[baseApi.reducerPath]?.queries ?? {};
  const patches = [];

  Object.values(queries).forEach(entry => {
    if (entry?.endpointName === "getPatientDiagnoses") {
      const patch = dispatch(
        patientDiagnosesApi.util.updateQueryData(
          "getPatientDiagnoses",
          entry.originalArgs,
          draft => {
            const diag = draft.data.find(
              d => d.diagnosisId === diagnosisId
            );
            if (!diag) return;

            const idx =
              diag.patientInternalMedicalConditionLinkOverViews
                .findIndex(c => c.id === conditionId);

            if (idx !== -1) {
              Object.assign(
                diag.patientInternalMedicalConditionLinkOverViews[idx],
                {
                  medicalConditionId: updates.medicalConditionId,
                  severity: updates.severity,
                  notes: updates.notes,
                  isActive: updates.isActive
                }
              );
            }
          }
        )
      );

      patches.push(patch);
    }
  });

  try {
    await queryFulfilled;
  } catch {
    patches.forEach(p => p.undo());
  }
},
  invalidatesTags: (result, error, { conditionId }) => [
    { type: 'PatientMedicalCondition', id: conditionId }
  ],
}),
   // Delete patient medical condition 
    deletePatientMedicalCondition: builder.mutation({
      query: ({conditionId}) => {
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
      
  async onQueryStarted(
    { diagnosisId, conditionId },
    { dispatch, queryFulfilled, getState }
  ) {
    const state = getState();
    const queries = state[baseApi.reducerPath]?.queries ?? {};
    const patches = [];

    Object.values(queries).forEach(entry => {
      if (entry?.endpointName === "getPatientDiagnoses") {
        const patch = dispatch(
          patientDiagnosesApi.util.updateQueryData(
            "getPatientDiagnoses",
            entry.originalArgs,
            draft => {
              const diag = draft.data.find(d => d.diagnosisId === diagnosisId);
              if (!diag) return;

              diag.patientInternalMedicalConditionLinkOverViews =
                diag.patientInternalMedicalConditionLinkOverViews.filter(
                  c => c.id !== conditionId
                );
            }
          )
        );
        patches.push(patch);
      }
    });

    try {
      await queryFulfilled;
    } catch (err) {
      patches.forEach(p => p.undo());
    }
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