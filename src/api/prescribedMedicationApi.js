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
      transformResponse: (response, meta, arg) => {
        console.log('Add Prescribed Medication Response:', response);
        return response;
      },
      transformErrorResponse: (response, meta, arg) => {
        console.error('Add Prescribed Medication Error:', response);
        return response;
      },
      invalidatesTags: (result, error, arg) => [
        { type: 'PrescribedMedication', id: 'LIST' }
      ],
    }),   
    // Update prescribed medication - CORRECTED
    updatePrescribedMedication: builder.mutation({
      query: ({ prescribedMedicationId, updates }) => {
        console.log('Update Prescribed Medication Params:', prescribedMedicationId, updates);
        const body = {
          prescribedMedicationId: prescribedMedicationId,
          medicationId: updates.medicationId||40,
          dosage: updates.dosage,
          durationInDays: updates.durationInDays,
          instructions: updates.instructions,
          startDate: updates.startDate || new Date().toISOString(),
          endDate: updates.endDate || new Date().toISOString(),
          isActive: updates.isActive !== undefined ? updates.isActive : true
        };

        console.log('Update Prescribed Medication Body:', body);

        return {
          url: '/PrescribedMedication/UpdatePrescribedMedication',
          method: 'PUT',
          body: body
        };
      },
      invalidatesTags: (result, error, { prescribedMedicationId }) => [
        { type: 'PrescribedMedication', id: prescribedMedicationId }
      ],
    }),

    // Delete prescribed medication - CORRECTED
    deletePrescribedMedication: builder.mutation({
      query: (prescribedMedicationId) => {
        const params = {
          Id: prescribedMedicationId
        };

        console.log('Delete Prescribed Medication Params:', params);

        return {
          url: '/PrescribedMedication/DeletePrescribedMedication',
          method: 'DELETE',
          params: params
        };
      },
      invalidatesTags: (result, error, prescribedMedicationId) => [
        { type: 'PrescribedMedication', id: prescribedMedicationId }
      ],
    }),
  }),
});

export const {
  useGetPrescribedMedicationQuery,
  useLazyGetPrescribedMedicationQuery,
  useAddPrescribedMedicationMutation,
  useUpdatePrescribedMedicationMutation,
  useDeletePrescribedMedicationMutation,
} = prescribedMedicationApi;