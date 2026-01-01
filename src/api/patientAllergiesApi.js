import { baseApi } from './baseApi';

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
      updatedAt: response.data.updatedAt
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
    severity: transformSeverityToUI(item.severity),
    severityValue: item.severity,
    isActive: item.isActive,
    dateNoted: item.dateNoted,
    reaction: item.reaction,
    notes: item.notes,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    // highlight from meta  response
    highlightInfo: response.meta?.matchedItems?.find(matched => matched.id === item.id)
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
      query: ({ patientId, allergyData }) => {
        const params = {
          PatientId: patientId,
          AllergenId: allergyData.allergenId,
          Severity: transformSeverityToAPI(allergyData.severity),
          IsActive: allergyData.isActive !== undefined ? allergyData.isActive : true,
          DateNoted: allergyData.dateNoted,
          Reaction: allergyData.reaction || '',
          Notes: allergyData.notes || ''
        };

        console.log('Add Patient Allergy Params:', params);

        return {
          url: '/PatientAllergies/AddPatientAllergie',
          method: 'POST',
          params: params
        };
      },
      transformResponse: (response) => {
        console.log('Add Patient Allergy Response:', response);
        return transformSingleAllergy(response);
      },
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'PatientAllergy', id: patientId }
      ],
    }),

    // Update patient allergy
    updatePatientAllergy: builder.mutation({
      query: ({ allergyId, updates }) => {
        const params = {
          Id: allergyId,
          AllergenId: updates.allergenId,
          Severity: transformSeverityToAPI(updates.severity),
          IsActive: updates.isActive,
          DateNoted: updates.dateNoted,
          Reaction: updates.reaction || '',
          Notes: updates.notes || ''
        };

        console.log('Update Patient Allergy Params:', params);

        return {
          url: '/PatientAllergies/UpdatePatientAllergie',
          method: 'PUT',
          params: params
        };
      },
      transformResponse: (response) => {
        console.log('Update Patient Allergy Response:', response);
        return transformSingleAllergy(response);
      },
      invalidatesTags: (result, error, { allergyId }) => [
        { type: 'PatientAllergy', id: allergyId }
      ],
    }),


 deletePatientAllergy: builder.mutation({
  query: ({ allergyId, patientId }) => ({
    url: `/PatientAllergies/DeletePatientAllergie?id=${allergyId}`,
    method: 'DELETE'
  }),
  invalidatesTags: (result, error, { patientId }) => [
    { type: 'PatientAllergies', id: patientId },
    { type: 'PatientAllergies', id: 'LIST' }
  ],
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