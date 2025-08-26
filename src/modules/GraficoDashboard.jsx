import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

const dataTipos = [
  { name: "Ad Valorem", value: 1 },
  { name: "Específico", value: 1 },
  { name: "Mixto", value: 1 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

export function GraficoTipos() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={dataTipos}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={60}
          label
        >
          {dataTipos.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

const dataRango = [
  { name: "Máximo legal", value: 40 },
];

export function GraficoRango() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={dataRango}>
        <XAxis dataKey="name" />
        <YAxis domain={[0, 40]} />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

