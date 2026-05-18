import { useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import SummaryCards from "../components/dashboard/SummaryCards";
import ActionsPanel from "../components/dashboard/ActionsPanel";
import ExpensePieChart from "../components/dashboard/charts/ExpensePieChart";

function Dashboard() {

  const [dineroTotal, setDineroTotal] = useState(0);
  const [gastos, setGastos] = useState(0);
  const [inversiones, setInversiones] = useState(0);

  const handleDatosActualizados = ({ totalIngresos, totalGastos, totalInversiones }) => {
    setDineroTotal(totalIngresos - totalGastos - totalInversiones);
    setGastos(totalGastos);
    setInversiones(totalInversiones);
  };

  return (
    <DashboardLayout>
      <SummaryCards
        dineroTotal={dineroTotal}
        gastos={gastos}
        inversiones={inversiones}
      />
      <ActionsPanel
        onDatosActualizados={handleDatosActualizados}
      />
      <ExpensePieChart
        dineroTotal={dineroTotal}
        gastos={gastos}
        inversiones={inversiones}
      />
    </DashboardLayout>
  );
}

export default Dashboard;