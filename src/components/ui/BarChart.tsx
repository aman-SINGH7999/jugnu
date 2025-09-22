"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";


export interface SubjectScore {
  marks: number;
  subjectId: {
    name: string;
    _id: string;
  };
}
interface BarChartComponentProp {
  data: SubjectScore[];
}


export default function BarChartComponent({data=[] }: BarChartComponentProp) {

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="subjectId.name" />
          <YAxis />
          <Tooltip formatter={(value) => Math.round(Number(value))} />
          <Legend />
          <Bar dataKey="marks" fill="#8884d8" radius={[1, 1, 0, 0]} barSize={60} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
