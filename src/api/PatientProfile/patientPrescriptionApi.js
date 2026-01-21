// patientPrescriptionApi.js
import { baseApi } from '../baseApi';

// Helper functions
const getStatusValue = (statusText) => {
  const statusMap = {
    "Active": 1,
    "Completed": 2, 
    "Cancelled": 3,
    "Expired": 4,
  };
  return statusMap[statusText] || 0;
};

const getStatusText = (status) => {
  const statusMap = {
    1: "Active",
    2: "Completed", 
    3: "Cancelled",
    4: "Expired",
  };
  return statusMap[status] || "Unknown";
};

const transformPrescriptionData = (response, searchValue = "") => {
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
    prescriptionId: item.id,
    title: item.title,
    notes: item.notes,
    diagnosisName: item.diagnosisName,
    status: getStatusText(item.status),
    statusValue: item.status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    prescribedMedications: item.prescribedMedications?.map(med => ({
      id: med.id,
      dosage: med.dosage,
      durationInDays: med.durationInDays,
      instructions: med.instructions,
      medicationName: med.medicationName,
      medicationCategoryName: med.medicationCategoryName,
      prescriptionName: med.prescriptionName,
      diagnosisName: med.diagnosisName,
      createdAt: med.createdAt
    })) || []
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

export const patientPrescriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get patient prescriptions
  getPatientPrescriptions: builder.query({
      query: ({ 
        patientId, 
        filter = {}, 
        orderBy, 
        pageNumber = 1, 
        pageSize = 10 
      }) => {
        const params = {
          PatientId: patientId,
          ...(pageNumber && { 'PageNumber': pageNumber }),
          ...(pageSize && { 'PageSize': pageSize }),
          ...(orderBy && { 'PrescriptionOrdering': orderBy }),
          ...(filter.searchValue && { 'PrescriptionSearchFilter.SearchValue': filter.searchValue }),
          ...(filter.fromDate && { 'PrescriptionSearchFilter.FromDate': filter.fromDate }),
          ...(filter.toDate && { 'PrescriptionSearchFilter.ToDate': filter.toDate }),
          ...(filter.status !== undefined && { 'PrescriptionSearchFilter.Status': filter.status }),
          ...(filter.medicationId && { 'PrescriptionSearchFilter.MedicationId': filter.medicationId }),
          ...(filter.medicationCategoryId && { 'PrescriptionSearchFilter.MedicationCategoryId': filter.medicationCategoryId })
        };

        console.log('Patient Prescriptions API Request Params:', params);

        return {
          url: '/PatientPrescription/GetPatientPrescription',
          params,
          timeout: 10000
        };
      },
      transformResponse: (response, meta, args) => {
        console.log('Patient Prescriptions API Response:', response);
        return transformPrescriptionData(response, args.filter?.searchValue);
      },
      transformErrorResponse: (response, meta, args) => {
        console.error('Patient Prescriptions API Error:', response);
        return transformPrescriptionData(
          { 
            succeeded: false, 
            error: response.data,
            status: response.status 
          }, 
          args.filter?.searchValue
        );
      },
      providesTags: (result, error, { patientId }) => [
        { type: 'PatientPrescription', id: patientId }
      ],
    }),

    // Add patient prescription
    addPatientPrescription: builder.mutation({
      query: ({ diagnosisId, prescriptionData }) => {
        console.log('Add Patient Prescription Data:', prescriptionData);
        const body = {
          diagnosisId: diagnosisId,
          title: prescriptionData.title,
          notes: prescriptionData.notes,
          status: getStatusValue(prescriptionData.status),
          prescribedMedications: (prescriptionData.prescribedMedications || []).map(med => ({
            prescriptionId: prescriptionData.prescriptionId || 2,
            medicationId: med.medication.id,
            startDate: med.startDate || new Date().toISOString(),
            endDate: med.endDate || new Date(Date.now() + (med.durationInDays || 1) * 24 * 60 * 60 * 1000).toISOString(),
            dosage: med.dosage,
            durationInDays: med.durationInDays,
            instructions: med.instructions
          }))
        };

        console.log('Add Patient Prescription Body:', body);

        return {
          url: '/PatientPrescription/AddPatientPrescription',
          method: 'POST',
          body: body
        };
      },
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'PatientPrescription', id: patientId }
      ],
    }),

    // Update patient prescription
    updatePatientPrescription: builder.mutation({
      query: ({ prescriptionId, updates }) => {
        const body = {
          prescriptionId: prescriptionId,
          title: updates.title,
          notes: updates.notes,
          prescriptionStatus: getStatusValue(updates.status)
        };

        console.log('Update Patient Prescription Body:', body);

        return {
          url: '/PatientPrescription/UpdatePatientPrescription',
          method: 'PATCH',
          body: body
        };
      },
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'PatientPrescription', id: patientId }
      ],
    }),

// Delete patient prescription
deletePatientPrescription: builder.mutation({
  query: (prescriptionId) => {
    console.log('Delete Patient Prescription ID:', prescriptionId);

    return {
      url: '/PatientPrescription/DeletePatientPrescription',
      method: 'DELETE',
      body: {
        prescriptionId: prescriptionId
      }
    };
  },
  invalidatesTags: (result, error, prescriptionId) => [
    { type: 'PatientPrescription', id: 'LIST' }
  ],
})


  }),
});

export const {
  useGetPatientPrescriptionsQuery,
  useLazyGetPatientPrescriptionsQuery,
  useAddPatientPrescriptionMutation,
  useUpdatePatientPrescriptionMutation,
  useDeletePatientPrescriptionMutation,
} = patientPrescriptionApi;