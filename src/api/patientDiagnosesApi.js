// patientDiagnosesApi.js
import { baseApi } from './baseApi';
const getSeverityValue = (severityText) => {
  const severityMap = {
    "Mild": 1,
    "Moderate": 2,
    "Severe": 3
  };
  return severityMap[severityText] || 1;
};

// Helper function to convert medical condition name to ID
const getMedicalConditionId = (conditionName) => {
  const conditionMap = {
    "Diabetes": 1,
    "Hypertension": 2,
    "Asthma": 3,
    "Heart Disease": 4,
    "Cancer": 5,
    "Mental Health Disorders": 6,
    "Other": 7,
    "Rheumatic tricuspid insufficiency": 8,
    "Seasonal allergies": 9
    // Add more conditions as needed
  };
  return conditionMap[conditionName] || 1;
};

// Helper function to convert status text to number
const getStatusValue = (statusText) => {
  const statusMap = {
    "Active": 0,
    "Completed": 1, 
    "Cancelled": 2,
    "Pending": 3,
    "Expired": 4
  };
  return statusMap[statusText] || 0;
};

// Helper function to convert medication name to ID
const getMedicationId = (medicationName) => {
  const medicationMap = {
    "Ibuprofen": 1,
    "Paracetamol": 2,
    "Amoxicillin": 3,
    "Aspirin": 4,
    "Metformin": 5,
    "Atorvastatin": 6,
    "Lisinopril": 7,
    "Levothyroxine": 8,
    "Amlodipine": 9,
    "Omeprazole": 10,
    "Guaifenesin Syrup": 11,
    "Cough Syrup": 12
  };
  return medicationMap[medicationName] || 1;
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
    pageSize: response.pageSize || 10,
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
        pageSize = 10 
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
      bookingId: diagnosisData.bookingId || 1,
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
          medicationId:22,
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
  invalidatesTags: (result, error, args) => [
    { type: '', id: args?.patientId || 'LIST' }
  ],
}),

    // Update patient diagnosis - UPDATED
    updatePatientDiagnosis: builder.mutation({
      query: ({ diagnosisId, updates }) => {
        const body = {
          diagnosisId: diagnosisId,
          diagnosisName: updates.diagnosisName,
          code: updates.code,
          symptomsDescription: updates.symptomsDescription,
          description: updates.description
          // Note: For update, you might want to handle prescriptions, conditions, and notes separately
        };

        console.log('Update Patient Diagnosis Body:', body);

        return {
          url: '/PatientDiagnoses/UpdatePatientDiagnosis',
          method: 'PATCH',
          body: body
        };
      },
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'PatientDiagnoses', id: patientId }
      ],
    }),

    deletePatientDiagnosis: builder.mutation({
  query: (diagnosisId) => {
    console.log('Deleting diagnosis with ID:', diagnosisId);
    
    return {
      url: '/PatientDiagnoses/DeletePatientDiagnosis',
      method: 'DELETE',
      params: { diagnosisId }
    };
  },
  invalidatesTags: (result, error, diagnosisId) => [
    { type: 'PatientDiagnoses', id: 'LIST' },
    { type: 'PatientDiagnoses', id: diagnosisId }
  ],
}),
 // Add diagnosis note 
    addDiagnosisNote: builder.mutation({
      query: ({ diagnosisId, content }) => {
        const params = {
          DiagnosisId: diagnosisId,
          Content: content
        };

        console.log('Add Diagnosis Note Params:', params);

        return {
          url: '/PatientDiagnoses/AddDiagnosisNote',
          method: 'POST',
          params: params
        };
      },
      invalidatesTags: (result, error, { diagnosisId }) => [
        { type: 'PatientDiagnoses', id: diagnosisId }
      ],
    }),

    // Update diagnosis note 
    updateDiagnosisNote: builder.mutation({
      query: ({ diagnosisNoteId, noteContent }) => {
        const params = {
          DiagnosisNoteId: diagnosisNoteId,
          NoteContent: noteContent
        };

        console.log('Update Diagnosis Note Params:', params);

        return {
          url: '/PatientDiagnoses/UpdateDiagnosisNote',
          method: 'PATCH',
          params: params
        };
      },
      invalidatesTags: (result, error, { diagnosisId }) => [
        { type: 'PatientDiagnoses', id: diagnosisId }
      ],
    }),

    // Delete diagnosis note 
    deleteDiagnosisNote: builder.mutation({
      query: (diagnosisNoteId) => {
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