import React from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { BiSearch, BiDownload, BiReset,  } from "react-icons/bi";

const PatientsFilters = ({
  search,
  setSearch,
  status,
  setStatus,
  gender,
  setGender,
  onExportCsv,
  onReset,
}) => {
  return (
    <div className="PatientsFilters card shadow-sm mb-3 rounded-3 pl-4">
      <div className="card-body">
        <div className="row g-2 align-items-center">
          {/* Search Input */}
          <div className="col-12 col-lg-4 p-0 ">
            <InputGroup>
              <InputGroup.Text>
                <BiSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by name, phone, or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
          </div>

          {/* Status Filter */}
          <div className="col-6 col-lg-2 p-0">
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Form.Select>
          </div>

          {/* Gender Filter */}
          <div className="col-6 col-lg-2 p-0">
            <Form.Select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Select>
          </div>

          {/* Action Buttons */}
          <div className="col-12 col-lg-4 text-lg-start text-center">
            <div className="btn-group mt-2">
              <Button
              className="PatientsFiltersBtn"
                variant="outline-secondary"
                onClick={onReset}
                style={{boxShadow:"none"}}
              >
                <BiReset /> Reset
              </Button>
              <Button className="PatientsFiltersBtn"
                variant="outline-secondary"
                onClick={onExportCsv}
                style={{boxShadow:"none"}}
              >
                <BiDownload /> Export CSV
              </Button>
              {/* <Button
                variant="outline-secondary"
                data-bs-toggle="offcanvas"
                data-bs-target="#offFilters"
              >
               Advanced Filters
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientsFilters;
