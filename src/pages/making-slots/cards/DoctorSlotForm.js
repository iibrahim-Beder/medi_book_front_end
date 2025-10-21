import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; 

export default function DoctorSlotForm({
  doctorShift = {},
  onSave,
  appointmentTypes = [],
  currencies = [],
  clinics = []
}) {
  const { t } = useTranslation(); 
  const [formData, setFormData] = useState({
    SlotDurationInMinutes: 30,
    DaysInAdvance: 7,
    startTime: '09:00',
    endTime: '17:00',
    Price: 0,
    Currency: 'EGP',
    AllowedAppointmentTypes: [],
    clinic: '',
    ...doctorShift
  });

  useEffect(() => {
    setFormData({
      SlotDurationInMinutes: 30,
      DaysInAdvance: 7,
      startTime: '09:00',
      endTime: '17:00',
      Price: 0,
      Currency: 'EGP',
      AllowedAppointmentTypes: [],
      clinic: '',
      ...doctorShift
    });
  }, [doctorShift]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (type, isChecked) => {
    const updatedTypes = isChecked
      ? [...formData.AllowedAppointmentTypes, type]
      : formData.AllowedAppointmentTypes.filter(t => t !== type);
    
    handleInputChange("AllowedAppointmentTypes", updatedTypes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="dc-formtheme dc-userform" onSubmit={handleSubmit}>
      <fieldset>
        <div className="form-group">
          <label>{t("clinic")}</label>
          <select
            className="form-control"
            value={formData.clinic || ''}
            onChange={(e) => handleInputChange("clinic", e.target.value)}
          >
            <option value="">{t("selectClinic")}</option>
            {clinics.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group form-group-half">
          <label>{t("slotDurationMinutes")}</label>
          <input
            type="number"
            className="form-control"
            value={formData.SlotDurationInMinutes}
            onChange={(e) => handleInputChange("SlotDurationInMinutes", parseInt(e.target.value) || 30)}
            min="5"
            step="5"
          />
        </div>

        <div className="form-group form-group-half">
          <label>{t("daysInAdvance")}</label>
          <input
            type="number"
            className="form-control"
            value={formData.DaysInAdvance}
            onChange={(e) => handleInputChange("DaysInAdvance", parseInt(e.target.value) || 7)}
            min="1"
          />
        </div>

        <div className="form-group form-group-half">
          <label>{t("startTime")}</label>
          <input
            type="time"
            className="form-control"
            value={formData.startTime}
            onChange={(e) => handleInputChange("startTime", e.target.value)}
          />
        </div>

        <div className="form-group form-group-half">
          <label>{t("endTime")}</label>
          <input
            type="time"
            className="form-control"
            value={formData.endTime}
            onChange={(e) => handleInputChange("endTime", e.target.value)}
          />
        </div>

        <div className="form-group form-group-half">
          <label>{t("price")}</label>
          <input
            type="number"
            className="form-control"
            value={formData.Price}
            onChange={(e) => handleInputChange("Price", parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="form-group form-group-half">
          <label>{t("currency")}</label>
          <select
            className="form-control"
            value={formData.Currency}
            onChange={(e) => handleInputChange("Currency", e.target.value)}
          >
            <option value="">{t("selectCurrency")}</option>
            {currencies.map(currency => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>{t("allowedAppointmentTypes")}</label>
          <div className="dc-checkboxgroup">
            {appointmentTypes.map((type, index) => (
              <span key={type} className="dc-checkbox">
                <input
                  id={`dc-app-type-${index}`}
                  type="checkbox"
                  name={`app-type-${index}`}
                  value={type}
                  checked={formData.AllowedAppointmentTypes.includes(type)}
                  onChange={(e) => handleCheckboxChange(type, e.target.checked)}
                />
                <label htmlFor={`dc-app-type-${index}`}>{t(`appointmentTypes.${type}`)}</label>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3"style={{float:"inline-end"}} >
          <button style={{ margin: "20px" }} type="submit" className="dc-btn">
            {t("saveChanges")}
          </button>
        </div>
      </fieldset>
    </form>
  );
}
