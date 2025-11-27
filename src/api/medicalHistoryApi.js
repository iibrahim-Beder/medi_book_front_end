// medicalHistoryApi.js
import { baseApi } from './baseApi';

// Transform history type
const transformHistoryTypeToAPI = (historyType) => {
  const historyTypeMap = {
    'Surgery': 1,
    'Accident': 2,
    'Hospitalization': 3,
    'Family History': 4,
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
    hereditaryDiseaseName: item.hereditaryDiseaseName,
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
        const params = {
          PatientId: patientId,
          HistoryType: transformHistoryTypeToAPI(historyData.historyType),
          // HereditaryDiseaseId: 34, 
          // ...(historyData.hereditaryDiseaseName && { HereditaryDiseaseName: 22 }),
          // ...(historyData.hereditaryDiseaseName && { HereditaryDiseaseName: historyData.hereditaryDiseaseName }),
          ...(historyData.description && { Description: historyData.description }),
          ...(historyData.dateOfEvent && { DateOfEvent: historyData.dateOfEvent }),
          ...(historyData.relatedPerson && { RelatedPerson: historyData.relatedPerson }),
          ...(historyData.notes && { Notes: historyData.notes })
        };

        console.log('Add Medical History Params:', params);

        return {
          url: '/MedicalHistory/AddPatientMedicalHistory',
          method: 'POST',
          params: params
        };
      },
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'MedicalHistory', id: patientId }
      ],
    }),



    // Update medical history record
   updateMedicalHistory: builder.mutation({
  query: ({ historyId, updates }) => {
    const params = {
      Id: historyId,
      HistoryType: transformHistoryTypeToAPI(updates.historyType),
      HereditaryDiseaseId: 29,
      ...(updates.hereditaryDiseaseName && { HereditaryDiseaseName: updates.hereditaryDiseaseName }),
      ...(updates.description && { Description: updates.description }),
      ...(updates.dateOfEvent && { DateOfEvent: updates.dateOfEvent }),
      ...(updates.relatedPerson && { RelatedPerson: updates.relatedPerson }),
      ...(updates.notes && { Notes: updates.notes })
    };

    console.log('Update Medical History Params:', params);

    return {
      url: '/MedicalHistory/UpdatePatientMedicalHistory',
      method: 'PATCH', 
      params: params 
    };
  },
  invalidatesTags: (result, error, { patientId }) => [
    { type: 'MedicalHistory', id: patientId }
  ],
}),

    
    // Delete medical history record
deleteMedicalHistory: builder.mutation({
  query: ({ historyId }) => ({
    url: `/MedicalHistory/DeletePatientMedicalHistory?Id=${historyId}`,
    method: 'DELETE'
  }),
  invalidatesTags: (result, error, { patientId }) => [
    { type: 'MedicalHistory', id: patientId }
  ],
})
  }),
});

export const {
  useGetPatientMedicalHistoryQuery,
  useLazyGetPatientMedicalHistoryQuery,
  useAddMedicalHistoryMutation,
  useUpdateMedicalHistoryMutation,
  useDeleteMedicalHistoryMutation,
} = medicalHistoryApi;