"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", value: 40 },
  { name: "Feb", value: 55 },
  { name: "Mar", value: 30 },
  { name: "Apr", value: 70 },
  { name: "May", value: 60 },
];

interface Attempt {
  createdAt: string;
  examId: {
    categoryId: {
      _id: string;
      name: string;
    };
  };
  _id: string;
  totalScore: number;
}
interface LineChartComponentProp {
  data?: Attempt[];
  width?: string | number;
  height?: string | number;
}


export default function LineChartComponent({ data = [] }: LineChartComponentProp) {

  const chartData = [
  { name: "Start", value: 0, exam: "" },
  ...(data || []).map((t) => {
    const dateObj = new Date(t.createdAt);
    const formattedDate =
      (data?.length || 0) <= 12
        ? `${dateObj.getDate()} ${dateObj.toLocaleString("default", { month: "short" })}`
        : dateObj.toLocaleString("default", { month: "short" });

    return {
      name: formattedDate,
      value: t.totalScore,
      exam: t.examId.categoryId.name,
    };
  }),
];

console.log("chartData: ", chartData)

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value: any, _: any, props: any) => [`Score: ${value}`, `Exam: ${props.payload.exam}`]} />
          <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}