
export const noteTypeOptions = ["Communication", "Administrative", "Reminder"];

export const patientNotesHelpers = (t) => {
  // Fields used inside the accordion
  const notesFormFields = [
    {
      name: "noteType",
      label: t("Note Type"),
      type: "select",
      placeholder: t("Select note type"),
      options: noteTypeOptions.map(type => ({ value: type, label: type })),
      half: false,
      readOnly: false
    },
    {
      name: "content",
      label: t("Content"),
      type: "textarea",
      placeholder: t("Enter note content..."),
      half: false,
      readOnly: false
    },
    {
      name: "displayCreatedAt",
      label: t("Created Date"),
      type: "text",
      placeholder: t("Created date"),
      half: true,
      readOnly: true,
      disabled: true

    },
    {
      name: "displayLastModifiedAt",
      label: t("Last Modified"),
      type: "text",
      placeholder: t("Last modified date"),
      half: true,
      readOnly: true,
      disabled: true
    }
  ];
  // Filter configurations
  const filterConfigs = [
    {
      name: "noteType",
      label: "Note Type",
      data: noteTypeOptions.map(opt => ({
        key: opt,
        label: opt,
      })),
    },
  ];

  // Empty states
  const emptyStates = {
    loading: t("Loading notes..."),
    error: t("Error loading notes"),
    noResults: (searchValue) => 
      searchValue 
        ? t('No results found for "{{search}}"', { search: searchValue })
        : t('No notes found')
  };

  return {
    notesFormFields,
    filterConfigs,
    emptyStates
  };
};

// Helper function to create index-based handlers for CustomAccordion
export const createIndexBasedHandlers = (data, handlers) => {
  return {
    onDelete: (index) => {
      const item = data[index];
      if (item && handlers.onDelete) {
        handlers.onDelete(item.id);
      }
    },
    onUpdate: (index, field, value) => {
      const item = data[index];
      if (item && handlers.onUpdate) {
        handlers.onUpdate(item.id, field, value);
      }
    },
    onSave: (index, itemData) => {
      const item = data[index];
      if (item && handlers.onSave) {
        handlers.onSave(item.id, itemData);
      }
    },
    onCancel: (index) => {
      const item = data[index];
      if (item && handlers.onCancel) {
        handlers.onCancel(item.id);
      }
    }
  };
};
