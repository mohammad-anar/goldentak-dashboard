"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Globe, Users } from "lucide-react";
import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

const metrics = [
  {
    label: "Total Languages",
    value: "3",
    icon: Globe,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-100/50",
  },
  {
    label: "Total Users",
    value: "12,450",
    icon: Users,
    iconColor: "text-green-500",
    iconBg: "bg-green-100/50",
  },
];

const chartData = [
  { name: "Turkish", value: 54, color: "#ef4444" },
  { name: "English", value: 31, color: "#3b82f6" },
  { name: "Arabic", value: 14, color: "#10b981" },
];

const languageStats = [
  {
    name: "Turkish",
    percentage: 54.5,
    users: "6,780",
    flag: "🇹🇷",
    color: "bg-blue-600",
  },
  {
    name: "English",
    percentage: 31.5,
    users: "3,920",
    flag: "🇬🇧",
    color: "bg-blue-600",
  },
  {
    name: "Arabic",
    percentage: 14,
    users: "1,750",
    flag: "🇸🇦",
    color: "bg-blue-600",
  },
];

export default function LanguageManagementPage() {
  return (
    <div className="flex flex-col gap-8 py-8 md:py-10 px-4 lg:px-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900">Language Management</h1>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:w-2/3">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-none shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${metric.iconBg}`}>
                  <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Language Distribution Card */}
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Language Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="45%"
                    innerRadius={0}
                    outerRadius={110}
                    paddingAngle={0}
                    dataKey="value"
                    startAngle={90}
                    endAngle={450}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="rect"
                    formatter={(value) => <span className="text-[14px] font-medium text-gray-600">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Labels */}
              <div className="absolute top-[0%] left-[50%] -translate-x-1/2 text-[12px] font-medium text-red-500">
                Turkish 54%
              </div>
              <div className="absolute bottom-[25%] left-[30%] text-[12px] font-medium text-blue-500">
                English 31%
              </div>
              <div className="absolute top-[50%] right-[25%] text-[12px] font-medium text-green-500">
                Arabic 14%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Statistics Card */}
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Language Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {languageStats.map((stat) => (
              <div key={stat.name} className="p-5 rounded-2xl border border-gray-100 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{stat.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">{stat.name}</span>
                      <span className="text-[13px] text-gray-400">{stat.users} users</span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{stat.percentage}%</span>
                </div>
                <div className="space-y-2">
                  <Progress
                    value={stat.percentage}
                    className="h-2 bg-gray-100 [&>[data-slot=progress-indicator]]:bg-blue-600"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
