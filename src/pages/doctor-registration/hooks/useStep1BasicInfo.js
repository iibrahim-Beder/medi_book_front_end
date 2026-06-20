import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useAddDoctorBasicInfoMutation,
  useUpdateDoctorBasicInfoMutation,
  useGetDoctorBasicInfoQuery,
} from "../../../api/doctor-information/doctorBasicInfoApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { getErrorMessage } from "../../utils/api-errors";

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
      });
    }
  }, [isNew, fetchedData]);

const handleInputChange = (e) => {
  const { name, value, files, multiple } = e.target;

  if (files) {
    setFormData((prev) => ({
      ...prev,
      [name]: multiple
        ? Array.from(files)
        : files?.[0] || null,
    }));
  } else if (name === "gender") {
    const genderValue = value === "Male" ? 0 : 1;

    setFormData((prev) => ({
      ...prev,
      gender: genderValue,
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  if (errors[name]) {
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }
};
 const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = t("first name required");

    if (!formData.lastName.trim())
      newErrors.lastName = t("last Name required");

    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = t("date of birth required");

    if (formData.gender === "" || formData.gender === null)
      newErrors.gender = t("gender required");

    if (!formData.licenseNumber.trim())
      newErrors.licenseNumber = t("license number required");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("fill all the required fields");
      return false;
    }

    if (!doctorId) {
      toast.error(t("Error"));
      return false;
    }

    const loader = toast.loading(t("loading..."));

    try {
      if(isNew){
       const  payload = {
          DoctorId: doctorId,
          FirstName: formData.firstName,
          LastName: formData.lastName,
          DateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth).toISOString()
          : null,
          Gender: formData.gender==="Male" ? 0 : 1,
          LicenseNumber: formData.licenseNumber,
          PhoneNumber: formData.phoneNumber,
          Photo: formData.imagePath || "",
        };


        const response =await addDoctorBasicInfo(payload).unwrap()
           if (response.succeeded) {
        toast.success(t("Personal Info Added Successfully"));
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
        toast.success(t("Personal Info Updated Successfully"));
        return true;
      }

    }
    } catch (error) {
       toast.error(getErrorMessage(error));
      return false;
    } finally {
      toast.dismiss(loader);
    }
  };

      const doctorImageSrc =
      formData?.imagePath
        ? `${process.env.REACT_APP_API_URL}${formData.imagePath}`
        : "/images/avt/doctor-imge-avt.png" || "/images/avt/doctor-imge-avt.png";

  return {
    formData,
    errors,
    isLoading: isFetching || isAdding || isUpdating,
    handleInputChange,
    handleSubmit,
    refetch, 
    error,
    doctorImageSrc,
  };
};




export const buildPayload = (original, updated) => {
  const payload = {};
  console.log("=======original", original, "updated", updated);

  if (updated.dateOfBirth.split("T")[0] !==  original.dateOfBirth.split("T")[0]) {
    payload.DateOfBirth = updated.dateOfBirth || null;
  }
  if (updated.firstName !== original.firstName) {
    payload.FirstName = updated.firstName || null;
  }
  if ((updated.gender )!== (original.gender=== "Male"? 0 : 1)) {
    payload.Gender = updated.gender ;
  }
  if (updated.lastName !== original.lastName) {
    payload.LastName = updated.lastName|| null;
  }
  if (updated.licenseNumber !== original.licenseNumber) {
    payload.LicenseNumber = updated.licenseNumber || null;
  }
  if (updated.phoneNumber !== original.phoneNumber) {
    payload.PhoneNumber = updated.phoneNumber || null;
  }
  if(updated.imagePath !== original.imagePath) {
    payload.Photo = updated.imagePath || null;
  }
console.log("payload======", payload,(updated.gender ),(( original.gender=== "Male"? 0 : 1)));
  return payload;
};