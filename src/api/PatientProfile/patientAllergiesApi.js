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

const transformSingleAllergy = (response) => {
  if (!response || !response.succeeded || !response.data) {
    return {
      succeeded: false,
      data: null,
      error: response?.error || 'Operation failed'
    };
  }

  return {
    ...response,
    data: {
      id: response.data.id,
      allergenId: response.data.allergenId,
      allergenName: response.data.allergenName,
      severity: transformSeverityToAPI(response.data.severity),
      severityValue: response.data.severity,
      isActive: response.data.isActive,
      dateNoted: response.data.dateNoted,
      reaction: response.data.reaction,
      notes: response.data.notes,
      createdAt: response.data.createdAt,
      updatedAt: response.data.updatedAt,
      allergenCategory: response.data.allergenCategory
    }
  };
};
const transformAllergiesData = (response, searchTerm = "") => {
  if (!response || !response.data) return response;

  const transformedData = response.data.map(item => ({
    id: item.id,
    allergenId: item.id,
    allergenLabel: item.allergenName,
    allergenName: item.allergenName,
    severity: item.severity,
    severityValue: item.severity,
    isActive: item.isActive,
    dateNoted: item.dateNoted,
    reaction: item.reaction,
    notes: item.notes,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    // highlight from meta  response
    highlightInfo: response.meta?.matchedItems?.find(matched => matched.id === item.id),
    allergenCategory: item.allergenCategory
  }));

  return {
    ...response,
    data: transformedData,
    searchTerm: searchTerm // keep track of the search term for highlight
  };
};

export const patientAllergiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatientAllergies: builder.query({
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
          ...(filter.isActive !== undefined && { 'Filter.IsActive': filter.isActive }),
          ...(filter.severity !== undefined && { 'Filter.Severity': transformSeverityToAPI(filter.severity) }),
          ...(filter.dateNoted && { 'Filter.DateNoted': filter.dateNoted }),
          ...(orderBy && { 'OrderBy': orderBy }),
          ...(pageNumber && { 'PageNumber': pageNumber }),
          ...(pageSize && { 'PageSize': pageSize })
        };

        return {
          url: '/PatientAllergies/GetPatientAllergies',
          params
        };
      },
      transformResponse: (response, meta, args) => console.log('Patient Allergies API Response:', response) ||
        transformAllergiesData(response, args.filter?.searchValue),
      providesTags: (result, error, { patientId }) => [
        { type: 'PatientAllergies', id: patientId }
      ],
    }),

    // Add patient allergy
addPatientAllergy: builder.mutation({
  query: ({ patientId, allergyData }) => (console.log('Add Patient Allergy Params:', allergyData) ,{
    url: '/PatientAllergies/AddPatientAllergie',
    method: 'POST',
    body: {
      patientId: patientId,
      allergenId: allergyData.allergenId,
      severity: transformSeverityToAPI(allergyData.severity),
      isActive: allergyData.isActive ?? true,
      dateNoted: allergyData.dateNoted|| new Date().toISOString(),
      reaction: allergyData.reaction || "",
      notes: allergyData.notes || ""
    }
  }),
   

  async onQueryStarted(
    { patientId },
    { dispatch, queryFulfilled, getState }
  ) {
    const state = getState();
    const queries = state[baseApi.reducerPath]?.queries ?? {};

    try {
      const { data } = await queryFulfilled;
      const added = data?.data;
      if (!added) return;

      Object.values(queries).forEach(entry => {
        if (entry?.endpointName === "getPatientAllergies") {
          dispatch(
            patientAllergiesApi.util.updateQueryData(
              "getPatientAllergies",
              entry.originalArgs,
              draft => {
                draft.data.unshift(added);
              }
            )
          );
        }
      });
    } catch {
      // rollback handled by RTK
    }
  }
}),


    // Update patient allergy
updatePatientAllergy: builder.mutation({
  query: ({ allergyId, updates }) => ({
    url: '/PatientAllergies/UpdatePatientAllergie',
    method: 'PUT',
    body: {
      Id: allergyId,
      ...updates
    }
  }),

  async onQueryStarted(
    { allergyId },
    { dispatch, queryFulfilled, getState }
  ) {
    const state = getState();
    const queries = state[baseApi.reducerPath]?.queries ?? {};

    try {
      const { data } = await queryFulfilled;
      const updated = data?.data;
      if (!updated) return;

      Object.values(queries).forEach(entry => {
        if (entry?.endpointName === "getPatientAllergies") {
          dispatch(
            patientAllergiesApi.util.updateQueryData(
              "getPatientAllergies",
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
      // rollback handled by RTK
    }
  }
}),



deletePatientAllergy: builder.mutation({
  query: ({ allergyId }) => ({
    url: `/PatientAllergies/DeletePatientAllergie?id=${allergyId}`,
    method: 'DELETE'
  }),

  async onQueryStarted(
    { allergyId },
    { dispatch, queryFulfilled, getState }
  ) {
    const state = getState();
    const queries = state[baseApi.reducerPath]?.queries ?? {};

    const patches = [];

    Object.values(queries).forEach(entry => {
      if (entry?.endpointName === "getPatientAllergies") {
        patches.push(
          dispatch(
            patientAllergiesApi.util.updateQueryData(
              "getPatientAllergies",
              entry.originalArgs,
              draft => {
                draft.data = draft.data.filter(
                  item => item.id !== allergyId
                );
              }
            )
          )
        );
      }
    });

    try {
      await queryFulfilled;
    } catch {
      patches.forEach(p => p.undo());
    }
  }
})

  }),
});

export const {
  useGetPatientAllergiesQuery,
  useLazyGetPatientAllergiesQuery,
  useAddPatientAllergyMutation,
  useUpdatePatientAllergyMutation,
  useDeletePatientAllergyMutation,
} = patientAllergiesApi;