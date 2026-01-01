import { baseApi } from './baseApi';

// Transform note type
const transformNoteTypeToAPI = (noteType) => {
  const noteTypeMap = {
    'Communication': 1,
    'Administrative': 2, 
    'Reminder': 3,
  };
  return noteTypeMap[noteType] ?? null;
};

const transformNoteTypeToUI = (noteType) => {
  const noteTypeMap = {
    1: 'Communication',
    2: 'Administrative',
    3: 'Reminder', 
  };
  return noteTypeMap[noteType] ?? 'General';
};

const transformSingleDoctorNote = (response) => {
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
      noteType: transformNoteTypeToAPI(response.data.noteType),
      noteTypeValue: response.data.noteType,
      content: response.data.content,
      createdAt: response.data.createdAt,
      lastModifiedAt: response.data.lastModifiedAt,
      patientId: response.data.patientId,
      doctorId: response.data.doctorId,
      doctorName: response.data.doctorName
    }
  };
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
    noteType: item.noteType,
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
        { type: 'DoctorNote', id: patientId }
      ],
    }),

addDoctorPatientNote: builder.mutation({
      query: ({ patientId, noteData }) => {
        const params = {
          PatientId: patientId,
          NoteType: transformNoteTypeToAPI(noteData.noteType),
          Content: noteData.content || ''
        };

        console.log('Add Doctor Patient Note Params:', params);

        return {
          url: '/DoctorNote/AddDoctorPatientNote',
          method: 'POST',
          params: params
        };
      },
      transformResponse: (response) => {
        console.log('Add Doctor Patient Note Response:', response);
        return transformSingleDoctorNote(response);
      },
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'DoctorNote', id: patientId }
      ],
    }),

    // Update doctor patient note
    updateDoctorPatientNote: builder.mutation({
      query: ({ noteId, updates }) => {
        const params = {
          Id: noteId,
          NoteType: transformNoteTypeToAPI(updates.noteType),
          Content: updates.content || ''
        };

        console.log('Update Doctor Patient Note Params:', params);

        return {
          url: '/DoctorNote/UpdateDoctorPatientNote',
          method: 'PUT',
          params: params
        };
      },
      transformResponse: (response) => {
        console.log('Update Doctor Patient Note Response:', response);
        return transformSingleDoctorNote(response);
      },
      invalidatesTags: (result, error,  { patientId }) => [
        { type: 'DoctorNote', id: patientId }
      ],
    }),

    // Delete doctor patient note
    deleteDoctorPatientNote: builder.mutation({
      query: (noteId) => {
        const params = {
          Id: noteId
        };

        console.log('Delete Doctor Patient Note Params:', params);

        return {
          url: '/DoctorNote/DeleteDoctorPatientNote',
          method: 'DELETE',
          params: params
        };
      },
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'DoctorNote', id: patientId }
      ],
    }),
  }),
});

export const {
  useGetDoctorPatientNotesQuery,
  useLazyGetDoctorPatientNotesQuery,
  useAddDoctorPatientNoteMutation,
  useUpdateDoctorPatientNoteMutation,
  useDeleteDoctorPatientNoteMutation,
} = doctorNotesApi;