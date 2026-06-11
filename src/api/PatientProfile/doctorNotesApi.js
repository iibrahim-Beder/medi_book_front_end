import { baseApi } from '../baseApi';

// Transform note type

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
      noteType: response.data.noteType,
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
          ...(filter.noteType && { 'filter.NoteType': filter.noteType }),
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

  // ADD NOTE
    addDoctorPatientNote: builder.mutation({
      query: ({ patientId, noteData }) => {
        const params = {
          PatientId: patientId,
          NoteType:noteData.noteType,
          Content: noteData.content || ''
        };

        return {
          url: '/DoctorNote/AddDoctorPatientNote',
          method: 'POST',
          params
        };
      },

      transformResponse: (response) => transformSingleDoctorNote(response),
    async onQueryStarted(
      { patientId },
      { dispatch, queryFulfilled, getState }
    ) {
      const state = getState();
      const queries = state[baseApi.reducerPath]?.queries ?? {};

      try {
        const { data } = await queryFulfilled;

        const newNote = data.data; 

        Object.values(queries).forEach(entry => {
          if (entry?.endpointName === "getDoctorPatientNotes") {
            dispatch(
              doctorNotesApi.util.updateQueryData(
                "getDoctorPatientNotes",
                entry.originalArgs,
                (draft) => {
                  if (!draft?.data) return;

                  draft.data.unshift(newNote);
                }
              )
            );
          }
        });

      } catch (err) {
        console.error("Add note failed", err);
      }
    }
    }),

    // UPDATE NOTE
    updateDoctorPatientNote: builder.mutation({
      query: ({ noteId, updates }) => {
        const params = {
          Id: noteId,
          NoteType: updates.noteType,
          Content: updates.content || ''
        };

        return {
          url: '/DoctorNote/UpdateDoctorPatientNote',
          method: 'PUT',
          params
        };
      },

      transformResponse: (response) => transformSingleDoctorNote(response),

      async onQueryStarted(
        { noteId },
        { dispatch, queryFulfilled, getState }
      ) {
        const state = getState();
        const queries = state[baseApi.reducerPath]?.queries ?? {};

        try {
          const { data } = await queryFulfilled;
          console.log("RTK UPDATE RESPONSE", data);
          const updatedNote = data.data;

          Object.values(queries).forEach(entry => {
            if (entry?.endpointName === "getDoctorPatientNotes") {
              dispatch(
                doctorNotesApi.util.updateQueryData(
                  "getDoctorPatientNotes",
                  entry.originalArgs,
                  (draft) => {
                    if (!draft?.data) return;

                    const note = draft.data.find(n => n.id === noteId);
                    if (note) Object.assign(note, updatedNote);
                  }
                )
              );
            }
          });

        } catch (err) {
          console.error("Update failed", err);
        }
      },
    }),

    // DELETE NOTE
    deleteDoctorPatientNote: builder.mutation({
      query: (noteId) => ({
        url: '/DoctorNote/DeleteDoctorPatientNote',
        method: 'DELETE',
        params: { Id: noteId }
      }),

      async onQueryStarted(
        noteId,
        { dispatch, queryFulfilled, getState }
      ) {
        const state = getState();
        const queries = state[baseApi.reducerPath]?.queries ?? {};

        try {
          await queryFulfilled;

          Object.values(queries).forEach(entry => {
            if (entry?.endpointName === "getDoctorPatientNotes") {
              dispatch(
                doctorNotesApi.util.updateQueryData(
                  "getDoctorPatientNotes",
                  entry.originalArgs,
                  (draft) => {
                    if (!draft?.data) return;

                    draft.data = draft.data.filter(n => n.id !== noteId);
                  }
                )
              );
            }
          });

        } catch (err) {
          console.error("Delete failed", err);
        }
      },
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