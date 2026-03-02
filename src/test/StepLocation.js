import React, { forwardRef, useImperativeHandle } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import ErrorLoading from "../pages/shared/ErrorLoading";
import SectionTitle from "../pages/shared/SectionTitle";
import Loader from"../pages/shared/Loader";
import { useDoctorLocation } from "../pages/doctor-registration/hooks/useStep3Locations";
import BlueMapPicker from "../pages/location-settings/carts/MapSearch";

const StepLocation = forwardRef(({ isNew, doctorId }, ref) => {
  const { t } = useTranslation();

  const {
    formData,
    setFormData,
    errors,
    handleSubmit,
    isLoading,
    error,
    refetch,
  } = useDoctorLocation(isNew, doctorId);

  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));

  if (error) return <ErrorLoading error={error} refetch={refetch} />;

  return (
    <>
      <SectionTitle icon={<FaMapMarkerAlt />} title={t("Location")} />

      <div className="table-card" style={{ position: "relative" }}>
        {isLoading && Loader("form-loader")}

        <BlueMapPicker
          value={formData}
          onChange={(loc) =>
            setFormData((prev) => ({ ...prev, ...loc }))
          }
        />

        {errors.location && (
          <p style={{ color: "red" }}>{errors.location}</p>
        )}
        {errors.displayName && (
          <p style={{ color: "red" }}>{errors.displayName}</p>
        )}
      </div>
    </>
  );
});

export default StepLocation;