import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import {
  useGetDoctorLocationsQuery,
  useAddLocationToDoctorMutation,
  useUpdateDoctorLocationMutation,
  useActivateDoctorLocationMutation,  
  useDeactivateDoctorLocationMutation, 
} from "../../api/doctor-information/doctorLocationsApi";
import { useSelector } from "react-redux";

export const useDoctorLocationsManager = () => {
  const { t } = useTranslation();
  const doctorId = useSelector((state) => state.auth.doctorId);

  // ==================== API Calls ====================
  const {
    data,
    isLoading,
    refetch,
    isError,
    error,
    isFetching: isFetchingLocations
  } = useGetDoctorLocationsQuery(doctorId, {
    skip: !doctorId,
  });

  const [addLocation, { isLoading: isAdding }] = useAddLocationToDoctorMutation();
  const [updateLocation, { isLoading: isUpdating }] = useUpdateDoctorLocationMutation();
  const [activateLocation] = useActivateDoctorLocationMutation();  
  const [deactivateLocation] = useDeactivateDoctorLocationMutation(); // new

  // ==================== State ====================
  const [locations, setLocations] = useState([]);
  const [errors, setErrors] = useState({});

  // ==================== Load initial data ====================
  useEffect(() => {
    if (data?.data) {
      const formatted = data.data.map((loc, i) => ({
        id: loc.locationID,
        lat: loc.locationPoint.latitude,
        lng: loc.locationPoint.longitude,
        displayName: loc.locationName,
        officialName: loc.locationName,
        isActive: loc.isActive,
        isPrimary: loc.isPrimary,
        isNew: false,
        isExpanded: false,
      }));
      setLocations(formatted);
    }
  }, [data]);

  // ==================== Add new location ====================
  const addNewLocation = () => {
    if (locations?.[0]?.isNew) {toast.error('Please save the previous location first'); return;}
    const newId = Date.now();
    setLocations((prev) => [
      {
        id: newId,
        lat: 30.0444,
        lng: 31.2357,
        displayName: "",
        officialName: "",
        isPrimary: false,
        isActive: true,
        isNew: true,
        isExpanded: true,
      },
      ...prev.map((loc) => ({ ...loc, isExpanded: false })),
    ]);
  };

  // ==================== Local Update (for immediate UI changes) ====================
  const updateLocalLocation = (id, field, value) => {
    setLocations((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, [field]: value } : loc))
    );
  };

  // ==================== Validation ====================

  const validateLocation = useCallback((formData) => {
    const errors = {};

    if (!formData.displayName?.trim()) {
      errors.displayName = t("location name required");
    }

    if (!formData.lat || !formData.lng) {
      errors.location = t("Select a location");
    }

    return errors;
  }, [t]);

  const clearFieldError = useCallback((id, field) => {
    setErrors((prev) => {
      if (!prev[id]) return prev;

      return {
        ...prev,
        [id]: {
          ...prev[id],
          [field]: undefined,
        },
      };
    });
  }, []);

  // ==================== Save Single Location (used by Accordion) ====================
  const saveLocation = async (id, locationData) => {
    if (!doctorId) return false;
    
    const validationErrors = validateLocation(locationData);
    console.log("id", id,"locationData", locationData, "validationErrors", validationErrors);

      if (Object.keys(validationErrors).length) {
        setErrors((prev) => ({
          ...prev,
          [id]: validationErrors,
        }));

        toast.error(t("fill required field"));
        return false;
      }

    const loader = toast.loading(t("loading"));
    try {
      const original = locations.find((l) => l.id === id);
      if (!original) return false;

      if (original.isNew) {
        await addLocation({
          doctorId,
          locationName: locationData.displayName,
          isPrimary: locationData.isPrimary || false,
          latitude: locationData.lat,
          longitude: locationData.lng,
        }).unwrap();
      } else {
        const updatePayload =buildLocationPayload(original, locationData);
        if (!Object.keys(updatePayload).length) {
          console.log("update location", updatePayload);
          toast(t("No changes detected"));
          return true;
        };
        await updateLocation(
          { doctorId, locationId: locationData.locationId, ...updatePayload }
        ).unwrap();
      }

      toast.success(t("Saved Successfully"));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return true;
    } catch (e) {
      toast.error(e?.data?.message || t("Error Saving"));
      return false;
    } finally {
      toast.dismiss(loader);
    }
  };

  // ==================== Toggle Active Status (new) ====================
  const toggleActiveStatus = async (locationId, newActiveState) => {
    if (!doctorId) return;

    const loader = toast.loading(t("loading"));
    try {
      if (newActiveState) {
        await activateLocation({ locationId, doctorId }).unwrap();
      } else {
        await deactivateLocation({ locationId, doctorId }).unwrap();
      }
      toast.success(t("Status Updated Successfully"));
    } catch (error) {
      toast.error(error?.data?.message || t("Error"));
    } finally {
      toast.dismiss(loader);
    }
  };

  return {
    locations,
    setLocations,
    errors,
    addNewLocation,
    updateLocalLocation,
    saveLocation,
    toggleActiveStatus,
    isLoading,
     refetch,
    isError,
    error,
    setErrors,
    clearFieldError,
   isFetchingLocations
  };
};

// ==================== Build payload ====================
const buildLocationPayload = (original, updated) => {
  const payload = {};

  if (original.locationName !== updated.displayName) {
    payload.locationName = { value: updated.displayName };
  }

  if (original.locationPoint.latitude !== updated.lat) {
    payload.latitude = { value: Number(updated.lat) };
  }

  if (original.locationPoint.longitude !== updated.lng) {
    payload.longitude = { value: Number(updated.lng) };
  }

  console.log("original", original, "updated", updated , "payload", payload);
  return payload;
};