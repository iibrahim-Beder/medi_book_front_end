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

export const useDoctorLocationsManager = (doctorId = 103) => {
  const { t } = useTranslation();

  // ==================== API Calls ====================
  const {
    data,
    isLoading: isFetching,
    refetch,
  } = useGetDoctorLocationsQuery(doctorId, {
    skip: !doctorId,
  });
  console.log("====data", data);

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
  const validate = useCallback(() => {
    const newErrors = {};
    locations.forEach((loc) => {
      const err = {};
      if (!loc.displayName.trim()) {
        err.displayName = t("requiredField");
      }
      if (!loc.lat || !loc.lng) {
        err.location = t("SelectLocationOnMap");
      }
      if (Object.keys(err).length > 0) {
        newErrors[loc.id] = err;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [locations, t]);

  // ==================== Save Single Location (used by Accordion) ====================
  const saveLocation = async (id, locationData) => {
    if (!doctorId) return false;

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
        const payload = buildLocationPayload(original, locationData);
        const res = await updateLocation({
          locationId: id,
          ...payload,
        }).unwrap();
        console.log("====res", res);
      }

      toast.success(t("SavedSuccessfully"));
      return true;
    } catch (e) {
      toast.error(e?.data?.message || t("Error"));
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
      toast.success(t("StatusUpdated"));
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
    isLoading: isFetching || isAdding || isUpdating,
  };
};

// ==================== Build payload ====================
const buildLocationPayload = (original, updated) => {
  const payload = {
    locationId: original.id,
    setPrimary: !!updated.isPrimary,
  };

  if (original.displayName !== updated.displayName) {
    payload.locationName = { value: updated.displayName };
  }

  if (Number(original.lat) !== Number(updated.lat)) {
    payload.latitude = { value: Number(updated.lat) };
  }

  if (Number(original.lng) !== Number(updated.lng)) {
    payload.longitude = { value: Number(updated.lng) };
  }

  return payload;
};