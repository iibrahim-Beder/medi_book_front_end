// useStep2ProfessionalInfo.js
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetDoctorProfileAndSpecialtiesQuery,
  useAddProfileAndSpecialtiesMutation,
  useUpdateProfileAndSpecialtiesMutation,
} from "../../../api/doctor-information/doctorProfileApi";
import toast from "react-hot-toast";
import { useGetSpecialtiesQuery } from "../../../api/doctor-information/specialtiesApi";
import { useSelector } from "react-redux";

export const useStep2ProfessionalInfo = (isNew) => {
  const { t } = useTranslation();
  const doctorId = useSelector((state) => state.auth.doctorId);
  
  const currencyOptions = [
          { label: "Select currency", value: null },
          { label: "AED", value: 45 },
          { label: "EGP", value: 47 },
          { label: "USD", value: 46 },
        ]

  const {
    data: fetchedData,
    isLoading: isFetching,
    refetch,
    error,
  } = useGetDoctorProfileAndSpecialtiesQuery(doctorId, {
    skip: isNew || !doctorId,
  });
  const { data: specialtiesOptions, isLoading: specialtiesLoading } =
    useGetSpecialtiesQuery();
  const mappedOptions =
    specialtiesOptions?.data?.map((s) => ({
      value: s.specialtyID,
      label: s.specialtyName,
    })) || [];

  const [formData, setFormData] = useState({
    yearsOfExperience: "",
    defaultPricePerSession: "",
    defaultCurrencyId: "",
    bio: "",
    languagesSpoken: "",
    specialtyIds: [],
    primarySpecialtyId: "",
    specialties: [],
  });

  const [errors, setErrors] = useState({});

  const [addProfile, { isLoading: isAdding }] =
    useAddProfileAndSpecialtiesMutation();
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateProfileAndSpecialtiesMutation();

  useEffect(() => {
    if (!isNew && fetchedData?.data) {
      const apiData = fetchedData.data;
      setFormData({
        yearsOfExperience: apiData.yearsOfExperience || "",
        defaultPricePerSession: apiData.defaultPricePerSession || "",
        defaultCurrencyId: currencyOptions.find((c) => c.label === apiData.defaultCurrency)?.value || "",
        bio: apiData.bio || "",
        languagesSpoken: apiData.languagesSpoken || "",
        specialtyIds: apiData.specialties.map((s) => s.specialtieID),
        specialties: apiData.specialties.map((s) => ({
          id: s.specialtieID,
          value: s.specialtieID,
          label: s.specialtieName,
        })),
        primarySpecialtyId:
          apiData.specialties.find((s) => s.isprimary === true)?.specialtieID ||
          "",
      });
    }
  }, [isNew, fetchedData]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const handlePrimaryChange =(id)=>
  {
    setFormData((prev) => ({
      ...prev,
      primarySpecialtyId: id,
    }));
  }

  const handleSpecialtyChange = (selected) => {
    console.log("selected", selected);
    setFormData((prev) => ({
      ...prev,
      specialtyIds: selected.map((s) => s.value),
    }));
  };

const validateForm = () => {
    const newErrors = {};
    if (!formData.defaultPricePerSession)
      newErrors.defaultPricePerSession = t(
        "default Price required",
      );
    if (!formData.defaultCurrencyId)
      newErrors.defaultCurrencyId = t("currency required");
    if (!formData.specialtyIds.length)
      newErrors.specialtyIds = t("Specialty required");
    if (!formData.primarySpecialtyId)
      newErrors.specialtyIds = t(
        "Select primary specialty required",
      );
    if (
      !formData.primarySpecialtyId &&
      !formData.specialtyIds.includes(Number(formData.primarySpecialtyId))
    ) {
      newErrors.specialtyIds = t(
        "Select primary specialty required",
      );
    }
    setErrors(newErrors);
    console.log("errors",errors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log("formData", formData,"fetchedData",fetchedData);
    if (!validateForm()) {
      toast.error(t("fill all the required fields"));
      return false;
    }

    if (!doctorId) {
      toast.error(t("professionalInfo.doctorIdMissing"));
      return false;
    }

    const loader = toast.loading(t("loading"));

    try {
      if (isNew) {
        const payload = {
          doctorID: doctorId,
          yearsOfExperience:  Number(formData.yearsOfExperience) ,
          defaultPricePerSession:Number(formData.defaultPricePerSession),
          defaultCurrencyId:  Number(formData.defaultCurrencyId),
          bio: formData.bio,
          languagesSpoken: formData.languagesSpoken ,
          specialtieIDs: formData.specialtyIds.map((id) => Number(id)),
          primarySpecialtyId:Number(formData.primarySpecialtyId)
        };
        console.log("====payload", payload);
        const response = await addProfile(payload).unwrap();
        if (response.succeeded) {
          toast.success(t("professional information added successfully"));
          return true;
        }
      } else {
        const payload = buildPayload(fetchedData?.data, formData);
        console.log("============payload", payload);
        if (!Object.keys(payload).length) {
          toast(t("no changes detected"));
          return true;
        }
        payload.doctorID = doctorId;
        const response = await updateProfile(payload).unwrap();
        if (response.succeeded) {
          toast.success(t("professional information updated successfully"));
          return true;
        }
        toast.error(response.message || t("failed to update"));
        return false;
      }
    } catch (error) {
      console.log("====error", error);
      toast.error(error?.data?.message || t("something went wrong"));
      return false;
    } finally {
      toast.dismiss(loader);
    }
  };

  return {
    formData,
    errors,
    isLoading: isFetching || isAdding || isUpdating,
    handleInputChange,
    handleSpecialtyChange,
    handleSubmit,
    refetch,
    error,
    specialtiesOptions: mappedOptions,
    specialtiesLoading,
    handlePrimaryChange,
    currencyOptions
  };
};

const buildPayload = (original, updated) => {
    console.log("=========original", original, "updated", updated);
  const payload = {};
  if (Number(updated.yearsOfExperience) !== original?.yearsOfExperience) {
    payload.yearsOfExperience = { value: Number(updated.yearsOfExperience) };
  }
  if (
    Number(updated.defaultPricePerSession) !== original?.defaultPricePerSession
  ) {
    payload.defaultPricePerSession = {
      value: Number(updated.defaultPricePerSession),
    };
  }
  if (Number(updated.defaultCurrencyId) !== original?.defaultCurrencyId) {
    payload.defaultCurrencyId = { value: Number(updated.defaultCurrencyId) };
  }
  if (updated.bio !== original?.bio) {
    payload.bio = { value: updated.bio };
  }
  if (updated.languagesSpoken !== original?.languagesSpoken) {
    payload.languagesSpoken = { value: updated.languagesSpoken };
  }
  if (
    JSON.stringify(updated.specialtyIds.map(Number)) !==
    JSON.stringify(original?.specialties.map((s) => s.specialtieID))
  ) {
    payload.specialtyIds = { value: updated.specialtyIds.map(Number) };
  }
  if (Number(updated.primarySpecialtyId) !== original?.specialties.find((s) => s.isprimary === true)?.specialtieID) {
    payload.primarySpecialtyId = { value: Number(updated.primarySpecialtyId) };
  }
  console.log("===========payload", payload);
  return payload;
};
