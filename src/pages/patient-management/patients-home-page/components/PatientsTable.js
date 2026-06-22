import React from "react";
import { Table, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { MdOutlineArrowForward } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDoctorPatients } from "../hook/useDoctorPatients";
import ErrorLoading from "../../../shared/ErrorLoading";
import Pagination from "../../../shared/Pagination";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ConditionsFilters from "../../patient-information/PatientTabs/component/ConditionsFilters";
import { convertSrcPatientImg, formatDate } from "../../../shared/utils";

const PatientsTable = () => {
  const { t } = useTranslation();

  const {
    currentFilters,
    setCurrentFilters,
    currentPage,
    setCurrentPage,
    pageSize,
    patientsData,
    isLoading,
    isFetching,
    error,
    refetch,
    handleSearch,
    handleResetFilters,
  } = useDoctorPatients();

  return (
    <div>
      <div className="" style={{ border: "none", borderRadius: "12px" }}>
        <div className="table-card">
          <ConditionsFilters
            searchTerm={currentFilters.searchText}
            setSearchTerm={(value) =>
              setCurrentFilters((prev) => ({
                ...prev,
                searchText: value,
              }))
            }
            filterDateFrom={currentFilters.fromDate}
            setFilterDateFrom={(date) => setCurrentFilters(prev => ({ ...prev, fromDate: date }))}
            filterDateTo={currentFilters.toDate}
            setFilterDateTo={(date) => setCurrentFilters(prev => ({ ...prev, toDate: date }))}
            onReset={handleResetFilters}
            onSearch={handleSearch}
            showFilterDropdown={false}
          />

          {/* Scrollable Table Wrapper */}
          <div style={{ overflowX: "auto" }}>
            <Table
              className="align-middle mb-0 table-hover"
              style={{ whiteSpace: "nowrap" }}
            >
              <thead className="table-light">
                <tr>
                  {/* <th className="border-0">{t("patientId")}</th> */}
                  <th className="border-0">{t("name")}</th>
                  <th className="border-0">{t("age")}</th>
                  <th className="border-0">{t("address")}</th>
                  <th className="border-0">{t("phone")}</th>
                  <th className="border-0">{t("Completed visits")}</th>
                  <th className="border-0">{t("lastVisit")}</th>
                  <th className="border-0">{t("paid")}</th>
                  <th className="border-0">{t("action")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching  ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center  ">
                        <Skeleton circle style={{borderRadius: "50%", marginRight:"10px"}}  width={35} height={35} />
                        <Skeleton width={180} height={15} />
                        </div>
                      </td>
                      <td>
                        <Skeleton width={50} height={15} />
                      </td>
                      <td>
                        <Skeleton width={120} height={15} />
                      </td>
                      <td>
                        <Skeleton width={120} height={15} />
                      </td>
                      <td>
                        <Skeleton width={120} height={15} />
                      </td>
                      <td>
                        <Skeleton width={80} height={15} />
                      </td>
                      <td>
                        <Skeleton width={120} height={15} />
                      </td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="text-center text-danger">
                      <ErrorLoading isError={error} refetch={refetch} />
                    </td>
                  </tr>
                ) : patientsData?.data?.length > 0 ? (
                  patientsData.data.map((patient) => (
                    <tr key={patient.patientId}>
                      <td className="border-0">
                        <div className="d-flex align-items-center justify-content-start cont-img-name">
                          <img
                            src={convertSrcPatientImg(patient.patientImageUrl)}
                            alt={patient.patientName}
                            className="rounded-circle me-2"
                            style={{ width: "40px", height: "40px" }}
                          />
                          <span>{patient.patientName}</span>
                        </div>
                      </td>

                      <td>{patient.age || "-"}</td>

                      <td>-</td>

                      <td>{patient.phoneNumber || "-"}</td>

                      <td>
                        {patient.completedVisitsCount
                          ? patient.completedVisitsCount
                          : "-"}
                      </td>
                      <td>
                        {patient.lastVisitDate
                          ? formatDate(patient.lastVisitDate)
                          : "-"}
                      </td>

                      <td className="fw-bold text-success">
                        ${patient.totalPaid || 0}
                      </td>

                      <td>
                        <Link to={`/pationt-information/${patient.patientId}`}>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="d-flex align-items-center view-btn ms-2"
                          >
                            {t("View profile")}
                            <MdOutlineArrowForward className="ms-1 arrow-icon-view-table" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      {t("No Data Found")}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination controls */}
          <Pagination
            currentPage={currentPage}
            totalItems={patientsData?.totalCount || 0}
            rowsPerPage={pageSize}
            onPageChange={setCurrentPage}
            totalPages={patientsData?.totalPages || 1}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientsTable;
