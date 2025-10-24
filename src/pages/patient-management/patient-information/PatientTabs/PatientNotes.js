import React, { useState } from "react";
import CustomAccordion from "../../../shared/CustomAccordion";
import DynamicEditModal from "../../../shared/DynamicEditModal";
import { useDevice } from "../../../../context/useIsMobile";
export const mockNotesData = [
  {
    id: 1,
    noteType: "Communication",
    content: "Patient reported feeling better after medication adjustment.",
    createdAt: "2024-01-15T10:30:00Z",
    lastModifiedAt: "2024-01-15T10:30:00Z",
    isExpanded: false,
    isNew: false
  },
  {
    id: 2,
    noteType: "Administrative",
    content: "Follow-up appointment scheduled for next week.",
    createdAt: "2024-01-14T14:20:00Z",
    lastModifiedAt: "2024-01-14T14:20:00Z",
    isExpanded: false,
    isNew: false
  },
  {
    id: 3,
    noteType: "Reminder",
    content: "Reminder to check lab results on Monday.",
    createdAt: "2024-01-13T09:15:00Z", 
    lastModifiedAt: "2024-01-13T09:15:00Z",
    isExpanded: false,
    isNew: false
  }
];

export const noteTypeOptions = ["Communication", "Administrative", "Reminder"];

// Helper function to format date for display
export const formatDateForDisplay = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const PatientNotes = () => {
  const [notes, setNotes] = useState(mockNotesData);
  const [showModal, setShowModal] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const {isMobile} = useDevice();
  // Fields used inside the accordion
  const notesFormFields = [
    {
      name: "noteType",
      label: "Note Type",
      type: "select",
      placeholder: "Select note type",
      options: noteTypeOptions,
      half: false,
      readOnly: false 
    },
    {
      name: "content", 
      label: "Content",
      type: "textarea",
      placeholder: "Enter note content...",
      half: false,
      readOnly: false 
    },
    {
      name: "createdAt",
      label: "Created Date",
      type: "text",
      placeholder: "Created date",
      half: true,
      readOnly: true 
    },
    {
      name: "lastModifiedAt",
      label: "Last Modified",
      type: "text",
      placeholder: "Last modified date", 
      half: true,
      readOnly: true 
    }
  ];

  // Fields used inside the modal
  const notestModalFields = [
    {
      name: "noteType",
      label: "Note Type",
      type: "select",
      placeholder: "Select note type",
      options: noteTypeOptions,
      half: false,   
      AllWidth: true
    },
    {
      name: "content", 
      label: "Content",
      type: "textarea",
      placeholder: "Enter note content...",
      half: false,
    }
  ];

  // Handle adding a new note
  const handleAddNote = () => {
    const newNote = {
      id: Date.now(), // Temporary unique ID
      noteType: "Communication",
      content: "",
      createdAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
      isExpanded: false,
      isNew: true,
      displayCreatedAt: formatDateForDisplay(new Date().toISOString()),
      displayLastModifiedAt: formatDateForDisplay(new Date().toISOString())
    };
    
    setCurrentNote(newNote);
    setShowModal(true);
  };

  // Handle inline updates from accordion fields
  const handleUpdateNote = (index, field, value) => {
    setNotes(prev => prev.map((note, i) => {
      if (i === index) {
        const updatedNote = { 
          ...note, 
          [field]: value,
          lastModifiedAt: new Date().toISOString(),
          displayLastModifiedAt: formatDateForDisplay(new Date().toISOString())
        };
        return updatedNote;
      }
      return note;
    }));
  };

  // Delete note by index
  const handleDeleteNote = (index) => {
    setNotes(prev => prev.filter((_, i) => i !== index));
  };

  // Save note from accordion (after inline edit)
  const handleSaveNote = (index, noteData) => {
    setNotes(prev => prev.map((note, i) => {
      if (i === index) {
        return {
          ...note,
          ...noteData,
          isExpanded: false,
          isNew: false,
          lastModifiedAt: new Date().toISOString(),
          displayLastModifiedAt: formatDateForDisplay(new Date().toISOString())
        };
      }
      return note;
    }));
  };

  // Save note from modal (add or edit)
  const handleSaveModal = () => {
    if (currentNote) {
      const now = new Date().toISOString();
      const formattedNow = formatDateForDisplay(now);
      
      if (currentNote.isNew) {
        // Add new note to the beginning of the list
        setNotes(prev => [{
          ...currentNote,
          id: Math.max(0, ...prev.map(n => n.id)) + 1, // Generate new ID
          createdAt: now,
          lastModifiedAt: now,
          displayCreatedAt: formattedNow,
          displayLastModifiedAt: formattedNow,
          isExpanded: false,
          isNew: false
        }, ...prev]);
      } else {
        // Update existing note
        setNotes(prev => prev.map(note => 
          note.id === currentNote.id ? {
            ...currentNote,
            lastModifiedAt: now,
            displayLastModifiedAt: formattedNow
          } : note
        ));
      }
    }
    setShowModal(false);
    setCurrentNote(null);
  };

  // Open modal for editing selected note
  const handleEditWithModal = (index) => {
    const noteToEdit = notes[index];
    setCurrentNote({ 
      ...noteToEdit, 
      index,
      displayCreatedAt: noteToEdit.displayCreatedAt || formatDateForDisplay(noteToEdit.createdAt),
      displayLastModifiedAt: noteToEdit.displayLastModifiedAt || formatDateForDisplay(noteToEdit.lastModifiedAt)
    });
    setShowModal(true);
  };

  // Prepare data for accordion display
  const accordionData = notes.map(note => ({
    ...note,
    title: note.noteType,
    date: formatDateForDisplay(note.lastModifiedAt || note.createdAt),
    displayCreatedAt: note.displayCreatedAt || formatDateForDisplay(note.createdAt),
    displayLastModifiedAt: note.displayLastModifiedAt || formatDateForDisplay(note.lastModifiedAt)
  }));

  return (
    <div className="Accordion-section d-flex">
      {/* Pass all fields including read-only ones */}
      <div className={`table-card ${isMobile ? 'mobile-view' : ''}`}  >
        <CustomAccordion
          title=" Patient Notes"
          addNewLabel="Add New Note"
          data={accordionData}  
          formFields={notesFormFields}
          onAdd={handleAddNote}
          onDelete={handleDeleteNote}
          onUpdate={handleUpdateNote}
          onSave={handleSaveNote}
          accordioninnertitleSize=""
          noHedarBefore={true}
        />
      </div>

      {/* Modal used for adding and editing notes */}
      <DynamicEditModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setCurrentNote(null);
        }}
        onSave={handleSaveModal}
        record={currentNote}
        setRecord={setCurrentNote}
        fields={notestModalFields}
        title={currentNote?.isNew ? "Add New Note" : "Edit Note"}
      />
    </div>
  );
};

export default PatientNotes;
