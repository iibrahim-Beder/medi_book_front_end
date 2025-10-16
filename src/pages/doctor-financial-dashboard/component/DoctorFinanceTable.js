import ConditionsFilters from "../../patient-management/patient-information/PatientTabs/component/ConditionsFilters";
import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import "../../patient-management/Patient-management.css";
import { MdExpandMore } from "react-icons/md";
import TextAreaField from "../../ui/form-fields/TextAreaField";

const FinancialReservationsTable = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1); 
  
  // Filters states
  const [filterStatus, setFilterStatus] = useState("");       
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);

  // Mock data representing financial reservations
  const reservationsData = [
    {
      id: "#RES001",
      reservationNumber: "RES-2023-001",
      patientName: "Ahmed Mohamed Ali",
      amount: 1500,
      currency: "USD",
      status: "paid",
      reservationDate: "2023-08-12",
      paymentDate: "2023-08-12",
      paymentMethod: "credit_card",
      notes: "Payment processed successfully using Visa card ending with 4589. No issues encountered during transaction."
    },
    {
      id: "#RES002",
      reservationNumber: "RES-2023-002",
      patientName: "Fatima Ahmed Mahmoud",
      amount: 800,
      currency: "USD",
      status: "pending",
      reservationDate: "2023-08-15",
      paymentDate: null,
      paymentMethod: "cash",
      notes: "Awaiting cash payment upon arrival. Reservation confirmed, payment to be collected at the center."
    },
    {
      id: "#RES003",
      reservationNumber: "RES-2023-003",
      patientName: "Mohamed El Sayed Abdullah",
      amount: 2000,
      currency: "USD",
      status: "paid",
      reservationDate: "2023-08-18",
      paymentDate: "2023-08-17",
      paymentMethod: "bank_transfer",
      notes: "Bank transfer received from Bank of Egypt. Reference number: TRX784512. Amount verified and confirmed."
    },
    {
      id: "#RES004",
      reservationNumber: "RES-2023-004",
      patientName: "Sarah Khaled Ibrahim",
      amount: 1200,
      currency: "USD",
      status: "cancelled",
      reservationDate: "2023-08-20",
      paymentDate: null,
      paymentMethod: "credit_card",
      notes: "Reservation cancelled per patient request. No amount charged as cancellation was made more than 24 hours before appointment."
    },
    {
      id: "#RES005",
      reservationNumber: "RES-2023-005",
      patientName: "Yasser Rami Nasser",
      amount: 1800,
      currency: "USD",
      status: "paid",
      reservationDate: "2023-08-22",
      paymentDate: "2023-08-21",
      paymentMethod: "mobile_wallet",
      notes: "Payment processed via mobile wallet (Vodafone Cash). Transaction ID: VF123456789. Successful transaction."
    },
    {
      id: "#RES006",
      reservationNumber: "RES-2023-006",
      patientName: "Hoda Emad Farouk",
      amount: 950,
      currency: "USD",
      status: "refunded",
      reservationDate: "2023-08-25",
      paymentDate: "2023-08-24",
      paymentMethod: "credit_card",
      notes: "Full amount refunded due to doctor cancellation. Refund process will take 5-7 business days to complete."
    },
    {
      id: "#RES007",
      reservationNumber: "RES-2023-007",
      patientName: "Ali Hossam El Din",
      amount: 1600,
      currency: "USD",
      status: "paid",
      reservationDate: "2023-08-28",
      paymentDate: "2023-08-27",
      paymentMethod: "cash",
      notes: "Cash payment received upon arrival. Paper receipt issued with number 458712."
    },
    {
      id: "#RES008",
      reservationNumber: "RES-2023-008",
      patientName: "Mariam Wael Saad",
      amount: 1350,
      currency: "USD",
      status: "pending",
      reservationDate: "2023-08-30",
      paymentDate: null,
      paymentMethod: "bank_transfer",
      notes: "Awaiting bank transfer. Account details sent to patient via email. Payment confirmation pending."
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
      if (searchBy === "all") {
        return Object.values(reservation)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else {
        return reservation[searchBy]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      }
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

  // Get status color and text
  const getStatusInfo = (status) => {
    switch (status) {
      case 'paid':
        return { color: '#4BAE78', text: 'Paid' };
      case 'pending':
        return { color: '#FFA500', text: 'Pending' };
      case 'cancelled':
        return { color: '#D66A6A', text: 'Cancelled' };
      case 'refunded':
        return { color: '#6C757D', text: 'Refunded' };
      default:
        return { color: '#6C757D', text: 'Unknown' };
    }
  };

  // Get payment method text
  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'credit_card':
        return 'Credit Card';
      case 'cash':
        return 'Cash';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'mobile_wallet':
        return 'Mobile Wallet';
      default:
        return method;
    }
  };

  // Utility: truncate long text
  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div>
          <h3 className="table-title">Financial Reservations List</h3>
          <h6 className="table-subtitle">Financial Management</h6>
        </div>
      </div>

      <div className="p-3">
        <div className="table-card">
          {/* Filters Section */}
          <div className="mb-3 p-3">
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
          </div>

          {/* Data Table */}
          <div style={{ overflow: "auto" }}>
            <Table className="data-table align-middle mb-0 table-hover">
              <thead>
                <tr>
                  <th>Reservation Number</th>
                  <th>Patient Name</th>
                  <th>Amount</th>
                  <th>Payment Status</th>
                  <th>Reservation Date</th>
                  <th>Payment Date</th>
                  <th>Payment Method</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((reservation) => {
                  const statusInfo = getStatusInfo(reservation.status);
                  return (
                    <React.Fragment key={reservation.id}>
                      <tr>
                        <td title={reservation.reservationNumber}>
                          {reservation.reservationNumber}
                        </td>
                        <td title={reservation.patientName}>
                          {reservation.patientName}
                        </td>
                        <td>
                          <span style={{ fontWeight: '600', fontSize: '14px' }}>
                            {formatCurrency(reservation.amount, reservation.currency)}
                          </span>
                        </td>
                        <td>
                          <span 
                            style={{ 
                              color: statusInfo.color,
                              fontWeight: '600',
                              fontSize: '14px'
                            }}
                          >
                            {statusInfo.text}
                          </span>
                        </td>
                        <td>{formatDate(reservation.reservationDate)}</td>
                        <td>{formatDate(reservation.paymentDate)}</td>
                        <td>
                          <span style={{ fontSize: '14px' }}>
                            {getPaymentMethodText(reservation.paymentMethod)}
                          </span>
                        </td>
                        <td title={reservation.notes}>
                          <div className="d-flex align-items-center">
                            <span
                              className="text-truncate"
                              style={{ maxWidth: "250px" }}
                            >
                              {truncateText(reservation.notes, 80)}
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
                        </td>
                      </tr>

                      {/* Expanded row for Notes */}
                      {expandedRow === reservation.id && (
                        <tr className="table-active-content" style={{backgroundColor:"transparent"}}>
                          <td
                            colSpan="8"
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
                      )}
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
  );
};

export default FinancialReservationsTable;