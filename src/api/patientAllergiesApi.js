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
      transformResponse: (response, meta, args) => 
        transformAllergiesData(response, args.filter?.searchValue),
      providesTags: (result, error, { patientId }) => [
        { type: 'PatientAllergies', id: patientId }
      ],
    }),

    //Adding a new Allergy (in the future)
    addPatientAllergy: builder.mutation({
      query: ({ patientId, allergyData }) => ({
        url: '/PatientAllergies/AddPatientAllergy',
        method: 'POST',
        body: {
          patientId,
          ...allergyData
        }
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'PatientAllergies', id: patientId }
      ],
    }),

    // update Allergy (in the future)
    updatePatientAllergy: builder.mutation({
      query: ({ allergyId, updates }) => ({
        url: `/PatientAllergies/UpdatePatientAllergy/${allergyId}`,
        method: 'PUT',
        body: updates
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'PatientAllergies', id: patientId }
      ],
    }),

    // delete Allergy (in the future)
    deletePatientAllergy: builder.mutation({
      query: (allergyId) => ({
        url: `/PatientAllergies/DeletePatientAllergy/${allergyId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'PatientAllergies', id: patientId }
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