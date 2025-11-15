import { baseApi } from './baseApi';

// Transform note type
const transformNoteTypeToAPI = (noteType) => {
  const noteTypeMap = {
    'Consultation': 1,
    'FollowUp': 2, 
    'Reminder': 3,
    'General': 4
  };
  return noteTypeMap[noteType] ?? null;
};

const transformNoteTypeToUI = (noteType) => {
  const noteTypeMap = {
    1: 'Consultation',
    2: 'FollowUp',
    3: 'Reminder', 
    4: 'General'
  };
  return noteTypeMap[noteType] ?? 'General';
};

const transformDoctorNotesData = (response, searchText = "") => {
  if (!response || !response.succeeded) {
    return {
      data: [],
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      searchText: searchText,
      succeeded: false
    };
  }

  if (!response.data) return {
    ...response,
    data: [],
    searchText: searchText
  };

  const transformedData = response.data.map(item => ({
    id: item.id,
    noteId: item.id,
    noteType: transformNoteTypeToUI(item.noteType),
    noteTypeValue: item.noteType,
    content: item.content,
    createdAt: item.createdAt,
    lastModifiedAt: item.lastModifiedAt,
    isExpanded: false,
    isNew: false,
    highlightInfo: response.meta?.matchedItems?.find(matched => matched.id === item.id)
  }));

  return {
    ...response,
    data: transformedData,
    searchText: searchText
  };
};

export const doctorNotesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDoctorPatientNotes: builder.query({
      query: ({ 
        patientId, 
        filter = {}, 
        orderBy, 
        pageNumber = 1, 
        pageSize = 10 
      }) => {
        const params = {
          PatientId: patientId,
          ...(filter.noteType && { 'filter.NoteType': transformNoteTypeToAPI(filter.noteType) }),
          ...(filter.searchText && { 'filter.SearchText': filter.searchText }),
          ...(filter.fromDate && { 'filter.FromDate': filter.fromDate }),
          ...(filter.toDate && { 'filter.ToDate': filter.toDate }),
          ...(orderBy?.orderBy && { 'orderBy.OrderBy': orderBy.orderBy }),
          ...(orderBy?.isAscending !== undefined && { 'orderBy.IsAscending': orderBy.isAscending }),
          ...(pageNumber && { 'PageNumber': pageNumber }),
          ...(pageSize && { 'PageSize': pageSize })
        };

        console.log('Doctor Notes API Request Params:', params);

        return {
          url: '/DoctorNote/GetDoctorPatientNotes',
          params,
          timeout: 10000
        };
      },
      transformResponse: (response, meta, args) => {
        console.log('Doctor Notes API Response:', response);
        return transformDoctorNotesData(response, args.filter?.searchText);
      },
      transformErrorResponse: (response, meta, args) => {
        console.error('Doctor Notes API Error:', response);
        return transformDoctorNotesData(
          { 
            succeeded: false, 
            error: response.data,
            status: response.status 
          }, 
          args.filter?.searchText
        );
      },
      providesTags: (result, error, { patientId }) => [
        { type: 'DoctorNotes', id: patientId }
      ],
    }),

    // Add new doctor note
    addDoctorNote: builder.mutation({
      query: (noteData) => ({
        url: '/DoctorNote/AddDoctorNote',
        method: 'POST',
        body: noteData
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'DoctorNotes', id: patientId }
      ],
    }),

    // Update doctor note
    updateDoctorNote: builder.mutation({
      query: ({ noteId, updates }) => ({
        url: `/DoctorNote/UpdateDoctorNote/${noteId}`,
        method: 'PUT',
        body: updates
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'DoctorNotes', id: patientId }
      ],
    }),

    // Delete doctor note
    deleteDoctorNote: builder.mutation({
      query: (noteId) => ({
        url: `/DoctorNote/DeleteDoctorNote/${noteId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'DoctorNotes', id: patientId }
      ],
    })
  }),
});

export const {
  useGetDoctorPatientNotesQuery,
  useLazyGetDoctorPatientNotesQuery,
  useAddDoctorNoteMutation,
  useUpdateDoctorNoteMutation,
  useDeleteDoctorNoteMutation,
} = doctorNotesApi;