import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useAddDoctorBasicInfoMutation,
  useUpdateDoctorBasicInfoMutation,
  useGetDoctorBasicInfoQuery,
} from "../../../api/doctor-information/doctorBasicInfoApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export const useStep1PersonalInfo = (isNew) => {
  const doctorId = useSelector((state) => state.auth.doctorId);

  const { t } = useTranslation();
  
  const { data: fetchedData, isLoading: isFetching , refetch, error } =
  useGetDoctorBasicInfoQuery(doctorId, {
    skip: isNew || !doctorId,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "Male",
    licenseNumber: "",
    phoneNumber: "",
    imagePath: "",
    licenseImage: null,
  });

  const [errors, setErrors] = useState({});

  const [addDoctorBasicInfo, { isLoading: isAdding }] =
    useAddDoctorBasicInfoMutation();

  const [updateDoctorBasicInfo, { isLoading: isUpdating }] =
    useUpdateDoctorBasicInfoMutation();

  useEffect(() => {
    if (!isNew && fetchedData?.data) {
      const apiData = fetchedData.data;

      setFormData({
        firstName: apiData.firstName || "",
        lastName: apiData.lastName || "",
        dateOfBirth: apiData.dateOfBirth
          ? apiData.dateOfBirth.split("T")[0]
          : "",
        gender: apiData.gender=== "Male" ? 0 : 1 ?? "",
        licenseNumber: apiData.licenseNumber || "",
        phoneNumber: apiData.phoneNumber || "",
        imagePath: apiData.imagePath || "",
        licenseImage: null,
      });
    }
  }, [isNew, fetchedData]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "licenseImage") {
      setFormData((prev) => ({
        ...prev,
        licenseImage: files?.[0] || null,
      }));
    } else if (name === "gender") {
      const genderValue = value === "Male" ? 0 : 1;
      setFormData((prev) => ({ ...prev, gender: genderValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    if (!formData.firstName.trim()){
      toast.error(t("first name required"));
      return false ;
    }
    if (!formData.lastName.trim())
    {
      toast.error(t("last Name required"));
      return false ;
    }

    if (!formData.dateOfBirth)
    {
    toast.error(t("date of birth required"));
    return false ;
    }
    if (formData.gender === "" || formData.gender === null)
    {
      toast.error(t("gender required"));
      return false ;
    }
    if (!formData.licenseNumber.trim())
    {
      toast.error(t("license number required"));
      return false ;
    }
    return true;
    // if (!formData.phoneNumber.trim())
    //   newErrors.phoneNumber = t("personalInfo.phoneNumber.required");
    // else if (!/^01[0-9]{9}$/.test(formData.phoneNumber))
    //   newErrors.phoneNumber = t("personalInfo.phoneNumber.invalid");
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return false;
    }

    if (!doctorId) {
      toast.error(t("personalInfo.doctorIdMissing"));
      return false;
    }

    const loader = toast.loading(t("loading"));

    try {
      console.log("formData", formData);
      if(isNew){
       const  payload = {
          doctorId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth).toISOString()
          : null,
          gender: formData.gender==="Male" ? 0 : 1,
          licenseNumber: formData.licenseNumber,
          phoneNumber: formData.phoneNumber,
          // imagePath: formData.imagePath || "",
        };
        console.log("payload", payload);
          const response =await addDoctorBasicInfo(payload).unwrap()
           if (response.succeeded) {
        toast.success(t("personalInfo.success"));
        return true;
      }
      }else{
    const payload = buildPayload(fetchedData?.data ,formData)
     if (!Object.keys(payload).length) {
                toast("No changes detected");
                return true;
              }
      
      console.log("=========payload", payload);

      const response = await updateDoctorBasicInfo({ doctorId:doctorId, ...payload}).unwrap();

      if (response.succeeded) {
        toast.success(t("personalInfo.success"));
        return true;
      }

      toast.error(response.message || t("personalInfo.error"));
      return false;
    }
    } catch (error) {
      toast.error(error?.data?.message || t("personalInfo.error"));
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
    handleSubmit,
    refetch, 
    error,
  };
};




export const buildPayload = (original, updated) => {
  const payload = {};
  console.log("=======original", original, "updated", updated);

  if (updated.dateOfBirth !==  original.dateOfBirth.split("T")[0]) {
    payload.dateOfBirth = updated.dateOfBirth || null;
  }
  if (updated.firstName !== original.firstName) {
    payload.firstName = updated.firstName || null;
  }
  if ((updated.gender )!== (original.gender=== "Male"? 0 : 1)) {
    payload.gender = updated.gender ;
  }
  if (updated.lastName !== original.lastName) {
    payload.lastName = updated.lastName|| null;
  }
  if (updated.licenseNumber !== original.licenseNumber) {
    payload.licenseNumber = updated.licenseNumber || null;
  }
  if (updated.phoneNumber !== original.phoneNumber) {
    payload.phoneNumber = updated.phoneNumber || null;
  }
console.log("payload======", payload,(updated.gender ),(( original.gender=== "Male"? 0 : 1)));
  return payload;
};