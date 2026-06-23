"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Globe, Users, Loader2 } from "lucide-react";
import { useGetLanguageStatsQuery } from "@/redux/features/language/languageApi";
import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

export default function LanguageManagementPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: response, isLoading } = useGetLanguageStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-500 font-medium">Loading language statistics...</span>
      </div>
    );
  }

  const languageData = response?.data || {
    totalLanguages: 3,
    totalUsers: 0,
    distribution: [],
  };

  const metrics = [
    {
      label: "Total Languages",
      value: String(languageData.totalLanguages ?? 3),
      icon: Globe,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-100/50",
    },
    {
      label: "Total Users",
      value: (languageData.totalUsers ?? 0).toLocaleString(),
      icon: Users,
      iconColor: "text-green-500",
      iconBg: "bg-green-100/50",
    },
  ];

  const languageConfig: Record<string, { name: string; flag: string; color: string; indicatorColor: string; textClass: string }> = {
    tr: { name: "Turkish", flag: "🇹🇷", color: "#ef4444", indicatorColor: "[&>[data-slot=progress-indicator]]:bg-red-500", textClass: "text-red-500" },
    en: { name: "English", flag: "🇬🇧", color: "#3b82f6", indicatorColor: "[&>[data-slot=progress-indicator]]:bg-blue-600", textClass: "text-blue-500" },
    ar: { name: "Arabic", flag: "🇸🇦", color: "#10b981", indicatorColor: "[&>[data-slot=progress-indicator]]:bg-green-500", textClass: "text-green-500" },
  };

  const distribution = languageData.distribution || [];

  const chartData = distribution.map((item: any) => {
    const config = languageConfig[item.code] || { name: item.language, flag: "🌐", color: "#6b7280", indicatorColor: "[&>[data-slot=progress-indicator]]:bg-gray-500", textClass: "text-gray-500" };
    return {
      name: config.name,
      value: item.count,
      percentage: item.percentage,
      color: config.color,
    };
  });

  const languageStats = distribution.map((item: any) => {
    const config = languageConfig[item.code] || { name: item.language, flag: "🌐", color: "#6b7280", indicatorColor: "[&>[data-slot=progress-indicator]]:bg-gray-500", textClass: "text-gray-500" };
    return {
      name: config.name,
      percentage: item.percentage,
      users: item.count.toLocaleString(),
      flag: config.flag,
      indicatorColor: config.indicatorColor,
    };
  });

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
              {chartData.length > 0 ? (
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
                      {chartData.map((entry: any, index: number) => (
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
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No distribution data available
                </div>
              )}

              {/* Dynamic Absolute Labels */}
              {chartData.map((data: any) => {
                let positionClasses = "";
                let colorClass = "";
                if (data.name === "Turkish") {
                  positionClasses = "absolute top-[0%] left-[50%] -translate-x-1/2";
                  colorClass = "text-red-500";
                } else if (data.name === "English") {
                  positionClasses = "absolute bottom-[25%] left-[30%]";
                  colorClass = "text-blue-500";
                } else if (data.name === "Arabic") {
                  positionClasses = "absolute top-[50%] right-[25%]";
                  colorClass = "text-green-500";
                } else {
                  return null;
                }
                return (
                  <div key={data.name} className={`${positionClasses} text-[12px] font-medium ${colorClass}`}>
                    {data.name} {data.percentage}%
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Language Statistics Card */}
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Language Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {languageStats.map((stat: { name: string; percentage: number; users: string; flag: string; indicatorColor: string }) => (
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
                    className={`h-2 bg-gray-100 ${stat.indicatorColor}`}
                  />
                </div>
              </div>
            ))}
            {languageStats.length === 0 && (
              <div className="text-center py-6 text-gray-400">
                No language data found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
