// hooks/useDoctorExperience.js
import { useCallback, useEffect, useState } from "react";
import {
  useAddDoctorExperienceMutation,
  useUpdateDoctorExperienceMutation,
  useDeleteDoctorExperienceMutation,
  useGetDoctorExperiencesQuery,
  useAddDoctorOneExperienceMutation,
} from "../../../api/doctor-information/ExperienceApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { getErrorMessage } from "../../utils/api-errors";

export const useDoctorExperience = (New=false)=> { 
  const doctorId = useSelector((state) => state.auth.doctorId);
  
  const [errors, setErrors] = useState({});
  
  const {
    data: experiencesData,
    isLoading,
    error,
    refetch,
  } = useGetDoctorExperiencesQuery({ doctorId }, { skip: !doctorId || New });
      const newItem = {
      id: `temp-${Date.now()}`,
      workplace: "",
      jobTitle: "",
      startDate: "",
      endDate: "",
      description: "",
      isExpanded: true,
      isNew: true,
    };

  const [experiences, setExperience] = useState( experiencesData?.data?.map(transformDoctorExperience) || [newItem]);

  useEffect(() => {
    if (experiencesData) {
      setExperience(
        experiencesData?.data?.map(transformDoctorExperience) || []
      );
    }
  }, [experiencesData]);

  const [addExperience, { isLoading: isAdding }] =
    useAddDoctorExperienceMutation();

  const [addOneExperience, { isLoading: isAddingOne }] =
    useAddDoctorOneExperienceMutation();

  const [updateExperience, { isLoading: isUpdating }] =
    useUpdateDoctorExperienceMutation();
  const [deleteExperience] = useDeleteDoctorExperienceMutation();

  // ADD
  const handleAddExperience = useCallback(() => {
    const hasUnsaved = experiences.some(
        (item) => item.isNew
      );
    
      if (!New && hasUnsaved) {
      toast.error("Save previous first");
      return;
    }

    const newItem = {
      id: `temp-${Date.now()}`,
      workplace: "",
      jobTitle: "",
      startDate: "",
      endDate: "",
      description: "",
      isExpanded: true,
      isNew: true,
    };

    setExperience((prev) => [newItem, ...prev]);
  }, [experiences]);

  // UPDATE LOCAL
  const handleUpdateExperience = useCallback((index, field, value) => {
      setExperience((prev) =>
          prev.map((item, i) =>
            i === index
              ? { ...item, [field]: value }
              : item
          )
        );

      const errorKey = `${field}_${index}`;

      setErrors((prev) => ({
        ...prev,
        [errorKey]: "",
      }));
    },
    []);

  // DELETE
  const handleDeleteExperience = useCallback(
    async (index) => {
      const loading = toast.loading("Deleting...");

      try {
        const item = experiences[index];
        if (!item) return;

        if (!item.isNew) {
          const res = await deleteExperience({
            doctorId,
            doctorExperienceId: item.id,
          }).unwrap();

          if (!res?.succeeded) {
            toast.error(res?.message);
            return;
          }
        }

        setExperience((prev) =>
          prev.filter((_, i) => i !== index)
        );
        toast.success("Deleted Successfully");
      } catch(error) {
        toast.error(getErrorMessage(error));
      } finally {
        toast.dismiss(loading);
      }
    },
    [experiences, doctorId]
  );

   const validateExperience = useCallback((index, data) => {
      const newErrors = {};
  
      if (!data?.workplace?.trim()) {
        newErrors[`workplace_${index}`] =
          "workplace is required";
      }
  
      if (!data?.jobTitle) {
        newErrors[`jobTitle_${index}`] =
          "Job title is required";
      }
  
      if (!data?.startDate) {
        newErrors[`startDate_${index}`] =
          "Start date is required";
      }
  
      if (
        data.startDate &&
        data.endDate &&
        new Date(data.endDate) < new Date(data.startDate)
      ) {
        newErrors[`endDate_${index}`] =
          "End date must be after start date";
      }
  
      setErrors((prev) => ({
        ...prev,
        ...newErrors,
      }));
  
      return Object.keys(newErrors).length === 0;
    }, []);

    
    const validateExperiences = useCallback(
  (items) => {
    const newErrors = {};

    items.forEach((data, index) => {
      if (!data?.workplace?.trim()) {
        newErrors[`workplace_${index}`] =
          "Workplace is required";
      }

      if (!data?.jobTitle?.trim()) {
        newErrors[`jobTitle_${index}`] =
          "Job title is required";
      }

      if (!data?.startDate) {
        newErrors[`startDate_${index}`] =
          "Start date is required";
      }

      if (
        data.startDate &&
        data.endDate &&
        new Date(data.endDate) <
          new Date(data.startDate)
      ) {
        newErrors[`endDate_${index}`] =
          "End date must be after start date";
      }
    });

    setErrors(newErrors);

    return !Object.keys(newErrors).length;
  },
  []
    );

    // SAVE
    const handleSaveExperience = useCallback(
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
            if (!validateExperiences(data)) {
              toast.error(
                "Please fix validation errors"
              );
              return false;
            }

            const payload = data.map(item => ({
              workplace: item.workplace,
              jobTitle: item.jobTitle,
              startDate: item.startDate,
              endDate: item.endDate,
              description: item.description,
            }));

            const res = await addExperience({
              doctorId,
              experiences: payload,
            }).unwrap();

            if (res?.succeeded) {
              toast.success(
                "Experiences added successfully"
              );

              success = true;

            } else {
              toast.error(res?.message);
            }

            return success;
          }

          // ===== CURRENT SINGLE MODE =====
          if (!validateExperience(index, data)) {
            toast.error(
              "Please fix validation errors"
            );
            return false;
          }

          if (data.isNew) {
            await addOneExperience({
              doctorId,
              experience: data,
            }).unwrap();

            toast.success(
              "Added experience Successfully"
            );

            success = true;
          } else {
            const original =
              experiencesData?.data?.find(
                item =>
                  item.doctorExperienceId ===
                  data.id
              ) || {};

            const updates =
              buildExperienceUpdatePayload(
                original,
                data
              );

            if (!Object.keys(updates).length) {
              toast("No changes found");
              return false;
            }

            const res =
              await updateExperience({
                doctorId,
                doctorExperienceId:
                  data.id,
                updates,
              }).unwrap();

            if (res?.succeeded) {
              setExperience(prev =>
                prev.map((item, i) =>
                  i === index
                    ? {
                        ...data,
                        isExpanded: false,
                      }
                    : item
                )
              );

              toast.success("Updated");

              success = true;
            } else {
              toast.error(res?.message);
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
        validateExperience,
        validateExperiences,
      ]
    );

  return {
    handleAddExperience,
    handleDeleteExperience,
    handleUpdateExperience,
    handleSaveExperience,
    isLoading,
    error,
    refetch,
    experiences,
    errors
  };
};

// TRANSFORM
const transformDoctorExperience = (exp) => ({
  ...exp,
  isNew: false,
  isExpanded: false,
});

// DIFF PAYLOAD
export const buildExperienceUpdatePayload = (original, updated) => {
  const payload = {};

  if (updated.workplace !== original.workplace) {
    payload.workplace = updated.workplace || null;
  }
  if (updated.jobTitle !== original.jobTitle) {
    payload.jobTitle = updated.jobTitle || null;
  }
  if (updated.startDate !== original.startDate) {
    payload.startDate = updated.startDate || null;
  }
  if (updated.endDate !== original.endDate) {
    payload.endDate = updated.endDate || null;
  }
  if (updated.description !== original.description) {
    payload.description = updated.description || null;
  }

  return payload;
};