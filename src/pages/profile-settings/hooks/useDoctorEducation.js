// hooks/useDoctorEducation.js
import { useCallback, useEffect } from "react";
import {
  useAddDoctorEducationMutation,
  useUpdateDoctorEducationMutation,
  useDeleteDoctorEducationMutation,
  useGetDoctorEducationsQuery,
} from "../../../api/doctor-information/doctorEducationApi";
import toast from "react-hot-toast";


export const useDoctorEducation = (doctorId, academicData, setAcademicData) => {
  const {
    data: educations,
    isLoading,
    error,
    refetch
  } = useGetDoctorEducationsQuery({ doctorId }, { skip: !doctorId });


  useEffect(() => {
    if (educations) {
      setAcademicData(educations?.data?.map(transformDoctorEducation) || []);
    }
  }, [educations, setAcademicData]);

  const [addEducation, { isLoading: isAdding }] =
    useAddDoctorEducationMutation();
  const [updateEducation, { isLoading: isUpdating }] =
    useUpdateDoctorEducationMutation();
  const [deleteEducation] = useDeleteDoctorEducationMutation();

  // ADD
  const handleAddAcademic = useCallback(() => {
    if (academicData?.[0]?.isNew) {
      toast.error("Save previous first");
      return;
    }

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

    setAcademicData((prev) => [newItem, ...prev]);
  }, [academicData]);
  // hooks/useDoctorEducation.js

  // UPDATE LOCAL
  const handleUpdateAcademic = useCallback((index, field, value) => {
    setAcademicData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  }, []);

  // DELETE
  const handleDeleteAcademic = useCallback(
    async (index) => {
      const loading = toast.loading("Deleting...");

      try {
        const item = academicData[index];
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
        }

        setAcademicData((prev) => prev.filter((_, i) => i !== index));
        toast.success("Deleted");
      } catch {
        toast.error("Delete failed");
      } finally {
        toast.dismiss(loading);
      }
    },
    [academicData, doctorId],
  );

  // SAVE
  const handleSaveAcademic = useCallback(
    async (index, data) => {
      if (isAdding || isUpdating) return false;

       console.log("===========data",data);
      if (!data.institutionName) {
        toast.error("institution name is required");
        return false;
      }
      if (!data.graduationYear) {
        toast.error("graduation year is required");
        return false;
      }
      if (!data.degree || (data.degree==="select degree")) {
        toast.error("degree is required");
        return false;
      }

      const loading = toast.loading("Saving...");

      try {
        let success = false;

        if (data.isNew) {
          const res = await addEducation({
            doctorId,
            educations: [data],
          }).unwrap();

          if (res?.succeeded) {
            const created = res.data?.[0];

            setAcademicData((prev) =>
              prev.map((item, i) =>
                i === index
                  ? {
                      ...created,
                      id: created.doctorEducationId,
                      isNew: false,
                      isExpanded: false,
                    }
                  : item,
              ),
            );

            toast.success("Added Successfully");
            success = true;
          }
        } else {
          const original =  educations?.data?.find((item) => item.doctorEducationId === data.id) || {};

          const updates = buildEducationUpdatePayload(original, data);
          if (!Object.keys(updates).length){toast("No changes found");return;}

          const res = await updateEducation({
            doctorId,
            doctorEducationId: data.id,
            updates,
          }).unwrap();

          if (res?.succeeded) {
            setAcademicData((prev) =>
              prev.map((item, i) =>
                i === index ? { ...data, isExpanded: false } : item,
              ),
            );

            toast.success("Updated");
            success = true;
          } else {
            toast.error(res?.message);
          }
        }

        return success;
      } catch(error){ 
        console.log("=======error",error);
        toast.error("Save failed");
        return false;
      } finally {
        toast.dismiss(loading);
      }
    },
    [doctorId, isAdding, isUpdating],
  );
  return {
    handleAddAcademic,
    handleDeleteAcademic,
    handleUpdateAcademic,
    handleSaveAcademic,
    isLoading,
    error,
    refetch,
    educations: educations?.data?.map(transformDoctorEducation) || [],
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
