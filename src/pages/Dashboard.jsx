import DashboardLayout from "../components/dashboard/dashboardLayout"
import SummaryCards from "../components/dashboard/SummaryCards"
import ActionsPanel from "../components/dashboard/ActionsPanel"
import ExpensePieChart from "../components/dashboard/charts/ExpensePieChart"

function Dashboard() {
  return (
    <DashboardLayout>
      <SummaryCards />
      <ActionsPanel />
      <ExpensePieChart />
    </DashboardLayout>
  )
}

export default Dashboard