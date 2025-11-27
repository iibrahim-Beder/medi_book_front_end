import Skeleton from "@mui/material/Skeleton";
import React, { useState, useRef, useEffect, useCallback } from "react";
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
import useDropdownData from "./remoteDropdown/useDropdownData";

const DropdownWithSearch = ({
  type = "medication", // medication, disease, allergy
  value = null,
  onChange = () => {},
  disabled = false,
  itemsPerPage = 6,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(300);

  const selectRef = useRef(null);
  const searchInputRef = useRef(null);

  const { items: options, loading, error, totalPages } = useDropdownData(type, searchTerm, page, itemsPerPage,open );

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

  // Reset page when search term changes
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  const displayValue = value?.name ? value.name : `Select ${type}`;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = (option) => {
    onChange(option);
    handleClose();
  };

  const handleNextPage = (event) => {
    event.stopPropagation();
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = (event) => {
    event.stopPropagation();
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

const LoadingSkeleton = () => {
  return (
    <>
      {[...Array(itemsPerPage)].map((_, idx) => (
        <div key={idx} style={{ padding: "6px 0" }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={30}
            sx={{ borderRadius: "6px", marginBottom: "6px" }}
          />
        </div>
      ))}
    </>
  );
};



  return (
    <div className="dropdown-container" style={{ opacity: disabled ? 0.6 : 1 }}>
      <Box
        sx={{
          margin: "10px 0 20px 0",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <TextField
          disabled={disabled}
          ref={selectRef}
          label={`${type}`}
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
                boxShadow: "0px 11px 12px 0px var(--scshadocolor)",
                border: "1px solid #ddd",
                width: width,
                position: "absolute",
                zIndex: 2,
                backgroundColor: "var(--cardcolor)",
                color: "var(--terthemecolor)",
              }}
            >
              {/* Search field inside dropdown */}
              <TextField
                inputRef={searchInputRef}
                className="inside-search"
                variant="outlined"
                size="small"
                placeholder="search ... "
                value={searchTerm}
                onChange={handleSearchChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CiSearch
                        style={{ color: "var(--gray)", fontSize: "20px" }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{ marginBottom: "10px" }}
              />

              {/* Render items */}
              <List sx={{ maxHeight: 200, overflowY: "auto" }}>
                {loading ? (
                  <LoadingSkeleton />
                ) : error ? (
                  <MenuItem
                    style={{ margin: "auto", textAlign: "center" }}
                    disabled
                  >
                    An error occurred in loading the data.
                  </MenuItem>
                ) : options.length > 0 ? (
                  options.map((option) => (
                    <ListItem
                      key={option.id}
                      button
                      onClick={() => handleSelect(option)}
                      sx={{
                        borderRadius: "5px",
                        "&:hover": { backgroundColor: "#f0f0f0" },
                      }}
                    >
                      {option.name}
                    </ListItem>
                  ))
                ) : searchTerm ? (
                  <MenuItem
                    style={{ margin: "auto", textAlign: "center",color:"black" }}
                    disabled
                  >
                    No results found for "{searchTerm}"
                  </MenuItem>
                ) : (
                  <MenuItem
                    style={{ margin: "auto", textAlign: "center" }}
                    disabled
                  >
                    "No results found"
                  </MenuItem>
                )}
              </List>
                {/* Pagination */}
              {totalPages > 1 && (
                <nav
                  className="dc-pagination"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    borderTop: "1px solid #eee",
                    paddingTop: "10px",
                  }}
                >
                  <ul
                    style={{width: "100%",}}
                  >
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
                          backgroundColor: "#f0f0f0",
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