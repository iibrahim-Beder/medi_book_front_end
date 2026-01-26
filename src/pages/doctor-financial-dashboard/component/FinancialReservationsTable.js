import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import { MdExpandMore } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { XCircle } from "lucide-react";

const FinancialReservationsTable = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");       
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); 
  
  // Mock data with new structure (Date, Patient, Appointment, Amount, Status)
  const reservationsData = [
    {
      id: 1,
      date: "12 Sep",
      patient: "John Doe",
      appointment: "In-Person",
      amount: 80,
      currency: "USD",
      status: "paid",
      notes: "Patient arrived on time for the appointment."
    },
    {
      id: 2,
      date: "12 Sep",
      patient: "Jane Smith",
      appointment: "Remote",
      amount: 60,
      currency: "USD",
      status: "paid",
      notes: "Remote session completed successfully via Zoom."
    },
    {
      id: 3,
      date: "11 Sep",
      patient: "Alex Brown",
      appointment: "Remote",
      amount: 50,
      currency: "USD",
      status: "refunded",
      notes: "Refund processed due to cancellation within 24 hours."
    },
    {
      id: 4,
      date: "10 Sep",
      patient: "Emily Johnson",
      appointment: "In-Person",
      amount: 100,
      currency: "USD",
      status: "paid",
      notes: "Follow-up appointment for ongoing treatment."
    },
    {
      id: 5,
      date: "10 Sep",
      patient: "Michael Williams",
      appointment: "Remote",
      amount: 75,
      currency: "USD",
      status: "pending",
      notes: "Waiting for insurance verification."
    },
    {
      id: 6,
      date: "9 Sep",
      patient: "Sarah Davis",
      appointment: "In-Person",
      amount: 120,
      currency: "USD",
      status: "paid",
      notes: "Initial consultation and examination."
    },
    {
      id: 7,
      date: "9 Sep",
      patient: "David Miller",
      appointment: "Remote",
      amount: 90,
      currency: "USD",
      status: "cancelled",
      notes: "Patient cancelled due to scheduling conflict."
    },
    {
      id: 8,
      date: "8 Sep",
      patient: "Laura Wilson",
      appointment: "In-Person",
      amount: 110,
      currency: "USD",
      status: "paid",
      notes: "Routine check-up completed."
    },
    {
      id: 9,
      date: "8 Sep",
      patient: "Robert Taylor",
      appointment: "Remote",
      amount: 85,
      currency: "USD",
      status: "refunded",
      notes: "Technical issues during remote session."
    },
    {
      id: 10,
      date: "7 Sep",
      patient: "Jennifer Brown",
      appointment: "In-Person",
      amount: 95,
      currency: "USD",
      status: "paid",
      notes: "Specialist consultation completed."
    }
  ];

  // Handle expand/collapse for notes
  const handleNotesClick = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  // Apply search & filters
  const filteredReservations = reservationsData
    .filter((reservation) => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        reservation.patient.toLowerCase().includes(searchLower) ||
        reservation.appointment.toLowerCase().includes(searchLower) ||
        reservation.date.toLowerCase().includes(searchLower)
      );
    })
    .filter((reservation) => {
      if (filterStatus && reservation.status !== filterStatus) return false;
      return true;
    });

  const resetFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setCurrentPage(1);
  };

  const rowsPerPage = 5; 
  const totalPages = Math.ceil(filteredReservations.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredReservations.slice(startIndex, startIndex + rowsPerPage);

  // Get status display information
const getStatusInfo = (status) => {
  switch (status) {
    case 'paid':
      return {
        color: '#4BAE78',
        text: 'Paid',
        icon: <CheckCircleIcon size={20}    style={{
          color: "#4BAE78"
        }}/>
      };

    case 'refunded':
      return {
        color: '#D66A6A',
        text: 'Refunded',
        icon: <CancelIcon size={20} style={{
          color: "#D66A6A"
        }} />
      };

    case 'pending':
      return {
        color: '#FFA500',
        text: 'Pending',
        icon: <AccessTimeIcon size={20}   style={{
          color: "#FFA500"
        }}/>
      };

    case 'cancelled':
      return {
        color: '#6C757D',
        text: 'Cancelled',
        icon: <XCircle size={20}
         style={{
          color: "#6C757D"
        }}
         />
          
      };

    default:
      return {
        color: '#6C757D',
        text: 'Unknown',
        icon: null
      };
  }
};


  // Format currency
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Utility: truncate long text
  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div>

      <div className=""> 
    <div className="table-container mb-3">
        <div className="table-card"
         style={{
          borderRadius: "22px",
          border: "2px solid #eee",
          backgroundColor: "transparent",
          boxShadow: "none"
          }}>
      <div className="table-header">
        <div>
          <h3 className="table-title"><GrTransaction style={{margin:"7px"}} /> TRANSACTIONS (REAL DATA ONLY)</h3>
          {/* <h6 className="table-subtitle">Financial Management</h6> */}
        </div>
      </div>
          {/* Filters Section */}
          {/* <div className="mb-3 p-3">
            <ConditionsFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterType={filterStatus}
              setFilterType={setFilterStatus}
              filterDateFrom={filterDateFrom}
              setFilterDateFrom={setFilterDateFrom}
              filterDateTo={filterDateTo}
              setFilterDateTo={setFilterDateTo}
              onReset={resetFilters}
              onSearch={() => setCurrentPage(1)}
              conditions={reservationsData}
            />
          </div> */}

          {/* Data Table */}
          <div style={{ overflow: "auto" }}>
            <Table className="data-table align-middle mb-0 table-hover">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Patient</th>
                  <th>Appointment</th>
                  <th>Amount</th>
                  <th>Status</th>
                  {/* <th>Notes</th> */}
                </tr>
              </thead>
              <tbody style={{backgroundColor:"white"}}>
                {currentData.map((reservation) => {
                  const statusInfo = getStatusInfo(reservation.status);
                  return (
                    <React.Fragment key={reservation.id}>
                      <tr>
                        <td style={{ fontWeight: '500' }}>
                          {reservation.date}
                        </td>
                        <td style={{ fontWeight: '500' }}>
                          {reservation.patient}
                        </td>
                        <td>
                          <span className="" style={{ 
                            // backgroundColor: reservation.appointment === 'In-Person' ? '#E8F4FD' : '#F0F7F0',
                            // color: reservation.appointment === 'In-Person' ? '#278FFF' : '#4BAE78',
                            // padding: '4px 12px',
                            // borderRadius: '12px',
                            fontWeight: '500'
                          }}>
                            {reservation.appointment}
                          </span>
                        </td>
                        <td style={{ fontWeight: '600', fontSize: '14px' }}>
                          {formatCurrency(reservation.amount, reservation.currency)}
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {statusInfo.icon}
                            <span style={{ 
                              // color: statusInfo.color,
                              fontWeight: '600',
                              fontSize: '14px'
                            }}>
                              {statusInfo.text}
                            </span>
                          </div>
                        </td>
                          {/* <td title={reservation.notes}>
                            <div className="d-flex align-items-center">
                              <span
                                className="text-truncate"
                                style={{ maxWidth: "200px" }}
                              >
                                {truncateText(reservation.notes, 60)}
                              </span>
                              <Button
                                className="view-btn ms-2"
                                size="sm"
                                style={{
                                  backgroundColor: "transparent",
                                  color: "#278fff",
                                  padding: 0,
                                  fontSize: "19px",
                                  height: "20px",
                                }}
                                onClick={() => handleNotesClick(reservation.id)}
                              >
                                <MdExpandMore
                                  style={{
                                    transform:
                                      expandedRow === reservation.id
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                    transition: "transform 0.3s ease",
                                  }}
                                />
                              </Button>
                            </div>
                          </td> */}
                      </tr>

                      {/* Expanded row for Notes
                      {expandedRow === reservation.id && (
                        <tr className="table-active-content" style={{backgroundColor:"transparent"}}>
                          <td
                            colSpan="6"
                            className="border-0 background-in-hover-none"
                          >
                            <div className="description-expanded-section">
                              <TextAreaField
                                label="Notes"
                                value={reservation.notes}
                                disabled={true}
                              />
                            </div>
                          </td>
                        </tr>
                      )} */}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3 nav-table">
            <div
              className="dt-layout-cell dt-layout-start"
              style={{ fontSize: "14px", color: "#555" }}
            >
              <div className="dt-info">
                Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredReservations.length)} of {filteredReservations.length} entries
              </div>
            </div>

            <div className="dt-layout-cell dt-layout-end">
              <div className="dt-paging">
                <nav aria-label="pagination" className="d-flex">
                  <button className="dt-paging-button first" type="button" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>«</button>
                  <button className="dt-paging-button previous" type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>Previous</button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`dt-paging-button none ${currentPage === index + 1 ? "current" : ""}`}
                      type="button"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button className="dt-paging-button next" type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>Next</button>
                  <button className="dt-paging-button last" type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>»</button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default FinancialReservationsTable;