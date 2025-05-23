"use client"

import type React from "react"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

export const Chart = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export const ChartContainer = ({
  data,
  xField,
  yField,
  children,
}: {
  data: any[]
  xField: string
  yField: string
  children: React.ReactNode
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>{children}</BarChart>
    </ResponsiveContainer>
  )
}

export const ChartBar = ({ className }: { className?: string }) => {
  return <Bar dataKey="minutes" fill="#8884d8" className={className} />
}

export const ChartGrid = () => {
  return <CartesianGrid strokeDasharray="3 3" />
}

export const ChartTooltip = ({ children }: { children?: React.ReactNode }) => {
  return <Tooltip content={children} />
}

export const ChartTooltipContent = ({ payload, label }: { payload: any[]; label: string }) => {
  if (!payload || payload.length === 0) {
    return null
  }

  return (
    <div className="p-2 bg-white border rounded shadow-md">
      <p className="font-bold">{label}</p>
      {payload.map((item, index) => (
        <p key={index} className="text-gray-700">
          {item.name}: {item.value}
        </p>
      ))}
    </div>
  )
}

export const ChartXAxis = () => {
  return <XAxis dataKey="day" />
}

export const ChartYAxis = () => {
  return <YAxis />
}

export const ChartPie = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={[
            { name: "Group A", value: 400 },
            { name: "Group B", value: 300 },
            { name: "Group C", value: 300 },
            { name: "Group D", value: 200 },
          ]}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          <Cell fill="#0088FE" />
          <Cell fill="#00C49F" />
          <Cell fill="#FFBB28" />
          <Cell fill="#FF8042" />
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

export const ChartLegend = () => {
  return <Legend />
}
