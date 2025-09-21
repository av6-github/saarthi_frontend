"use client";

import { FC } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Image from "next/image";

import dashboardIcon from "@/assets/dashboard-icon.svg";

interface PieData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface RadialData {
  name: string;
  value: number;
  fill?: string;
}

interface BarData {
  name: string;
  activity: number;
}

const pieData: PieData[] = [
  { name: "Completed", value: 75 },
  { name: "Remaining", value: 25 },
];

const semiPieData: RadialData[] = [{ name: "Tasks", value: 60, fill: "#34D399" }];

const barData: BarData[] = [
  { name: "Mon", activity: 8 },
  { name: "Tue", activity: 14 },
  { name: "Wed", activity: 7 },
  { name: "Thu", activity: 10 },
  { name: "Fri", activity: 5 },
];

const COLORS = ["#3B82F6", "#E5E7EB"];

const Dashboard: FC = () => {
  return (
    <div
      className="flex flex-col max-w-[75rem] mx-auto bg-white/60 backdrop-blur-xl border border-white/20 px-5 py-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.12)] transition duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold text-gray-800 tracking-wide flex gap-1 justify-center items-center">
          <Image src={dashboardIcon} alt="Dashboard icon" className="h-7 w-7" />
          <h2>My Dashboard</h2>
        </div>
        <button
          className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full text-white font-medium shadow-md hover:scale-105 transition"
        >
          + Add Widget
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
          <p className="text-gray-600 text-sm mb-2">Progress</p>
          <ResponsiveContainer width={100} height={100}>
            <PieChart>
              <Pie
                data={pieData as PieData[]}
                dataKey="value"
                innerRadius={30}
                outerRadius={50}
                startAngle={90}
                endAngle={-270}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
          <p className="text-gray-600 text-sm mb-2">Tasks Completed</p>
          <ResponsiveContainer width={120} height={100}>
            <RadialBarChart
              cx="50%"
              cy="100%"
              innerRadius="70%"
              outerRadius="100%"
              barSize={15}
              data={semiPieData as RadialData[]}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={10}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-gray-600 text-sm mb-2">Weekly Activity</p>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={barData as BarData[]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="activity" fill="#3B82F6" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
