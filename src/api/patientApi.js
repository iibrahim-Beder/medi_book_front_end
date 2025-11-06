import { baseApi } from './baseApi';
import { ENDPOINTS } from './endpoints';

// Helper function to transform API data to UI format
const transformPatientData = (apiData) => {
  if (!apiData || !apiData.data) return null;

  const patient = apiData.data;
  
  const calculateAge = (dateString) => {
    if (!dateString || dateString === '0001-01-01T00:00:00') return 0;
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === '0001-01-01T00:00:00') return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return {
    // Basic Info
    name: `${patient.firstName} ${patient.lastName}`,
    birthDate: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : 'N/A',
    age: calculateAge(patient.dateOfBirth),
    gender: patient.genderName || 'N/A',
    phone: patient.phoneNumber || 'N/A',
    email: patient.email || 'N/A',
    city: patient.cityName || 'Riyadh, Saudi Arabia',
    address: patient.address || 'N/A',
    
    // Medical Data
    chronic: patient.chronicDiseasesNames || [],
    allergies: {
      drug: patient.allergiesNames && patient.allergiesNames.length > 0 
        ? patient.allergiesNames.join(', ') 
        : 'None',
      food: 'None'
    },
    medicines: patient.medicinesNames || [],
    
    // Visits
    lastVisit: formatDate(patient.lastVisit),
    nextVisit: 'Sep 15, 2025', // Default value
    
    // UI Data
    image: patient.imagePath || 'images/feedback/user-img.jpg',
    verified: true,
    
    // Original API data for reference
    originalData: apiData
  };
};

export const patientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Patient Basic Info
    getPatientBasicInfo: builder.query({
      query: (patientId) => ({
        url: ENDPOINTS.PATIENT.BASIC_INFO,
        params: { PatientId: patientId }
      }),
      transformResponse: (response) => transformPatientData(response),
      providesTags: (result, error, patientId) => [
        { type: 'Patient', id: patientId }
      ],
    }),

    // Update Patient Info
    updatePatientInfo: builder.mutation({
      query: ({ patientId, updates }) => ({
        url: ENDPOINTS.PATIENT.BASIC_INFO,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: 'Patient', id: patientId }
      ],
    }),

    // Get Multiple Patients
    getMultiplePatients: builder.query({
      query: (patientIds) => ({
        url: ENDPOINTS.PATIENT.BATCH_INFO,
        params: { patientIds: patientIds.join(',') }
      }),
      // Note: You might need to create this endpoint in backend
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetPatientBasicInfoQuery,
  useUpdatePatientInfoMutation,
  useGetMultiplePatientsQuery,
} = patientApi;