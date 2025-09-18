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
    <div className="autocomplete" ref={dropdownRef}>
      {/* input */}
      <input
        type="text"
        className="autocomplete-input"
        placeholder="ابحث..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />

      {/* قائمة الاقتراحات */}
      {isOpen && (
        <div className="autocomplete-list">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                className="autocomplete-item"
                onClick={() => {
                  setSearch(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </div>
            ))
          ) : (
            <div className="autocomplete-no-results">لا توجد نتائج</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
