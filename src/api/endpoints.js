export const ENDPOINTS = {
  PATIENT: {
    BASIC_INFO: '/PatientBasicInfo/GetPatientBasicInfo',
    UPDATE_INFO: '/PatientBasicInfo/UpdatePatient',
    CREATE: '/PatientBasicInfo/CreatePatient',
    BATCH_INFO: '/PatientBasicInfo/GetBatchPatientInfo', // hypothetical
  },
  AUTH: {
    LOGIN: '/Auth/login',
    LOGOUT: '/Auth/logout',
  },
  DOCTOR: {
    LIST: '/Doctor/GetAll',
    DETAILS: '/Doctor/GetById',
  },
  APPOINTMENT: {
    LIST: '/Appointment/GetAll',
    CREATE: '/Appointment/Create',
  },
 ALLERGY: {
    GET_PATIENT_ALLERGIES: '/PatientAllergies/GetPatientAllergies',
    ADD_PATIENT_ALLERGY: '/PatientAllergies/AddPatientAllergy',
    UPDATE_PATIENT_ALLERGY: '/PatientAllergies/UpdatePatientAllergy',
    DELETE_PATIENT_ALLERGY: '/PatientAllergies/DeletePatientAllergy',
  },
};