import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import patientService from '../../../api/patient/patientService';

// Async Thunk for fetching patient data
export const fetchPatientData = createAsyncThunk(
  'patient/fetchPatientData',
  async (patientId, { rejectWithValue }) => {
    const response = await patientService.getPatientBasicInfo(patientId);
    
    if (response.success) {
      return response.data;
    } else {
      return rejectWithValue(response.error);
    }
  }
);

const patientSlice = createSlice({
  name: 'patient',
  initialState: {
    data: null,
    loading: false,
    error: null,
    lastFetch: null
  },
  reducers: {
    clearPatientData: (state) => {
      state.data = null;
      state.error = null;
    },
    setPatientData: (state, action) => {
      state.data = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastFetch = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchPatientData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data = null;
      });
  }
});

export const { clearPatientData, setPatientData } = patientSlice.actions;

// Selectors
export const selectPatientData = (state) => state.patient.data;
export const selectPatientLoading = (state) => state.patient.loading;
export const selectPatientError = (state) => state.patient.error;
export const selectPatientBasicInfo = (state) => state.patient.data;

export default patientSlice.reducer;