import React, { useState } from "react";
import "./dropdown.css"
import {
  Box,
  Menu,
  MenuItem,
  TextField,
  List,
  ListItem,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const DropdownWithSearch = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [page, setPage] = useState(0);

  const open = Boolean(anchorEl);

  const options = [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
    "Option 5",
    "Option 6",
    "Option 7",
    "Option 8",
    "Option 9",
    "Option 10",
    "Option 2",
    "Option 3",
    "Option 4",
    "Option 5",
    "Option 6",
    "Option 7",
    "Option 8",
    "Option 9",
    "Option 10",
    "Option 2",
    "Option 3",
    "Option 4",
    "Option 5",
    "Option 6",
    "Option 7",
    "Option 8",
    "Option 9",
    "Option 10",
    "Option 2",
    "Option 3",
    "Option 4",
    "Option 5",
    "Option 6",
    "Option 7",
    "Option 8",
    "Option 9",
    "Option 10",
    "Option 2",
    "Option 3",
    "Option 4",
    "Option 5",
    "Option 6",
    "Option 7",
    "Option 8",
    "Option 9",
    "Option 10",
  ];

  const itemsPerPage = 6;
  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredOptions.length / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const currentItems = filteredOptions.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
    setSearchTerm("");
    setPage(0);
  };
  const handleSelect = (option) => {
    setSelectedOption(option);
    handleClose();
  };

  const handleNextPage = (event) => {
    event.stopPropagation();
    if (page < totalPages - 1) setPage(page + 1);
  };

  const handlePrevPage = (event) => {
    event.stopPropagation();
    if (page > 0) setPage(page - 1);
  };

  return (
    <div className="dropdown-container" >
    <Box sx={{ width: "100%", margin:"10px 0 20px 0 ", fontFamily: "Inter, sans-serif "  }}>
      <TextField
        label="Dropdown"
        value={selectedOption || "Select options"}
        onClick={handleClick}
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
                  borderRadius: "28px"
                }}
              />
            </InputAdornment>
          ),
        }}
      />

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: 315,
            borderRadius: "12px",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0px 11px 12px 0px #dbdbdb45",
          },
        }}
      >
        <TextField  className="inside-search"
       
         variant="outlined"
          size="small"
          placeholder="Search input"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="#000"  style={{color:"#000"}}/>
              </InputAdornment>
            ),
          }}
          sx={{ marginBottom: "10px" }}
        />

        <List
          sx={{
            maxHeight: 150,
            overflowY: "auto",
          }}
        >
          {currentItems.length > 0 ? (
            currentItems.map((opt, idx) => (
              <ListItem
                key={idx}
                button
                onClick={() => handleSelect(opt)}
                sx={{
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                {opt}
              </ListItem>
            ))
          ) : (
            <MenuItem disabled>No results</MenuItem>
          )}
        </List>

        {totalPages > 1 && (
          <nav className="dc-pagination" onClick={(e) => e.stopPropagation()} style={{borderTop: "1px solid #eee",paddingTop: "10px",}}>
            <ul>
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

              {(() => {
  const items = [];

  

  items.push(
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
  );

  if (page > 0 && page < totalPages - 1) {
    items.push(
      <li key="dots">
        <a>...</a>
      </li>
    );

    items.push(
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
    );
  } else {
    if (totalPages > 2) {
      items.push(
        <li key="dots">
          <a>...</a>
        </li>
      );
    }
  }

  if (totalPages > 1) {
    items.push(
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
    );
  }

  return items;
})()}


              <li
                className="dc-nextpage"
                onClick={handleNextPage}
                style={{
                  cursor: page >= totalPages - 1 ? "not-allowed" : "pointer",
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
      </Menu>
    </Box>
    </div>
  );
};

export default DropdownWithSearch;