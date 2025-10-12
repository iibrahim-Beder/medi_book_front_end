import React, { useState, useRef, useEffect } from "react";
import "./dropdown.css";
import {
  Box,
  TextField,
  List,
  ListItem,
  InputAdornment,
  Paper,
  MenuItem,
  ClickAwayListener,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { CiSearch } from "react-icons/ci";
import Popper from "@mui/material/Popper";

const DropdownWithSearch = ({
  label = "Dropdown",
  options = [],
  itemsPerPage = 6,
  placeholder = "Select option",
  value = null, // currently selected value (id)
  onChange = () => {},
  onNext = () => {},
  onPrev = () => {},
  disabled = false,
  labelKey = "label", 
  valueKey = "id",    
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(300);

  const selectRef = useRef(null);
  const searchInputRef = useRef(null);

  // Get the selected option for display
  const selectedOption = options.find(opt => {
    if (typeof opt === "string") {
      return opt === value;
    }
    return opt[valueKey] === value;
  });

  const displayValue = selectedOption 
    ? (typeof selectedOption === "string" ? selectedOption : selectedOption[labelKey])
    : placeholder;

  // Keep dropdown width in sync with input width
useEffect(() => {
  if (!selectRef.current) return;

  const updateWidth = () => {
    if (selectRef.current) {
      setWidth(selectRef.current.offsetWidth);
    }
  };

  const observer = new ResizeObserver(updateWidth);
  observer.observe(selectRef.current);

  // Initial update
  updateWidth();

  return () => {
    observer.disconnect();
  };
}, []);


  // Autofocus search input when dropdown opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      requestAnimationFrame(() => searchInputRef.current.focus());
    }
  }, [open]);

  // Filter options by search term
  const filteredOptions = options.filter((opt) => {
    const label = typeof opt === "string" ? opt : String(opt[labelKey]);
    return label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredOptions.length / itemsPerPage);
  const currentItems = filteredOptions.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchTerm("");
    setPage(0);
  };

  // Handle selecting an item (returns only the id if object)
  const handleSelect = (option) => {
    if (typeof option === "string") {
      onChange(option);
    } else {
      onChange(option[valueKey]);
    }
    handleClose();
  };

  const handleNextPage = (event) => {
    event.stopPropagation();
    if (page < totalPages - 1) {
      setPage(page + 1);
      onNext(page + 1);
    }
  };

  const handlePrevPage = (event) => {
    event.stopPropagation();
    if (page > 0) {
      setPage(page - 1);
      onPrev(page - 1);
    }
  };

  return (
    <div className="dropdown-container" style={{ opacity: disabled ? 0.6 : 1 }}>
      <Box
        sx={{
          // width: "100%",
          margin: "10px 0 20px 0",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <TextField
          disabled={disabled}
          ref={selectRef}
          label={label}
          value={displayValue}
          onClick={disabled ? undefined : handleClick}
          fullWidth
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <ArrowDropDownIcon
                  sx={{
                    transition: "transform 0.3s",
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    cursor: "pointer",
                    borderRadius: "28px",
                  }}
                />
              </InputAdornment>
            ),
          }}
        />

        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-start"
          disablePortal
          modifiers={[
            { name: "offset", options: { offset: [0, 4] } },
            { name: "preventOverflow", options: { padding: 8 } },
            { name: "flip", enabled: true },
          ]}
          style={{ zIndex: 1300, width }}
        >
          <ClickAwayListener onClickAway={handleClose}>
            <Paper
              sx={{
                borderRadius: "0 0 10px 10px",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0px 11px 12px 0px #dbdbdb45",
                border: "1px solid #ddd",
                width: width,
                position: "absolute",
                zIndex: 2,
              }}
            >
              {/* Search field inside dropdown */}
              <TextField
                inputRef={searchInputRef}
                className="inside-search"
                variant="outlined"
                size="small"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CiSearch
                        style={{ color: "#012047", fontSize: "20px" }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{ marginBottom: "10px" }}
              />

              {/* Render filtered items */}
              <List sx={{ maxHeight: 150, overflowY: "auto" }}>
                {currentItems.length > 0 ? (
                  currentItems.map((opt) => {
                    const label =
                      typeof opt === "string" ? opt : String(opt[labelKey]);
                    const value =
                      typeof opt === "string" ? opt : opt[valueKey];

                    return (
                      <ListItem
                        key={value}
                        button
                        onClick={() => handleSelect(opt)}
                        sx={{ borderRadius: "5px", "&:hover": { backgroundColor: "#f0f0f0" } }}
                      >
                        {label}
                      </ListItem>
                    );
                  })
                ) : (
                  <MenuItem style={{ margin: "auto" }} disabled>
                    No results
                  </MenuItem>
                )}
              </List>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <nav
                  className="dc-pagination"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    borderTop: "1px solid #eee",
                    paddingTop: "10px",
                  }}
                >
                  <ul style={{ width: "100%" }}>
                    <li
                      className="dc-prevpage"
                      onClick={handlePrevPage}
                      style={{
                        cursor: page === 0 ? "not-allowed" : "pointer",
                        opacity: page === 0 ? 0.5 : 1,
                      }}
                    >
                      <a style={{ paddingTop: "4px" }}>
                        <NavigateBeforeIcon fontSize="small" />
                      </a>
                    </li>
                    <li
                      key={1}
                      onClick={() => setPage(0)}
                      style={{
                        cursor: "pointer",
                        fontWeight: page === 0 ? "bold" : "normal",
                      }}
                    >
                      <a>1</a>
                    </li>
                    <li key="dots">
                      <a>...</a>
                    </li>
                    {page > 0 && page < totalPages - 1 && (
                      <li
                        key={page + 1}
                        onClick={() => setPage(page)}
                        style={{
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        <a>{page + 1}</a>
                      </li>
                    )}
                    <li
                      key={totalPages}
                      onClick={() => setPage(totalPages - 1)}
                      style={{
                        cursor: "pointer",
                        fontWeight: page === totalPages - 1 ? "bold" : "normal",
                      }}
                    >
                      <a>{totalPages}</a>
                    </li>
                    <li
                      className="dc-nextpage"
                      onClick={handleNextPage}
                      style={{
                        cursor:
                          page >= totalPages - 1 ? "not-allowed" : "pointer",
                        opacity: page >= totalPages - 1 ? 0.5 : 1,
                      }}
                    >
                      <a style={{ paddingTop: "4px" }}>
                        <NavigateNextIcon fontSize="small" />
                      </a>
                    </li>
                  </ul>
                </nav>
              )}
            </Paper>
          </ClickAwayListener>
        </Popper>
      </Box>
    </div>
  );
};

export default DropdownWithSearch;
