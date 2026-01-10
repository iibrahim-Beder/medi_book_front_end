// patientMedicationApi.js
import { baseApi } from './baseApi';

// Helper functions
const transformMedicationData = (response, searchValue = "") => {
  console.log('==External Patient Medication API Response:', response);
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
    medicationId: item.medicationId,
    medicationName: item.medicationName,
    medicationCategory: item.medicationCategory,
    startDate: item.startDate,
    endDate: item.endDate,
    isActive: item.isActive,
    dosage: item.dosage,
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

const transformSingleMedication = (response) => {
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
      medicationId: response.data.medicationId,
      medicationName: response.data.medicationName,
      medicationCategory: response.data.medicationCategory,
      startDate: response.data.startDate,
      endDate: response.data.endDate,
      isActive: response.data.isActive,
    }
  };
};

export const patientMedicationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get external patient medication
    getExternalPatientMedication: builder.query({
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
          ...(orderBy && { 'PatientMedicationLinkOrdering': orderBy }),
          ...(filter.medicationId && { 'PatientMedicationLinkFilters.MedicationId': filter.medicationId }),
          ...(filter.isActive !== undefined && { 'PatientMedicationLinkFilters.IsActive': filter.isActive }),
          ...(filter.sourceType !== undefined && { 'PatientMedicationLinkFilters.SourceType': filter.sourceType }),
          ...(filter.startDateFrom && { 'PatientMedicationLinkFilters.StartDateFrom': filter.startDateFrom }),
          ...(filter.startDateTo && { 'PatientMedicationLinkFilters.StartDateTo': filter.startDateTo }),
          ...(filter.searchValue && { 'PatientMedicationLinkFilters.SearchValue': filter.searchValue }),
        };

        console.log('External Patient Medication API Request Params:', params);

        return {
          url: '/PatientMedication/GetExternalPatientMedicationRouting',
          params,
          timeout: 10000
        };
      },
      transformResponse: (response, meta, args) => {
        console.log('External Patient Medication API Response:', response);
        return transformMedicationData(response, args.filter?.searchValue);
      },
      transformErrorResponse: (response, meta, args) => {
        console.error('External Patient Medication API Error:', response);
        return transformMedicationData(
          { 
            succeeded: false, 
            error: response.data,
            status: response.status 
          }, 
          args.filter?.searchValue
        );
      },
      providesTags: (result, error, { patientId }) => [
        { type: 'ExternalPatientMedication', id: patientId }
      ],
    }),
    // Add external patient medication
   addExternalPatientMedication: builder.mutation({
  query: ({ patientId, medicationData }) => ({
    url: '/PrescribedMedication/AddExternalPatientMedication',
    method: 'POST',
    body: {
      PatientId: patientId,
      MedicationId: medicationData.medicationNameId,
      StartDate: medicationData.startDate,
      EndDate: medicationData.endDate,
      IsActive: medicationData.isActive ?? true
    }
  }),

  async onQueryStarted(
    { patientId },
    { dispatch, queryFulfilled, getState }
  ) {
    try {
      const { data } = await queryFulfilled;

      const added = data?.data;
      if (!added) return;

      const state = getState();
      const queries = state[baseApi.reducerPath]?.queries ?? {};

      Object.values(queries).forEach(entry => {
        if (entry?.endpointName === "getExternalPatientMedication") {
          dispatch(
            patientMedicationApi.util.updateQueryData(
              "getExternalPatientMedication",
              entry.originalArgs,
              draft => {
                draft.data.unshift({
                  id: added.id,
                  medicationName: added.medicationName,
                  medicationCategory: added.medicationCategory,
                  startDate: added.startDate,
                  endDate: added.endDate,
                  isActive: added.isActive,
                });

                draft.totalCount += 1;
              }
            )
          );
        }
      });
    } catch {
    }
  }
}),


updateExternalPatientMedication: builder.mutation({
  query: ({ medicationId, updates }) => ({
    url: '/PrescribedMedication/UpdateExternalPatientMedication',
    method: 'PUT',
    body: {
      Id: medicationId,
      medicationId: updates.medicationNameId,
      startDate: updates.startDate,
      endDate: updates.endDate,
      isActive: updates.isActive
    }
  }),

  async onQueryStarted(
    { medicationId },
    { dispatch, queryFulfilled, getState }
  ) {
    const state = getState();
    const queries = state[baseApi.reducerPath]?.queries ?? {};

    try {
      const { data } = await queryFulfilled;
      const updated = data?.data;
      if (!updated) return;
      console.log("=======updated", updated);

      Object.values(queries).forEach(entry => {
        if (entry?.endpointName === "getExternalPatientMedication") {
          dispatch(
            patientMedicationApi.util.updateQueryData(
              "getExternalPatientMedication",
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
      // rollback auto
    }
  }
}),


 deleteExternalPatientMedication: builder.mutation({
  query: (medicationId) => ({
    url: '/PrescribedMedication/DeleteExternalPatientMedication',
    method: 'DELETE',
    params: { Id: medicationId }
  }),

  async onQueryStarted(
    medicationId,
    { dispatch, queryFulfilled, getState }
  ) {
    const state = getState();
    const queries = state[baseApi.reducerPath]?.queries ?? {};
    const patches = [];

    Object.values(queries).forEach(entry => {
      if (entry?.endpointName === "getExternalPatientMedication") {
        patches.push(
          dispatch(
            patientMedicationApi.util.updateQueryData(
              "getExternalPatientMedication",
              entry.originalArgs,
              draft => {
                draft.data = draft.data.filter(
                  item => item.id !== medicationId
                );
                draft.totalCount -= 1;
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
  // Queries
  useGetExternalPatientMedicationQuery,
  useLazyGetExternalPatientMedicationQuery,
  useGetAvailableMedicationsQuery,
  // Mutations
  useAddExternalPatientMedicationMutation,
  useUpdateExternalPatientMedicationMutation,
  useDeleteExternalPatientMedicationMutation,
} = patientMedicationApi;