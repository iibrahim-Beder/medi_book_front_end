import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//  Get all locations from backend
export const fetchLocations = createAsyncThunk(
  "locations/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/locations"); // endpoint
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch locations");
    }
  }
);

//  Add location to backend
export const addLocationToServer = createAsyncThunk(
  "locations/addToServer",
  async (newLoc, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/locations", newLoc);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to add location");
    }
  }
);

const initialState = {
  locations: [],
  loading: false,
  error: null,
};

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    //  setLocations
    setLocations: (state, action) => {
      console.log("Dispatching locations:", action.payload);
      state.locations = action.payload;
    },

    addLocationLocal: (state) => {
      const newId = state.locations.length
        ? Math.max(...state.locations.map((l) => l.id)) + 1
        : 1;

      state.locations.push({
        id: newId,
        lat: 51.0,
        lng: 15.2551,
        displayName: "",
        officialName: "",
      });
    },

    updateLocation: (state, action) => {
      const { id, newLoc } = action.payload;
      state.locations = state.locations.map((loc) =>
        loc.id === id ? { ...loc, ...newLoc } : loc
      );
    },

    deleteLocation: (state, action) => {
      state.locations = state.locations.filter(
        (loc) => loc.id !== action.payload
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addLocationToServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLocationToServer.fulfilled, (state, action) => {
        state.loading = false;
        state.locations.push(action.payload);
      })
      .addCase(addLocationToServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setLocations,
  addLocationLocal,
  updateLocation,
  deleteLocation,
} = locationsSlice.actions;

export default locationsSlice.reducer;
