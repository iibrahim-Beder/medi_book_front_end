import { AnimatePresence, motion } from "framer-motion";
import { t } from "i18next";
import React, { useState } from "react";
import { FiFile, FiImage, FiX } from "react-icons/fi";

const FileField = ({
  label,
  name,
  accept,
  multiple = true,
  onChange,
  error,
  forceShowError = false,
  btnText = "profilePhoto.selectFiles",
  textInfo = "profilePhoto.dropFiles",
  sizeMB = false,
}) => {
  const [touched, setTouched] = useState(false);
  const [fileData, setFileData] = useState([]);

  const handleChange = (e) => {
    setTouched(true);

    const files = Array.from(e.target.files || []);

    const mappedFiles = files.map((file) => {
      const isImage = file.type.startsWith("image/");

      return {
        id: `${file.name}-${file.size}-${Date.now()}`,
        file,
        name: file.name,
        size: sizeMB ? (file.size / 1024 / 1024).toFixed(2) + " MB": (file.size / 1024).toFixed(2) + " KB",
        preview: isImage ? URL.createObjectURL(file) : null,
        isImage,
      };
    });

    setFileData((prev) => {
      const updatedFiles = multiple
        ? [...prev, ...mappedFiles]
        : mappedFiles;

      onChange?.({
        target: {
          name,
          files: updatedFiles.map((f) => f.file),
          multiple,
        },
      });

      return updatedFiles;
    });
  };

  const handleRemove = (index) => {
    setFileData((prev) => {
      const updatedFiles = prev.filter((_, i) => i !== index);

      onChange?.({
        target: {
          name,
          files: updatedFiles.map((f) => f.file),
          multiple,
        },
      });

      return updatedFiles;
    });
  };

  const showError = error && (touched || forceShowError);

  return (
    <div
      className={`form-group form-group-label ${
        showError ? "has-error" : ""
      }`}
    >
      <label>{label}</label>

      <div className={`dc-labelgroup ${showError ? "file-error" : ""}`}>
        <label htmlFor={name}>
          <span className="dc-btn">{t(btnText)}</span>

          <input
            id={name}
            hidden
            type="file"
            name={name}
            accept={accept}
            multiple={multiple}
            onChange={handleChange}
          />
        </label>

        <span className="dc-uploadinfo">
          {t(textInfo)}
        </span>

        <AnimatePresence mode="popLayout">
          {fileData.map((file, index) => (
            <motion.div
              key={file.id}
              className="file-preview-box"
              layout
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -15,
                scale: 0.9,
              }}
              transition={{
                duration: 0.25,
              }}
            >
              {file.isImage ? (
                <img
                  src={file.preview}
                  alt="preview"
                  className="file-thumb"
                />
              ) : (
                <div className="file-icon">
                  <FiFile />
                </div>
              )}

              <div className="file-info">
                <div className="file-name">
                  {file.isImage}
                  <span>{file.name}</span>
                </div>

                <small>{file.size}</small>
              </div>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                className="remove-file-btn"
                onClick={() => handleRemove(index)}
              >
                <FiX />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showError && (
        <small className="error-text">
          {error}
        </small>
      )}
    </div>
  );
};

export default FileField;