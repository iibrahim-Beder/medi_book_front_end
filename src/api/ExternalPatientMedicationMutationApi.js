// patientMedicationApi.js
import { baseApi } from './baseApi';

// Helper functions
const transformMedicationData = (response, searchValue = "") => {
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
    // Additional fields that might be present in other endpoints
    dosage: item.dosage,
    frequency: item.frequency,
    route: item.route,
    instructions: item.instructions,
    prescribedByName: item.prescribedByName,
    sourceType: item.sourceType,
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
      dosage: response.data.dosage,
      frequency: response.data.frequency,
      route: response.data.route,
      instructions: response.data.instructions,
      prescribedByName: response.data.prescribedByName,
      sourceType: response.data.sourceType,
      createdAt: response.data.createdAt,
      updatedAt: response.data.updatedAt
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
      query: ({ patientId, medicationData }) => {
        const params = {
          PatientId: patientId,
          MedicationId: medicationData.medicationNameId,
          StartDate: medicationData.startDate,
          EndDate: medicationData.endDate,
          IsActive: medicationData.isActive !== undefined ? medicationData.isActive : true
        };

        console.log('Add External Patient Medication Params:', params);

        return {
          url: '/PrescribedMedication/AddExternalPatientMedication',
          method: 'POST',
          params: params
        };
      },
      transformResponse: (response) => {
        console.log('Add External Patient Medication Response:', response);
        return transformSingleMedication(response);
      },
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'ExternalPatientMedication', id: patientId }
      ],
    }),

    // Update external patient medication
    updateExternalPatientMedication: builder.mutation({
      query: ({ medicationId, updates }) => {
        const params = {
          Id: medicationId,
          MedicationId: updates?.medicationNameId,
          StartDate: updates.startDate,
          EndDate: updates.endDate,
          IsActive: updates.isActive
        };

        console.log('Update External Patient Medication Params:', params);

        return {
          url: '/PrescribedMedication/UpdateExternalPatientMedication',
          method: 'PUT',
          params: params
        };
      },
      transformResponse: (response) => {
        console.log('Update External Patient Medication Response:', response);
        return transformSingleMedication(response);
      },
      invalidatesTags: (result, error, { medicationId }) => [
        { type: 'ExternalPatientMedication', id: medicationId }
      ],
    }),

    // Delete external patient medication
    deleteExternalPatientMedication: builder.mutation({
      query: (medicationId) => {
        const params = {
          Id: medicationId
        };

        console.log('Delete External Patient Medication Params:', params);

        return {
          url: '/PrescribedMedication/DeleteExternalPatientMedication',
          method: 'DELETE',
          params: params
        };
      },
      invalidatesTags: (result, error, medicationId) => [
        { type: 'ExternalPatientMedication', id: medicationId }
      ],
    }),

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