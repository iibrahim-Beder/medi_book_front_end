import { useState } from "react";
import { useTranslation } from "react-i18next";
import CustomAccordion from "../shared/CustomAccordion";


export const timeline = [
  { id: 2,start: 2, end: 3, type: "free"  },
  { id: 3,start: 3, end: 3.5, type: "busy",price: 50 },
  { id: 4,start: 3.5, end: 6, type: "free", },
  { id: 5,start: 6, end: 6.5, type: "busy", price: 50},
  { id: 6,start: 6.5, end: 8, type: "free", },
  { id: 7, start: 8, end: 8.5, type: "break", },
  { id: 8,start: 8.5, end: 13, type: "free", },
  { id: 9,start: 13, end: 13.5, type: "busy",price: 50 },
  { id: 10,start: 13.5, end: 14, type: "free", },
  { id: 11,start: 14, end: 15, type: "busy",price: 50 },
  { id: 12,start: 15, end: 17, type: "free", },
  { id: 13,start: 17, end: 20, type: "busy",price: 50 },
  { id: 14,start: 20, end: 21, type: "free", },
];
const APPOINTMENT_TYPES = ["Consultation", "Follow-up", "Check-up", "Emergency"];
const CURRENCIES = ["EGP", "USD", "EUR", "GBP"];

export default function MakeSlotsMain({ header = true, formData, onSlotsChange, errors }) {
  const { t } = useTranslation();
    // Form Fields definition for slots
  const formFields = [
    {
      name: "SlotDurationInMinutes",
      label: t("slotDurationMinutes"),
      type: "number",
      min: 5,
      step: 5,
      half: true
    },
    {
      name: "DaysInAdvance",
      label: t("daysInAdvance"),
      type: "number",
      min: 1,
      half: true
    },
    {
      name: "rangeTime",
      label: t("Select time Range"),
      type: "timeRange",
      half: false
    },
    {
      name: "Price",
      label: t("price"),
      type: "number",
      min: 0,
      half: true
    },
    {
      name: "Currency",
      label: t("currency"),
      type: "select",
      options: [{ value: "", label: t("selectCurrency") }, ...CURRENCIES.map(c => ({ value: c, label: c }))],
      half: true
    },
    {
      name: "AllowedAppointmentTypes",
      label: t("allowedAppointmentTypes"),
      type: "checkboxes",
      options: APPOINTMENT_TYPES
    }
  ];
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
        id: 2,
        SlotDurationInMinutes: 30,
        DaysInAdvance: 7,
        rangeTime: {start: "09:00", end: "17:00" },
        Price: 200,
        Currency: "USD",
        AllowedAppointmentTypes: ["Consultation", "Follow-up"],
        isExpanded: false,
        isNew: false
      },
      {
        id: 3,
        SlotDurationInMinutes: 30,
        DaysInAdvance: 7,
        rangeTime: {start: "09:00", end: "17:00" },
        Price: 200,
        Currency: "USD",
        AllowedAppointmentTypes: ["Consultation", "Follow-up"],
        isExpanded: false,
        isNew: false
      },
    ],
    [t("days.sunday")]: [],
    [t("days.monday")]: [],
    [t("days.tuesday")]: [],
    [t("days.wednesday")]: [],
    [t("days.thursday")]: [],
    [t("days.friday")]: []
  });

  const handleUpdateSlots = (updated) => {
    // console.log("updated",updated)
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
          rangeTime: {start: "09:00", end: "17:00" },
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
    return `${slot.rangeTime.start || "00:00"} to ${slot.rangeTime.end || "00:00"}  -${slot.Price} ${slot.Currency}`;
  };

  return (
            <div className= "w-100 border-0  dc-tabscontent tab-content accordion-table accordion-table-card " style={{minHeight:"550px"}}>
              <CustomAccordion
                accordioninnertitleSize="slots-accordion-title"
                title={`${t("Slots")} ${activeTab}`}
                addNewLabel={t("Add New Slot")}
                data={slots[activeTab] || []}
                formFields={formFields}
                appointmentTypes={APPOINTMENT_TYPES}
                currencies={CURRENCIES}
                onAdd={() => handleAddSlot(activeTab)}
                onDelete={handleDeleteSlot}
                onUpdate={handleUpdateSlot}
                onSave={handleSaveSlot}
                getItemTitle={getSlotItemTitle}
                // noDataMessage={t("noSlotsMessage")}
                errors={errors}
                // allowMultipleOpen={false}
                noHedarBefore={true}
                timeline={timeline}
              />
            </div>

  );
}