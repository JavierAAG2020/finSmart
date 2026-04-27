import { useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import SummaryCards from "../components/dashboard/SummaryCards";
import ActionsPanel from "../components/dashboard/ActionsPanel";
import ExpensePieChart from "../components/dashboard/charts/ExpensePieChart";

function Dashboard() {

  const [dineroTotal, setDineroTotal] = useState(0);
  const [gastos, setGastos] = useState(0);
  const [inversiones, setInversiones] = useState(0);

  // FUNCIONES
  const agregarIngreso = (monto) => {
    monto = Number(monto);
    setDineroTotal(prev => prev + monto);
  };

  const registrarGasto = (monto) => {
    monto = Number(monto);
    setGastos(prev => prev + monto);
    setDineroTotal(prev => prev - monto);
  };

  const invertir = (monto) => {
    monto = Number(monto);
    setInversiones(prev => prev + monto);
    setDineroTotal(prev => prev - monto);
  };

  return (
    <DashboardLayout>
      <SummaryCards 
        dineroTotal={dineroTotal}
        gastos={gastos}
        inversiones={inversiones}
      />

      <ActionsPanel 
        agregarIngreso={agregarIngreso}
        registrarGasto={registrarGasto}
        invertir={invertir}
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