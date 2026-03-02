// hooks/useDoctorLocation.js
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetDoctorLocationsQuery,
  useAddLocationToDoctorMutation,
  useUpdateDoctorLocationMutation,
} from "../../../api/doctor-information/doctorLocationsApi";
import toast from "react-hot-toast";

export const useDoctorLocation = (isNew, doctorId) => {
  const { t } = useTranslation();

  const {
    data,
    isLoading: isFetching,
    error,
    refetch,
  } = useGetDoctorLocationsQuery(doctorId, {
    skip: !doctorId || isNew,
  });

  const [addLocation, { isLoading: isAdding }] =
    useAddLocationToDoctorMutation();

  const [updateLocation, { isLoading: isUpdating }] =
    useUpdateDoctorLocationMutation();

  const [formData, setFormData] = useState({
    lat: 30.0444,
    lng: 31.2357,
    displayName: "",
    officialName: "",
    locationId: null,
  });

  const [errors, setErrors] = useState({});

  // load existing location once
  useEffect(() => {
    if (!isNew && data?.data?.length) {
      const item = data.data[0];

      setFormData({
        lat: item.locationPoint.latitude,
        lng: item.locationPoint.longitude,
        displayName: item.locationName,
        officialName: item.locationName,
        locationId: item.locationID,
      });
    }
  }, [data, isNew]);

  const validate = useCallback(() => {
    const newErrors = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = t("requiredField");
    }

    if (!formData.lat || !formData.lng) {
      newErrors.location = t("SelectLocationOnMap");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  const handleSubmit = async () => {
    if (!doctorId) return false;
    if (!validate()) return false;

    const loader = toast.loading(t("loading"));

    try {
      if (isNew || !formData.locationId) {
        await addLocation({
          doctorId,
          locations: [
            {
              locationName: formData.displayName,
              isPrimary: true,
              locationPoint: {
                latitude: formData.lat,
                longitude: formData.lng,
              },
            },
          ],
        }).unwrap();
      } else {
        await updateLocation(
          buildLocationPayload(data.data[0], formData)
        ).unwrap();
      }

      toast.success(t("SavedSuccessfully"));
      return true;
    } catch (e) {
      toast.error(e?.data?.message || "Error");
      return false;
    } finally {
      toast.dismiss(loader);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    handleSubmit,
    isLoading: isFetching || isAdding || isUpdating,
    error,
    refetch,
  };
};

const buildLocationPayload = (original, updated) => {
  const payload = {
    locationId: updated.locationId,
    setPrimary: true,
  };

  if (original.locationName !== updated.displayName) {
    payload.locationName = { value: updated.displayName };
  }

  if (original.locationPoint.latitude !== updated.lat) {
    payload.latitude = { value: Number(updated.lat) };
  }

  if (original.locationPoint.longitude !== updated.lng) {
    payload.longitude = { value: Number(updated.lng) };
  }

  return payload;
};