// Step2ProfessionalInfo.jsx
import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import Loader from "../../shared/Loader";
import Field from "../../ui/form-fields/Field";
import SectionTitle from "../../shared/SectionTitle";
import ErrorLoading from "../../shared/ErrorLoading";
import { useStep2ProfessionalInfo } from "../hooks/useStep2ProfessionalInfo";
import EditableList from "../utils/EditableList";
import TextAreaField from "../../ui/form-fields/TextAreaField";
import SelectField from "../../ui/form-fields/SelectField";

const Step3ProfessionalInfo = forwardRef(
  (
    {
       insideUi = false,
      isNew,
      doctorId =103,
      currencyOptions = [
        { label: "AOA", value: 45 },
        { label: "EGP", value: 47 },
        { label: "USD", value: 46 },
      ],
      onChange = () => {},
      forceShowError = true,
    },
    ref,
  ) => {
    const { t } = useTranslation();

    const {
      formData,
      errors,
      isLoading,
      handleInputChange,
      handleSpecialtyChange,
      handleSubmit,
      refetch,
      error,
      specialtiesOptions,
      specialtiesLoading,
      handlePrimaryChange,
    } = useStep2ProfessionalInfo(isNew, doctorId);

    useImperativeHandle(ref, () => ({
      submit: handleSubmit,
    }));

    useEffect(() => {
      onChange(formData);
    }, [formData, onChange]);

    if (error) {
      return (
        <div className="table-card">
          <ErrorLoading error={error} refetch={refetch} />
        </div>
      );
    }

    return (
      <>
      <div className={`${insideUi ||true? "table-card insideUi" : ""}`}>
        {insideUi ? (
          <div className="dc-tabscontenttitle">
            <h3>{t("professionalInfo.title")}</h3>
          </div>
        ) : (
          <SectionTitle title={t("professionalInfo.title")} />
        )}

        <div
          style={{ position: "relative" }}
        >
          <form className="dc-formtheme dc-userform">
            <fieldset>
          {isLoading && Loader("form-loader")}
              {/* years of experience */}
              <div className="form-group form-group-half">
                <Field
                  label={t("years of experience")}
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  error={errors.yearsOfExperience}
                  className="form-control"
                  placeholder={t("years of experience")}
                  min="0"
                  forceShowError={true}
                />
              </div>

              {/* price */}
              <div className="form-group form-group-half">
                <Field
                  label={t("default Price")}
                  type="number"
                  name="defaultPricePerSession"
                  value={formData.defaultPricePerSession}
                  onChange={handleInputChange}
                  error={errors.defaultPricePerSession}
                  className="form-control"
                  placeholder={t("defaultPrice")}
                  //   min="0"
                  //   step="0.01"
                  forceShowError={true}
                />
              </div>

              {/* currency */}
              <div className="form-group form-group-half">
                <SelectField
                  label={t("currency")}
                  name="defaultCurrencyId"
                  value={formData.defaultCurrencyId}
                  onChange={handleInputChange}
                  error={errors.defaultCurrencyId}
                  className="form-control"
                  options={currencyOptions}
                  forceShowError={true}
                />
              </div>

              {/* languages */}
              <div className="form-group form-group-half">
                <Field
                  label={t("languages")}
                  name="languagesSpoken"
                  value={formData.languagesSpoken}
                  onChange={handleInputChange}
                  error={errors.languagesSpoken}
                  placeholder={t("languages")}
                  forceShowError={true}
                />
              </div>

              {/* bio */}
              <div className="form-group form-group-full">
                <TextAreaField
                  label={t("bio")}
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  error={errors.bio}
                  className="form-control"
                  rows={4}
                  placeholder={t("professionalInfo.bio.placeholder")}
                  forceShowError={true}
                />
              </div>

              {/* specialties */}
              <EditableList
                // headerComponent={ insideUi? false : <SectionTitle title="Specialties" />}
                title="Specialties"
                initialItems={formData?.specialties || []}
                options={specialtiesOptions}
                isLoading={specialtiesLoading}
                selectName="specialty"
                selectLabel="Specialty"
                fieldKey="value"
                onChange={(items) => handleSpecialtyChange(items)}
                primarySpecialtyId={formData.primarySpecialtyId}
                onPrimaryChange={handlePrimaryChange}
                forceShowError={true}
              />
            </fieldset>
             {  insideUi && <button
            style={{ float: "inline-end" }}
            type="button"
            className="second-btn mt-3"
            onClick={handleSubmit}
            disabled={ isLoading }
          >
            {isLoading ? t("loading") : t("save")}
          </button>}
          </form>
        </div>
      </div>
      </>
    );
  },
);

export default Step3ProfessionalInfo;
