import { baseApi } from './baseApi';

// Transform functions for medication data if needed
const transformMedicationData = (response, searchTerm = "") => {
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

  // You can add any data transformation here if needed
  const transformedData = response.data.map(item => ({
    id: item.id,
    prescribedMedicationId: item.id,
    dosage: item.dosage,
    durationInDays: item.durationInDays,
    instructions: item.instructions,
    createdAt: item.createdAt,
    medicationName: item.medicationName,
    medicationCategoryName: item.medicationCategoryName,
    prescriptionName: item.prescriptionName,
    diagnosisName: item.diagnosisName,
    highlightInfo: response.meta?.matchedItems?.find(matched => matched.id === item.id)
  }));

  return {
    ...response,
    data: transformedData,
    searchTerm: searchTerm
  };
};

export const prescribedMedicationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrescribedMedication: builder.query({
      query: ({ 
        patientId, 
        filter = {}, 
        orderBy, 
        pageNumber = 1, 
        pageSize = 10 
      }) => {
        const params = {
          PatientId: patientId,
          ...(filter.patientId && { 'PrescribedMedicationSearchFilter.PatientId': filter.patientId }),
          ...(filter.medicationId && { 'PrescribedMedicationSearchFilter.MedicationId': filter.medicationId }),
          ...(filter.medicationCategoryId && { 'PrescribedMedicationSearchFilter.MedicationCategoryId': filter.medicationCategoryId }),
          ...(filter.fromDate && { 'PrescribedMedicationSearchFilter.FromDate': filter.fromDate }),
          ...(filter.toDate && { 'PrescribedMedicationSearchFilter.ToDate': filter.toDate }),
          ...(filter.searchValue && { 'PrescribedMedicationSearchFilter.SearchValue': filter.searchValue }),
          ...(orderBy && { 'PrescribedMedicationOrdering': orderBy }),
          ...(pageNumber && { 'PageNumber': pageNumber }),
          ...(pageSize && { 'PageSize': pageSize })
        };

        console.log('Prescribed Medication API Request Params:', params);

        return {
          url: '/PrescribedMedication/GetPrescribedMedication',
          params,
          timeout: 10000
        };
      },
      transformResponse: (response, meta, args) => {
        console.log('Prescribed Medication API Response:', response);
        return transformMedicationData(response, args.filter?.searchValue);
      },
      transformErrorResponse: (response, meta, args) => {
        console.error('Prescribed Medication API Error:', response);
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
        { type: 'PrescribedMedication', id: patientId }
      ],
    }),

    // Add new prescribed medication
    addPrescribedMedication: builder.mutation({
      query: (medicationData) => ({
        url: '/PrescribedMedication/AddPrescribedMedication',
        method: 'POST',
        body: medicationData
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'PrescribedMedication', id: patientId }
      ],
    }),

    // Update prescribed medication
    updatePrescribedMedication: builder.mutation({
      query: ({ medicationId, updates }) => ({
        url: `/PrescribedMedication/UpdatePrescribedMedication/${medicationId}`,
        method: 'PUT',
        body: updates
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'PrescribedMedication', id: patientId }
      ],
    }),

    // Delete prescribed medication
    deletePrescribedMedication: builder.mutation({
      query: (medicationId) => ({
        url: `/PrescribedMedication/DeletePrescribedMedication/${medicationId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'PrescribedMedication', id: patientId }
      ],
    })
  }),
});

export const {
  useGetPrescribedMedicationQuery,
  useLazyGetPrescribedMedicationQuery,
  useAddPrescribedMedicationMutation,
  useUpdatePrescribedMedicationMutation,
  useDeletePrescribedMedicationMutation,
} = prescribedMedicationApi;