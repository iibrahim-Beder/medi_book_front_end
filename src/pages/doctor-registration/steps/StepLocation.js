import React, { forwardRef, useImperativeHandle } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useDoctorLocation } from "../hooks/useDoctorLocation";
import ErrorLoading from "../../shared/ErrorLoading";
import SectionTitle from "../../shared/SectionTitle";
import BlueMapPicker from "../../location-settings/carts/MapSearch";
import Loader from "../../shared/Loader";
import { BiSolidInfoCircle } from "react-icons/bi";


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
    MainHint = "You can add more than one location from within"
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
          <span className="error-text">  {errors.displayName}</span>
        )}
      </div>
        {MainHint && <span className="align-items-center d-inline-flex"><BiSolidInfoCircle style={{fontSize:"x-large" , margin: "10px 5px"}} />{MainHint}</span>} 
    </>
  );
});

export default StepLocation;