// hooks/useDoctorExperience.js
import { useCallback, useEffect, useState } from "react";
import {
  useAddDoctorExperienceMutation,
  useUpdateDoctorExperienceMutation,
  useDeleteDoctorExperienceMutation,
  useGetDoctorExperiencesQuery,
} from "../../../api/doctor-information/ExperienceApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export const useDoctorExperience = (New=false)=> { 
  const doctorId = useSelector((state) => state.auth.doctorId);
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
  const [updateExperience, { isLoading: isUpdating }] =
    useUpdateDoctorExperienceMutation();
  const [deleteExperience] = useDeleteDoctorExperienceMutation();

  // ADD
  const handleAddExperience = useCallback(() => {
    if (experiences?.[0]?.isNew) {
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
        i === index ? { ...item, [field]: value } : item
      )
    );
  }, []);

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
        toast.success("Deleted");
      } catch {
        toast.error("Delete failed");
      } finally {
        toast.dismiss(loading);
      }
    },
    [experiences, doctorId]
  );

  // SAVE
  const handleSaveExperience = useCallback(
    async (index, data) => {
      if (isAdding || isUpdating) return false;
      
            if (!data.workplace ) {
              toast.error(" workplace is required");
              return false;
            }
      
            if (!data.jobTitle) {
              toast.error("job title is required");
              return false;
            }
      if(!data.startDate) {
        toast.error("Start date is required");
        return false;
      }

      const loading = toast.loading("Saving...");

      try {
        let success = false;

        if (data.isNew) {
          const res = await addExperience({
            doctorId,
            experiences: [data],
          }).unwrap();

          if (res?.succeeded) {
            const created = res.data?.[0];

            setExperience((prev) =>
              prev.map((item, i) =>
                i === index
                  ? {
                      ...created,
                      id: created.doctorExperienceId,
                      isNew: false,
                      isExpanded: false,
                    }
                  : item
              )
            );

            toast.success("Added Successfully");
            success = true;
          }
        } else {
          const original =
            experiencesData?.data?.find(
              (item) => item.doctorExperienceId === data.id
            ) || {};

          const updates = buildExperienceUpdatePayload(original, data);
          if (!Object.keys(updates).length) {
            toast("No changes found");
            return;
          }

          const res = await updateExperience({
            doctorId,
            doctorExperienceId: data.id,
            updates,
          }).unwrap();

          if (res?.succeeded) {
            setExperience((prev) =>
              prev.map((item, i) =>
                i === index
                  ? { ...data, isExpanded: false }
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
        console.log("=======error",error);
        toast.error("Save failed");
        return false;
      } finally {
        toast.dismiss(loading);
      }
    },
    [doctorId, isAdding, isUpdating]
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