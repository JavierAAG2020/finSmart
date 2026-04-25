import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card } from "react-bootstrap"

const data = [
  { name: "Ahorro", value: 1200 },
  { name: "Gastos", value: 800 },
  { name: "Inversiones", value: 500 },
]

const COLORS = ["#0d6efd", "#dc3545", "#198754"]

function ExpensePieChart() {
  return (
    <Card className="shadow-sm mt-4">
      <Card.Body>
        <h5>Distribución financiera</h5>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card.Body>
    </Card>
  )
}

export default ExpensePieChart