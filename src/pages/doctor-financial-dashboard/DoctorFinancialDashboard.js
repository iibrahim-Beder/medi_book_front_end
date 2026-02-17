import FinancialReservationsTable from "./component/FinancialReservationsTable";
import EarningsChartBlock from "./component/EarningsChartBlock";
import EarningsSummaryCard from "./component/EarningsSummaryCard";
import Notes from "./component/Notes";
import OneSummary from "./component/OneSummary";
import PaymentsStripeCard from "./component/PaymentsStripeCard";

export default function DoctorFinancialDashboard() {
  return (
  <div>
    <div className="row payment-page dashboard-page ">
      <div className="col-md-12 col-lg-6 mb-2">
      <PaymentsStripeCard />
      <EarningsSummaryCard /> 
      </div>
      <div className="col-md-12 col-lg-6">
      <EarningsChartBlock /> 
      <OneSummary /> 
      </div>
      <div className="col-md-12 col-lg-6">
      <FinancialReservationsTable />
      </div>
      <div className="col-md-12 col-lg-6">
        <Notes />
      </div>
    </div>


  </div>
  )
}