// hooks/useDoctorEducation.js
import { useCallback, useEffect, useState } from "react";
import {
  useAddDoctorEducationMutation,
  useUpdateDoctorEducationMutation,
  useDeleteDoctorEducationMutation,
  useGetDoctorEducationsQuery,
  useAddDoctorOneEducationMutation,
} from "../../../api/doctor-information/doctorEducationApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { getErrorMessage } from "../../utils/api-errors";


export const useDoctorEducation = (New=false) => {
  const doctorId = useSelector((state) => state.auth.doctorId);

  const [errors, setErrors] = useState({});
    
  const {
    data: educationsData,
    isLoading,
    error,
    refetch
  } = useGetDoctorEducationsQuery({ doctorId }, { skip: !doctorId || New });

  const newItem = {
       id: `temp-${Date.now()}`,
       institutionName: "",
       degree: "",
       major: "",
       graduationYear: "",
       startDate: "",
       endDate: "",
       notes: "",
       certificateFileUrl: "",
       isExpanded: true,
       isNew: true,
     };
  const [educations, setEducations] = useState(educationsData?.data?.map(transformDoctorEducation) || [newItem]);
  useEffect(() => {
    if (educationsData) {
      setEducations(educationsData?.data?.map(transformDoctorEducation) || []);
    }
  }, [educationsData]);

  const [addEducation, { isLoading: isAdding }] =
    useAddDoctorEducationMutation();

  const [addOneEducation, { isLoading: isAddingOne }] =
    useAddDoctorOneEducationMutation();
  const [updateEducation, { isLoading: isUpdating }] =
    useUpdateDoctorEducationMutation();
  const [deleteEducation] = useDeleteDoctorEducationMutation();

  // ADD
const handleAddAcademic = useCallback(() => {
  const hasUnsaved = educations.some(
    (item) => item.isNew
  );

  if (!New && hasUnsaved) {
    toast.error("Save previous first");
    return;
  }

  setEducations((prev) => [
    {
      ...newItem,
      id: `temp-${Date.now()}`
    },
    ...prev,
  ]);
}, [educations, New]);
  // hooks/useDoctorEducation.js

  // UPDATE LOCAL
  const handleUpdateAcademic = useCallback(
    (id, field, value) => {
        setEducations((prev) =>
          prev.map((item, i) =>
            item.id === id
              ? { ...item, [field]: value }
              : item
          )
        );

      const errorKey = `${field}_${id}`;

      setErrors((prev) => ({
        ...prev,
        [errorKey]: "",
      }));
    },
    []
  );

  // DELETE
  const handleDeleteAcademic = useCallback(
    async (index) => {
      const loading = toast.loading("Deleting...");

      try {
        const item = educations[index];
        if (!item) return;

        if (!item.isNew) {
          const res = await deleteEducation({
            doctorId,
            doctorEducationId: item.id,
          }).unwrap();

          if (!res?.succeeded) {
            toast.error(res?.message);
            return;
          }
        }else{
          setEducations((prev) => prev.filter((_, i) => i !== index));
        }

        toast.success("Deleted");
      } catch {
        toast.error("Delete failed");
      } finally {
        toast.dismiss(loading);
      }
    },
    [educations, doctorId],
  );

  const validateEducation = useCallback((index, data) => {
    const newErrors = {};

    if (!data?.institutionName?.trim()) {
      newErrors[`institutionName_${data.id}`] =
        "Institution name is required";
    }

    if (!data?.graduationYear) {
      newErrors[`graduationYear_${data.id}`] =
        "Graduation year is required";
    }

    if (
      !data?.degree ||
      data.degree === "select degree"
    ) {
      newErrors[`degree_${data.id}`] =
        "Degree is required";
    }

    if (
      data.startDate &&
      data.endDate &&
      new Date(data.endDate) < new Date(data.startDate)
    ) {
      newErrors[`endDate_${data.id}`] =
        "End date must be after start date";
    }

    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    return Object.keys(newErrors).length === 0;
  }, []);

  const validateEducations = useCallback(
  (items) => {
    const newErrors = {};

    items.forEach((data, index) => {
      if (!data?.institutionName?.trim()) {
        newErrors[
          `institutionName_${data.id}`
        ] =
          "Institution name is required";
      }

      if (!data?.graduationYear) {
        newErrors[
          `graduationYear_${data.id}`
        ] =
          "Graduation year is required";
      }

      if (
        !data?.degree ||
        data.degree === "select degree"
      ) {
        newErrors[`degree_${data.id}`] =
          "Degree is required";
      }

      if (
        data.startDate &&
        data.endDate &&
        new Date(data.endDate) <
          new Date(data.startDate)
      ) {
        newErrors[`endDate_${data.id}`] =
          "End date must be after start date";
      }
    });

    setErrors(newErrors);

    return !Object.keys(newErrors).length;
  },
  []
);


const handleSaveAcademic = useCallback(
  async (index, data) => {
    
    if (
      isAdding ||
      isUpdating ||
      isAddingOne
    )
    return false;

    const loading = toast.loading(
      "Saving..."
    );

    try {
      let success = false;

      // ===== BATCH MODE =====
      if (New && Array.isArray(data)) {
        if (!validateEducations(data)) {
          toast.error(
            "Please fix validation errors"
          );
          return false;
        }

        const payload = data.map(item => ({
          institutionName:
            item.institutionName,
          degree: item.degree,
          major: item.major,
          graduationYear:
            item.graduationYear,
          startDate: item.startDate,
          endDate: item.endDate,
          notes: item.notes,
          certificateFileUrl:
            item.certificateFileUrl,
        }));

        const res = await addEducation({
          doctorId,
          educations: payload,
        }).unwrap();

        if (res?.succeeded) {
          toast.success(
            "Qualifications added successfully"
          );

          success = true;
        } else {
          toast.error(res?.message);
        }

        return success;
      }

      // ===== CURRENT SINGLE MODE =====
      if (!validateEducation(index, data)) {
        toast.error(
          "Please fix validation errors"
        );
        return false;
      }

      if (data.isNew) {
      console.log(" from if it is new ","data", data, index, "educations" , educations, "New", New );
      // return false;
        await addOneEducation({
          doctorId,
          education: data,
        }).unwrap();

        toast.success(
          "Added qualification Successfully"
        );

        success = true;
      } else {
        const original =
          educationsData?.data?.find(
            item =>
              item.doctorEducationId ===
              data.id
          ) || {};

        const updates =
          buildEducationUpdatePayload(
            original,
            data
          );

        if (!Object.keys(updates).length) {
          toast("No changes found");
          return false;
        }

    console.log(" from if it is not new ","payload",updates , "doctorId" ,doctorId, "doctorEducationId", data.id, );
      return false;

      const res = await updateEducation({
            doctorId,
            doctorEducationId: data.id,
            updates,
          }).unwrap();

        if (res?.succeeded) {
          setEducations(prev =>
            prev.map((item, i) =>
              i === index
                ? {
                    ...data,
                    isExpanded: false,
                  }
                : item
            )
          );

          toast.success(
            "Updated qualification successfully"
          );

          success = true;
        }
      }

      return success;
    } catch (error) {
      toast.error(
        getErrorMessage(error)
      );
      return false;
    } finally {
      toast.dismiss(loading);
    }
  },
  [
    doctorId,
    isAdding,
    isUpdating,
    isAddingOne,
    New,
    validateEducation,
    validateEducations,
  ]
);
  return {
    handleAddAcademic,
    handleDeleteAcademic,
    handleUpdateAcademic,
    handleSaveAcademic,
    isLoading,
    error,
    refetch,
    educations,
    errors
  };
};

const transformDoctorEducation = (education) => ({
  ...education,
  isNew: false,
  isExpanded: false,
});

export const buildEducationUpdatePayload = (original, updated) => {
  const payload = {};
  console.log("&&&&original", original, "updated", updated);

  if (updated.institutionName !== original.institutionName) {
    payload.institutionName = updated.institutionName || null;
  }
  if (updated.degree !== original.degree) {
    payload.degree = updated.degree || null;
  }
  if (updated.major !== original.major) {
    payload.major = updated.major || null;
  }
  if (updated.graduationYear !== original.graduationYear) {
    payload.graduationYear = updated.graduationYear || null;
  }
  if (updated.startDate !== original.startDate) {
    payload.startDate = updated.startDate || null;
  }
  if (updated.endDate !== original.endDate) {
    payload.endDate = updated.endDate || null;
  }
  if (updated.notes !== original.notes) {
    payload.notes = updated.notes || null;
  }
  console.log("&&&&payload", payload);
  return payload;
};
