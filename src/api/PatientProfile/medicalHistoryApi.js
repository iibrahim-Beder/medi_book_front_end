// medicalHistoryApi.js
import { baseApi } from '../baseApi';

// Transform history type
export const transformHistoryTypeToAPI = (historyType) => {
  const historyTypeMap = {
    'Surgery': 1,
    'Accident': 2,
    'Hospitalization': 3,
    'FamilyHistory': 4,
    'Vaccination': 5,
    'Others': 6
  };
  return historyTypeMap[historyType] ?? null;
};

const transformHistoryTypeToUI = (historyType) => {
  const historyTypeMap = {
    1: 'Surgery',
    2: 'Accident',
    3: 'Hospitalization',
    4: 'Family History',
    5: 'Vaccination',
    6: 'others'
  };
  return historyTypeMap[historyType] ?? 'Others';
};
const processField = (value) => {
  if (value === undefined) {
    return undefined; 
  }
  return value === "" ? null : value; // "" -> null
};

const transformMedicalHistoryData = (response, searchValue = "") => {
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
    historyId: item.id,
    historyType:item.historyType==="FamilyHistory"?"Family History":item.historyType,
    hereditaryDisease:{name: item.hereditaryDiseaseName},
    // hereditaryDiseaseName: "test hereditaryDiseaseName",
    description: item.description,
    dateOfEvent: item.dateOfEvent,
    relatedPerson: item.relatedPerson,
    notes: item.notes,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    highlightInfo: response.meta?.matchedItems?.find(matched => matched.id === item.id)
  }));

  return {
    ...response,
    data: transformedData,
    searchValue: searchValue
  };
};

export const medicalHistoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatientMedicalHistory: builder.query({
      query: ({ 
        patientId, 
        filter = {}, 
        orderBy, 
        pageNumber = 1, 
        pageSize = 10 
      }) => {
        const params = {
          PatientId: patientId,
          ...(filter.searchValue && { 'Filter.SearchValue': filter.searchValue }),
          ...(filter.historyType && { 'Filter.HistoryType': transformHistoryTypeToAPI(filter.historyType) }),
          ...(filter.dateFrom && { 'Filter.DateFrom': filter.dateFrom }),
          ...(filter.dateTo && { 'Filter.DateTo': filter.dateTo }),
          ...(orderBy && { 'OrderBy': orderBy }),
          ...(pageNumber && { 'PageNumber': pageNumber }),
          ...(pageSize && { 'PageSize': pageSize })
        };

        console.log('Medical History API Request Params:', params);

        return {
          url: '/MedicalHistory/GetPatientMedicalHistory',
          params,
          timeout: 10000
        };
      },
      transformResponse: (response, meta, args) => {
        console.log('Medical History API Response:', response);
        return transformMedicalHistoryData(response, args.filter?.searchValue);
      },
      transformErrorResponse: (response, meta, args) => {
        console.error('Medical History API Error:', response);
        return transformMedicalHistoryData(
          { 
            succeeded: false, 
            error: response.data,
            status: response.status 
          }, 
          args.filter?.searchValue
        );
      },
      providesTags: (result, error, { patientId }) => [
        { type: 'MedicalHistory', id: patientId }
      ],
    }),

    // Add new medical history record
addMedicalHistory: builder.mutation({
  query: ({ patientId, ...historyData }) => {
    const requestBody = {
      patientId,
      historyType: transformHistoryTypeToAPI(historyData.historyType),
      hereditaryDiseaseId: historyData.hereditaryDisease?.id,
      description: processField(historyData.description),
      dateOfEvent: processField(historyData.dateOfEvent),
      relatedPerson: processField(historyData.relatedPerson),
      notes: processField(historyData.notes),
    };

    return {
      url: '/MedicalHistory/AddPatientMedicalHistory',
      method: 'POST',
      body: requestBody,
    };
  },

  async onQueryStarted(
    { patientId, ...historyData },
    { dispatch, queryFulfilled, getState }
  ) {
    const tempId = `temp-${Date.now()}`;

    const patchResults = [];

    const state = getState();
    const queries = state[baseApi.reducerPath]?.queries ?? {};

    Object.values(queries).forEach(entry => {
      if (entry?.endpointName === 'getPatientMedicalHistory') {
        const patch = dispatch(
          medicalHistoryApi.util.updateQueryData(
            'getPatientMedicalHistory',
            entry.originalArgs,
            draft => {
              draft.data.unshift({
                id: tempId,
                historyId: tempId,
                historyType:
                  historyData.historyType === 'FamilyHistory'
                    ? 'Family History'
                    : historyData.historyType,
                hereditaryDisease: historyData.hereditaryDisease,
                description: historyData.description,
                dateOfEvent: historyData.dateOfEvent,
                relatedPerson: historyData.relatedPerson,
                notes: historyData.notes,
                createdAt: new Date().toISOString(),
                optimistic: true,
              });
              draft.totalCount += 1;
            }
          )
        );
        patchResults.push(patch);
      }
    });

    try {
      const { data: res } = await queryFulfilled;
      const created = res?.data;

      patchResults.forEach(patch =>
        patch.undo()
      );

      Object.values(queries).forEach(entry => {
        if (entry?.endpointName === 'getPatientMedicalHistory') {
          dispatch(
            medicalHistoryApi.util.updateQueryData(
              'getPatientMedicalHistory',
              entry.originalArgs,
              draft => {
                draft.data.unshift({
                  ...created,
                  historyType:
                    created.historyType === 'FamilyHistory'
                      ? 'Family History'
                      : created.historyType,
                  hereditaryDisease: {
                    name: created.hereditaryDiseaseName,
                  },
                });
              }
            )
          );
        }
      });
    } catch {
      patchResults.forEach(patch => patch.undo());
    }
  },
}),


updateMedicalHistory: builder.mutation({
  query: ({ historyId, updates }) => ({
    url: '/MedicalHistory/UpdatePatientMedicalHistory',
    method: 'PATCH',
    body: {
      id: historyId,
      ...updates
    }
  }),

  async onQueryStarted(
    _,
    { dispatch, queryFulfilled, getState }
  ) {
    try {
      const { data: res } = await queryFulfilled;
      const updated = res?.data;
      if (!updated) return;

      const state = getState();
      const apiState = state[baseApi.reducerPath];
      const queries = apiState?.queries ?? {};

      Object.values(queries).forEach(entry => {
        if (entry?.endpointName === 'getPatientMedicalHistory') {
          dispatch(
            medicalHistoryApi.util.updateQueryData(
              'getPatientMedicalHistory',
              entry.originalArgs,
              (draft) => {
                const idx = draft.data.findIndex(
                  r => r.id === updated.id
                );

                if (idx !== -1) {
                  draft.data[idx] = {
                    ...draft.data[idx],
                    ...updated,
                    historyType:
                      updated.historyType === 'FamilyHistory'
                        ? 'Family History'
                        : updated.historyType
                        ,
                    hereditaryDisease: {name: updated.hereditaryDiseaseName},

                  };
                }
              }
            )
          );
        }
      });
    } catch {
      // no-op
    }
  }
}),


    
deleteMedicalHistory: builder.mutation({
  query: ({ historyId }) => ({
    url: `/MedicalHistory/DeletePatientMedicalHistory?Id=${historyId}`,
    method: 'DELETE',
  }),

  async onQueryStarted(
    { historyId },
    { dispatch, queryFulfilled, getState }
  ) {
    const state = getState();
    const queries = state[baseApi.reducerPath]?.queries ?? {};

    const patchResults = [];

    Object.values(queries).forEach(entry => {
      if (entry?.endpointName === 'getPatientMedicalHistory') {
        const patch = dispatch(
          medicalHistoryApi.util.updateQueryData(
            'getPatientMedicalHistory',
            entry.originalArgs,
            draft => {
              draft.data = draft.data.filter(
                item => item.id !== historyId
              );
              draft.totalCount -= 1;
            }
          )
        );
        patchResults.push(patch);
      }
    });

    try {
      await queryFulfilled;
    } catch {
      patchResults.forEach(patch => patch.undo());
    }
  },

}),

  }),
});

export const {
  useGetPatientMedicalHistoryQuery,
  useLazyGetPatientMedicalHistoryQuery,
  useAddMedicalHistoryMutation,
  useUpdateMedicalHistoryMutation,
  useDeleteMedicalHistoryMutation,
} = medicalHistoryApi;