// hooks/useDoctorLocation.js
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetDoctorLocationsQuery,
  useAddLocationToDoctorMutation,
  useUpdateDoctorLocationMutation,
  useAddLocationStepToDoctorMutation,
} from "../../../api/doctor-information/doctorLocationsApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export const useDoctorLocation = (isNew) => {

  const doctorId = useSelector((state) => state.auth.doctorId);
  
  const { t } = useTranslation();

  const {
    data,
    isLoading: isFetching,
    error,
    refetch,
  } = useGetDoctorLocationsQuery(doctorId, {
    skip: !doctorId || isNew,
  });

  const [addLocation, { isLoading: isAdding }] =useAddLocationToDoctorMutation();
  const [addLocationStep, { isLoading: isAddingStep }] =useAddLocationStepToDoctorMutation();
  
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
      newErrors.displayName = t("location name required");
    }

    if (!formData.lat || !formData.lng) {
      newErrors.location = t("Select a location");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  const handleSubmit = async () => {
    if (!doctorId ||isAddingStep||isAdding) return false;
    if (!validate()) {
      toast.error(t("fill required field"));return false};

    const loader = toast.loading(t("loading"));

    console.log("location formData", doctorId, formData);
    try {
      if (isNew || !formData.locationId) {
        if(isNew) {
          await addLocationStep({
            doctorId,
            locationName: formData.displayName,
            isPrimary: true,
            latitude: formData.lat,
            longitude: formData.lng,
          }).unwrap();

        }else{
          await addLocation({
            doctorId,
            locationName: formData.displayName,
            isPrimary: true,
            latitude: formData.lat,
            longitude: formData.lng,
          }).unwrap();
        }
      } else {
        const updatePayload = buildLocationPayload(data.data[0], formData);
        if (!Object.keys(updatePayload).length) {
          console.log("update location", updatePayload);
          toast(t("No changes detected"));
          return true;
        };
        await updateLocation(
          { doctorId, locationId: formData.locationId, ...updatePayload }
        ).unwrap();
      }

      toast.success(t("Saved Location Successfully"));
      return true;
    } catch (e) {
      console.error("location error", e );
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