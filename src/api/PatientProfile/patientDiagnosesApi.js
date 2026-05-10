import { baseApi } from '../baseApi';
const getSeverityValue = (severityText) => {
  const severityMap = {
    "Mild": 1,
    "Moderate": 2,
    "Severe": 3
  };
  return severityMap[severityText] || 1;
};


// Helper function to convert status text to number
const getStatusValue = (statusText) => {
  const statusMap = {
    "Active": 1,
    "Completed": 2, 
    "Cancelled": 3,
    "Expired": 4
  };
  return statusMap[statusText] || 0;
};

// Helper function to convert status number to text
const getStatusText = (status) => {
  const statusMap = {
    0: "Active",
    1: "Completed", 
    2: "Cancelled",
    3: "Pending",
    4: "Expired"
  };
  return statusMap[status] || "Unknown";
};

const transformDiagnosesData = (response, searchValue = "") => {
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
    id: item.diagnosisId,
    diagnosisId: item.diagnosisId,
    diagnosisName: item.diagnosisName,
    code: item.code,
    symptomsDescription: item.symptomsDescription,
    description: item.description,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    prescriptionOverviews: item.prescriptionOverviews || [],
    diagnosisNoteOverviews: item.diagnosisNoteOverviews || [],
    patientInternalMedicalConditionLinkOverViews: item.patientInternalMedicalConditionLinkOverViews || []
  }));

  return {
    ...response,
    data: transformedData,
    currentPage: response.currentPage || 1,
    totalPages: response.totalPages || 1,
    totalCount: response.totalCount || 0,
    pageSize: response.pageSize || 3,
    hasPreviousPage: response.hasPreviousPage || false,
    hasNextPage: response.hasNextPage || false,
    searchValue: searchValue
  };
};

export const patientDiagnosesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatientDiagnoses: builder.query({
      query: ({ 
        patientId, 
        filter = {}, 
        orderBy=1, 
        pageNumber = 1, 
        pageSize = 3
      }) => {
        const params = {
          PatientId: patientId,
          ...(filter.searchValue && { 'DiagnosisSearchFilter.SearchValue': filter.searchValue }),
          ...(filter.fromDate && { 'DiagnosisSearchFilter.FromDate': filter.fromDate }),
          ...(filter.toDate && { 'DiagnosisSearchFilter.ToDate': filter.toDate }),
          ...(filter.prescriptionStatus !== undefined && { 'DiagnosisSearchFilter.PrescriptionStatus': filter.prescriptionStatus }),
          ...(filter.medicalConditionId && { 'DiagnosisSearchFilter.MedicalConditionId': filter.medicalConditionId }),
          ...(filter.medicationId && { 'DiagnosisSearchFilter.MedicationId': filter.medicationId }),
          ...(filter.medicationCategoryId && { 'DiagnosisSearchFilter.MedicationCategoryId': filter.medicationCategoryId }),
          ...(orderBy && { 'DiagnosisOrder': orderBy }),
          ...(pageNumber && { 'PageNumber': pageNumber }),
          ...(pageSize && { 'PageSize': pageSize })
        };

        console.log('Patient Diagnoses API Request Params:', params);

        return {
          url: '/PatientDiagnoses/GetPatientDiagnoses',
          params,
          timeout: 10000
        };
      },
      transformResponse: (response, meta, args) => {
        console.log('Patient Diagnoses API Response:', response);
        return transformDiagnosesData(response, args.filter?.searchValue);
      },
      transformErrorResponse: (response, meta, args) => {
        console.error('Patient Diagnoses API Error:', response);
        return transformDiagnosesData(
          { 
            succeeded: false, 
            error: response.data,
            status: response.status 
          }, 
          args.filter?.searchValue
        );
      },
      providesTags: (result, error, { patientId }) => [
        { type: 'PatientDiagnoses', id: patientId }
      ],
    }),

addPatientDiagnosis: builder.mutation({
  query: (args) => {
    console.log("All Arguments:", args);
    console.log("Diagnosis Data:", args?.diagnosisData);
    
    if (!args?.diagnosisData && args?.diagnosisName) {
      args = { diagnosisData: args };
    }
    
    const diagnosisData = args?.diagnosisData;
    
    if (!diagnosisData) {
      throw new Error('Diagnosis data is required');
    }

    const body = {
      diagnosisName: diagnosisData.diagnosisName,
      bookingId: diagnosisData.bookingId || 73  ,
      code: diagnosisData.code || "DX-000",
      symptomsDescription: diagnosisData.symptomsDescription,
      description: diagnosisData.description,
      prescriptions: (diagnosisData.prescriptions || []).map(prescription => ({
        diagnosisId: 22,
        title: prescription.title,
        notes: prescription.notes,
        status: getStatusValue(prescription.status),
        prescribedMedications: (prescription.recipes || []).map(med => ({
          PrescriptionId: 22,
          medicationId: med.medication.id,
          startDate: med.startDate || new Date().toISOString(),
          endDate: med.endDate || new Date(Date.now() + (med.durationInDays || 1) * 24 * 60 * 60 * 1000).toISOString(),
          dosage: med.dosage,
          durationInDays: med.durationInDays,
          instructions: med.instructions
        }))
      })),
      internalMedicalConditions: (diagnosisData.conditions || []).map(condition => ({
        diagnosisId:20,
        medicalConditionId:22,
        severity: getSeverityValue(condition.severity),
        isActive: true,
        notes: condition.notes
      })),
      diagnosisNotes: (diagnosisData.notes || []).map(note => ({
        diagnosisId: 0,
        content: note.note
      }))
    };

    console.log('Add Patient Diagnosis Body:', body);

    return {
      url: '/PatientDiagnoses/AddPatientDiagnosis',
      method: 'POST',
      body: body
    };
  },
    async onQueryStarted(
      { patientId },
      { dispatch, queryFulfilled, getState }
    ) {
      const state = getState();
      const queries = state[baseApi.reducerPath]?.queries ?? {};
  
      try {
        const { data } = await queryFulfilled;
        const added = data?.data;
        if (!added) return

        console.log("added$$$",added)

        Object.values(queries).forEach(entry => {
          if (entry?.endpointName === "getPatientDiagnoses") {
            dispatch(
              patientDiagnosesApi.util.updateQueryData(
                "getPatientDiagnoses",
                entry.originalArgs,
                draft => {
                  draft.data.unshift(added);
                }
              )
            );
          }
        });
      } catch {
        // rollback handled by RTK
      }
    },
  transformErrorResponse: (response, meta, args) => {
    console.error('Add Patient Diagnosis API Error:', response);

    response.data.message=formatErrorMessage(response.data.message);
    return response;
  },
  invalidatesTags: (result, error, args) => [
    { type: '', id: args?.patientId || 'LIST' }
  ],
}),

    // Update patient diagnosis - UPDATED
updatePatientDiagnosis: builder.mutation({
  query: ({ diagnosisId, updates, patientId }) => { 
    console.log('Update Diagnosis Params:', updates);

    return {
      url: '/PatientDiagnoses/UpdatePatientDiagnosis',
      method: 'PATCH',
      body: {
        diagnosisId: diagnosisId,
        ...updates
      },
    };
  },
  async onQueryStarted(
    { diagnosisId, updates, patientId },
    { dispatch, queryFulfilled, getState }
  ) {
    // Find all queries with this patientId and update them
    const patchResults = [];
    
    // Get all query cache entries for getPatientDiagnoses
    const queryCache = patientDiagnosesApi.util.selectInvalidatedBy(getState(), [
      { type: 'PatientDiagnoses', id: patientId }
    ]);
    
    for (const { endpointName, originalArgs } of queryCache) {
      if (endpointName === 'getPatientDiagnoses') {
        const patch = dispatch(
          patientDiagnosesApi.util.updateQueryData(
            'getPatientDiagnoses',
            originalArgs,
            (draft) => {
              if (!draft || !draft.data) return;
              
              const diagnosisIndex = draft.data.findIndex(
                d => d.diagnosisId === diagnosisId
              );
              
              if (diagnosisIndex !== -1) {
                console.log("Updating diagnosis optimistically:", diagnosisId);
                // Update the specific diagnosis
                draft.data[diagnosisIndex] = {
                  ...draft.data[diagnosisIndex],
                  ...updates,
                  updatedAt: new Date().toISOString()
                };
              }
            }
          )
        );
        patchResults.push(patch);
      }
    }

    try {
      await queryFulfilled;
      // console.log("Update successful!");
    } catch (error) {
      // console.error("Update failed, rolling back:", error);
      // Revert all optimistic updates
      patchResults.forEach(patch => patch.undo());
    }
  },
}),

deletePatientDiagnosis: builder.mutation({
  query: ({ diagnosisId }) => {
    console.log('Deleting diagnosis with ID:', diagnosisId);

    return {
      url: '/PatientDiagnoses/DeletePatientDiagnosis',
      method: 'DELETE',
      params: { diagnosisId }
    };
  },
  async onQueryStarted(
    { diagnosisId, patientId },
    { dispatch, queryFulfilled, getState }
  ) {
    const cacheEntries = patientDiagnosesApi.util.selectInvalidatedBy(
      getState(),
      [{ type: 'PatientDiagnoses', id: patientId }]
    );

    const patches = [];

    for (const { endpointName, originalArgs } of cacheEntries) {
      if (endpointName === 'getPatientDiagnoses') {
        const patch = dispatch(
          patientDiagnosesApi.util.updateQueryData(
            'getPatientDiagnoses',
            originalArgs,
            draft => {
              if (!draft?.data) return;

              draft.data = draft.data.filter(
                d => d.diagnosisId !== diagnosisId
              );

              draft.totalCount = Math.max(0, draft.totalCount - 1);
            }
          )
        );
        patches.push(patch);
      }
    }

    try {
      await queryFulfilled;
    } catch {
      patches.forEach(p => p.undo());
    }
  },
}),
 // Add diagnosis note 
    addDiagnosisNote: builder.mutation({
      query: ({ diagnosisId, content }) => {
        const body = {
          diagnosisId: diagnosisId,
          content: content
        };

        console.log('Add Diagnosis Note Params:', body);

        return {
          url: '/PatientDiagnoses/AddDiagnosisNote',
          method: 'POST',
          body: body
        };
      },
       async onQueryStarted(
    { diagnosisId, content },
    { dispatch, queryFulfilled, getState }
  ) {
    const state = getState();
    const queries = state[baseApi.reducerPath]?.queries ?? {};
    const patches = [];

    try {
      const { data } = await queryFulfilled;
      const realNote = data.data;

      // replace optimistic with actual
      Object.values(queries).forEach(entry => {
        if (entry?.endpointName === "getPatientDiagnoses") {
          dispatch(
            patientDiagnosesApi.util.updateQueryData(
              "getPatientDiagnoses",
              entry.originalArgs,
              draft => {
                const diag = draft.data.find(d => d.diagnosisId === diagnosisId);
                if (!diag) return;

                diag.diagnosisNoteOverviews =
                  diag.diagnosisNoteOverviews.filter(n => !n.optimistic);

                diag.diagnosisNoteOverviews.unshift(realNote);
              }
            )
          );
        }
      });
    } catch (err) {
      patches.forEach(p => p.undo());
    }
  },
      invalidatesTags: (result, error, { diagnosisId }) => [
        { type: 'PatientDiagnoses', id: diagnosisId }
      ],
    }),

    // Update diagnosis note 
    updateDiagnosisNote: builder.mutation({
      query: ({ diagnosisNoteId, noteContent }) => {
        const params = {
          diagnosisNoteId: diagnosisNoteId,
          noteContent: noteContent
        };

        console.log('Update Diagnosis Note Params:', params);

        return {
          url: '/PatientDiagnoses/UpdateDiagnosisNote',
          method: 'PATCH',
          body: params
        };
      },
      async onQueryStarted(
    { diagnosisId, diagnosisNoteId, noteContent },
    { dispatch, queryFulfilled, getState }
  ) {
    const state = getState();
    const queries = state[baseApi.reducerPath]?.queries ?? {};
    const patches = [];


    try {
      const { data } = await queryFulfilled;
      const updatedNote = data.data;

      // replace optimistic with real data
      Object.values(queries).forEach(entry => {
        if (entry.endpointName === "getPatientDiagnoses") {
          dispatch(
            patientDiagnosesApi.util.updateQueryData(
              "getPatientDiagnoses",
              entry.originalArgs,
              draft => {
                const diag = draft.data.find(d => d.diagnosisId === diagnosisId);
                if (!diag) return;

                const index = diag.diagnosisNoteOverviews.findIndex(n => n.id === diagnosisNoteId);
                if (index !== -1) {
                  diag.diagnosisNoteOverviews[index] = updatedNote;
                }
              }
            )
          );
        }
      });

    } catch (err) {
      patches.forEach(p => p.undo());
    }
  },
      invalidatesTags: (result, error, { diagnosisId }) => [
        { type: 'PatientDiagnoses', id: diagnosisId }
      ],
    }),

    // Delete diagnosis note 
    deleteDiagnosisNote: builder.mutation({
      query: ({diagnosisNoteId}) => {
        const params = {
          diagnosisNoteId: diagnosisNoteId
        };

        console.log('Delete Diagnosis Note Params:', params);

        return {
          url: '/PatientDiagnoses/DeleteDiagnosisNote',
          method: 'DELETE',
          params: params
        };
      },
       async onQueryStarted(
    { diagnosisId, diagnosisNoteId },
    { dispatch, queryFulfilled, getState }
  ) {
    const state = getState();
    const queries = state[baseApi.reducerPath]?.queries ?? {};
    const patches = [];

    Object.values(queries).forEach(entry => {
      if (entry.endpointName === "getPatientDiagnoses") {
        const patch = dispatch(
          patientDiagnosesApi.util.updateQueryData(
            "getPatientDiagnoses",
            entry.originalArgs,
            draft => {
              const diag = draft.data.find(d => d.diagnosisId === diagnosisId);
              if (!diag) return;

              diag.diagnosisNoteOverviews =
                diag.diagnosisNoteOverviews.filter(n => n.id !== diagnosisNoteId);
            }
          )
        );

        patches.push(patch);
      }
    });

    try { 
      await queryFulfilled;
    } catch (err) {
      patches.forEach(p => p.undo());
    }
  },
      invalidatesTags: (result, error, diagnosisNoteId) => [
        { type: 'PatientDiagnoses', id: 'LIST' }
      ],
    }),

    // Get diagnosis notes 
    getDiagnosisNotes: builder.query({
      query: (diagnosisId) => {
        const params = {
          DiagnosisId: diagnosisId
        };

        return {
          url: '/PatientDiagnoses/GetDiagnosisNotes',
          params: params
        };
      },
      providesTags: (result, error, diagnosisId) => [
        { type: 'DiagnosisNote', id: diagnosisId }
      ],
    })
  }),
});

export const {
  useGetPatientDiagnosesQuery,
  useLazyGetPatientDiagnosesQuery,
  useAddPatientDiagnosisMutation,
  useUpdatePatientDiagnosisMutation,
  useDeletePatientDiagnosisMutation,
  useAddDiagnosisNoteMutation,
  useUpdateDiagnosisNoteMutation,
  useDeleteDiagnosisNoteMutation,
  useGetDiagnosisNotesQuery,
} = patientDiagnosesApi;

const formatErrorMessage = (errorMessage) => {
  console.log('before Formatted Error Message:', errorMessage);
  if (!errorMessage) return errorMessage;

  const regex = /^([a-zA-Z]+)\[(\d+)\]\.([a-zA-Z]+):\s*(.+)$/;

  const match = errorMessage.match(regex);

  if (match) {
    const [, entity, indexStr, field, message] = match;

    const index = Number(indexStr);

    const formattedEntity = entity.toLowerCase().replace(/s$/, '');
    const formattedField = field.toLowerCase();
    const formattedMessage = message.charAt(0).toUpperCase() + message.slice(1);

    return `${formattedEntity} ${index + 1}, ${formattedField} : ${formattedMessage}`;
  }
};
