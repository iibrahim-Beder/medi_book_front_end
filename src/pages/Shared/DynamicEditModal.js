// components/DynamicEditModal.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";
import Field from "../ui/form-fields/Field"; 
import TextAreaField from "../ui/form-fields/TextAreaField";
import { MdClose } from "react-icons/md";

const DynamicEditModal = ({
  show,
  onClose,
  onSave,
  record,
  setRecord,
  fields,
  title = "Edit Record",
  errors = {},
  forceShowError = true,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecord({ ...record, [name]: value });
  };

  return (
    <Modal show={show} onHide={onClose} centered className="custom-edit-modal">
     <Modal.Header style={{ 
        position: "relative", 
        borderBottom: "1px solid #dee2e6", 
        padding: "1.5rem 1.5rem 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <Modal.Title style={{ fontWeight: "600", fontSize: "1.4rem", margin: 0 }}>
          {title}
        </Modal.Title>
        
        {/* زر الإغلاق الإضافي في أعلى اليمين */}
        <Button 
          // variant="close" 
          onClick={onClose} 
          style={{
            zIndex: 1050,
            fontSize: "1.5rem",
            padding: "0.35rem 0.65rem",
            lineHeight: 1,
            // backgroundColor: "#f8f9fa",
            borderRadius: "50%",
            opacity: 0.8,
            margin: 0,
            backgroundColor:"transparent",
            border:"none",
            boxShadow:"none",
            color:"black"
          }}
          onMouseOver={(e) => e.target.style.opacity = "1"}
          onMouseOut={(e) => e.target.style.opacity = "0.8"}
        >
          {/* <span aria-hidden="true">&times;</span> */}
          <MdClose/>
        </Button>
      </Modal.Header>

      <Modal.Body style={{ padding: "0.5rem 1.5rem 1rem" }}>
        {record && (
          <div className="form-grid" style={{ rowGap: "0.8rem" }}>
            {fields.map((field) => {
              if (field.type === "textarea") {
                return (
                  <TextAreaField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={record[field.name] || ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    error={errors?.[field.name]}
                    forceShowError={forceShowError}
                  />
                );
              }

              return (
                <Field
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  type={field.type || "text"}
                  value={record[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  icon={field.icon}
                  options={field.options}
                  error={errors?.[field.name]}
                  forceShowError={forceShowError}
                />
              );
            })}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer
        style={{
          border: "none",
          padding: "0.5rem 1.5rem 1.5rem",
          gap: "0.8rem",
        }}
      >
        <button  className="btn btn-light"    
        onClick={onClose}
         >Cancel</button>
        <button  
        onClick={onSave}
        className="dc-btn">Save Changes</button>
      </Modal.Footer>
    </Modal>
  );
};

export default DynamicEditModal;