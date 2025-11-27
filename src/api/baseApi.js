import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  
  baseUrl: process.env.REACT_APP_API_BASE_URL || 'https://present-russia-airline-tribe.trycloudflare.com/Api/v1',
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    headers.set('ngrok-skip-browser-warning', 'true');
    
    // Add auth token if available
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   headers.set('Authorization', `Bearer ${token}`);
    // }
    
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Patient', 'Doctor', 'Appointment','PatientMedicalConditions'], // Tags for cache invalidation
  endpoints: () => ({}), // Endpoints will be injected
});