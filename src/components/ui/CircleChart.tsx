"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Maths", value: 40 },
  { name: "Physics", value: 25 },
  { name: "Chemistry", value: 20 },
  { name: "Biology", value: 15 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

export default function CircleChartComponent() {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%" // chart center X
            cy="50%" // chart center Y
            innerRadius={60} // donut effect (0 kar doge to normal pie banega)
            outerRadius={100}
            paddingAngle={5} // slices ke beech gap
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
