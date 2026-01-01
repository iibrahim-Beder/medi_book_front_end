import { useState } from "react";
import { useTranslation } from "react-i18next";
import DoctorSlotsAccordion from "./cards/DoctorSlotsAccordion";

const CLINICS = [
  { id: 1, name: "Clinic A" },
  { id: 2, name: "Clinic B" },
  { id: 3, name: "Clinic C" }
];

const APPOINTMENT_TYPES = ["Consultation", "Follow-up", "Check-up", "Emergency"];
const CURRENCIES = ["EGP", "USD", "EUR", "GBP"];

export default function MakeSlotsMain({ header = true, formData, onSlotsChange, errors }) {
  const { t } = useTranslation();
  
  const DAYS = [
    t("days.saturday"),
    t("days.sunday"), 
    t("days.monday"),
    t("days.tuesday"),
    t("days.wednesday"),
    t("days.thursday"),
    t("days.friday")
  ];

  const [activeTab, setActiveTab] = useState(DAYS[0]);
  const [slots, setSlots] = useState({
    [t("days.saturday")]: [
      {
        id: 1,
        clinic: "1",
        SlotDurationInMinutes: 30,
        DaysInAdvance: 7,
        startTime: "09:00",
        endTime: "17:00",
        Price: 200,
        Currency: "EGP",
        AllowedAppointmentTypes: ["Consultation", "Follow-up"],
        isExpanded: false,
        isNew: false
      }
    ],
    [t("days.sunday")]: [],
    [t("days.monday")]: [],
    [t("days.tuesday")]: [],
    [t("days.wednesday")]: [],
    [t("days.thursday")]: [],
    [t("days.friday")]: []
  });

  const handleUpdateSlots = (updated) => {
    setSlots(updated);
    if (onSlotsChange) {
      onSlotsChange(updated);
    }
  };

  // Handler for adding new slot
  const handleAddSlot = (day) => {
    const updated = {
      ...slots,
      [day]: [
        {
          id: Date.now(),
          clinic: "",
          SlotDurationInMinutes: 30,
          DaysInAdvance: 7,
          startTime: "09:00",
          endTime: "17:00",
          Price: 0,
          Currency: "EGP",
          AllowedAppointmentTypes: [],
          isExpanded: true, // Open the new slot automatically
          isNew: true
        },
        ...(slots[day] || [])
      ]
    };
    handleUpdateSlots(updated);
  };

  // Handler for updating slot field
  const handleUpdateSlot = (index, field, value) => {
    const updated = {
      ...slots,
      [activeTab]: slots[activeTab].map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      )
    };
    handleUpdateSlots(updated);
  };

  // Handler for saving slot (closes the accordion)
  const handleSaveSlot = (index, slotData) => {
    const updated = {
      ...slots,
      [activeTab]: slots[activeTab].map((slot, i) =>
        i === index ? { ...slot, ...slotData, isExpanded: false, isNew: false } : slot
      )
    };
    handleUpdateSlots(updated);
  };

  // Handler for deleting slot
  const handleDeleteSlot = (index) => {
    const updated = {
      ...slots,
      [activeTab]: slots[activeTab].filter((_, i) => i !== index)
    };
    handleUpdateSlots(updated);
  };

  // Get title for slot item
  const getSlotItemTitle = (slot) => {
    const clinicName = CLINICS.find(c => c.id.toString() === slot.clinic?.toString())?.name || t("selectClinic");
    return `${clinicName} - ${slot.startTime || "00:00"} to ${slot.endTime || "00:00"}`;
  };

  return (
    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <div className="dc-haslayout dc-dbsectionspace">
        <div className={`dc-dashboardbox dc-dashboardtabsholder ${header ? "NewShado" : "table-card noneshadow"}`}>
          {header && (
            <div className="dc-dashboardboxtitle">
              <h2>{t("Make Slots")}</h2>
            </div>
          )}
          
          <div className="divtoconvert">
            <div className="dc-dashboardtabs">
              <ul className="dc-tabstitle nav navbar-nav">
                {DAYS.map(day => (
                  <li key={day} className="nav-item">
                    <a
                      href="#"
                      className={activeTab === day ? "active" : ""}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab(day);
                      }}
                    >
                      {day}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="dc-tabscontent tab-content accordion-table"style={{minHeight:"550px"}}>
              <DoctorSlotsAccordion
                accordioninnertitleSize="slots-accordion-title"
                title={`${t("Slots")} ${activeTab}`}
                addNewLabel={t("Add Slot")}
                data={slots[activeTab] || []}
                clinics={CLINICS}
                appointmentTypes={APPOINTMENT_TYPES}
                currencies={CURRENCIES}
                onAdd={() => handleAddSlot(activeTab)}
                onDelete={handleDeleteSlot}
                onUpdate={handleUpdateSlot}
                onSave={handleSaveSlot}
                getItemTitle={getSlotItemTitle}
                // noDataMessage={t("noSlotsMessage")}
                errors={errors}
                allowMultipleOpen={true}
                noHedarBefore={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}