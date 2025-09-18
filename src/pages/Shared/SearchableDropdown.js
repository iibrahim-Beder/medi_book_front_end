import React, { useState, useRef, useEffect } from "react";

const Autocomplete = () => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = ["Apple", "Banana", "Orange", "Mango", "Grape"];

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  // يقفل القائمة لو ضغطت برة
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} style={{ width: "250px", position: "relative" }}>
      {/* input البحث */}
      <input
        type="text"
        placeholder="ابحث..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)} // يفتح القائمة أول ما تدوس
        style={{
          width: "100%",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      />

      {/* قائمة الخيارات */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "45px",
            width: "100%",
            border: "1px solid #ddd",
            borderRadius: "6px",
            background: "#fff",
            zIndex: 1000,
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => {
                  setSearch(option); // يحط الاختيار في الـ input
                  setIsOpen(false); // يقفل الليست
                }}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#f7f7f7")}
                onMouseLeave={(e) => (e.target.style.background = "#fff")}
              >
                {option}
              </div>
            ))
          ) : (
            <div style={{ padding: "10px", color: "#888" }}>
              لا توجد نتائج
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
