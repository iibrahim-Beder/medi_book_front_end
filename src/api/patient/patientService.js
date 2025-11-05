import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';

export const patientService = {

  getPatientBasicInfo: async (patientId) => {
    try {
      if (!patientId) {
        throw new Error('Patient ID is required');
      }

      const response = await apiClient.get(ENDPOINTS.PATIENT.BASIC_INFO, {
        params: { PatientId: patientId }
      });

      const transformedData = transformPatientData(response.data);
      
      return {
        success: true,
        data: transformedData,
        originalData: response.data,
        status: response.status
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status
      };
    }
  }
};

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

    name: `${patient.firstName} ${patient.lastName}`,
    birthDate: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : 'N/A',
    age: calculateAge(patient.dateOfBirth),
    gender: patient.genderName || 'N/A',
    phone: patient.phoneNumber || 'N/A',
    email: patient.email || 'N/A',
    city: patient.cityName || 'Riyadh, Saudi Arabia',
    address: patient.address || 'N/A',
    

    chronic: patient.chronicDiseasesNames || [],
    allergies: {
      drug: patient.allergiesNames && patient.allergiesNames.length > 0 
        ? patient.allergiesNames.join(', ') 
        : 'None',
      food: 'None' 
    },
    medicines: patient.medicinesNames || [],
    
 
    lastVisit: formatDate(patient.lastVisit),
    nextVisit: 'Sep 15, 2025',
    

    image: patient.imagePath || 'images/feedback/user-img.jpg',
    verified: true
  };
};

export default patientService;