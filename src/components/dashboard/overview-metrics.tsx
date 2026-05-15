"use client";

import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  UserCheck, 
  UserX, 
  DollarSign, 
  Smartphone, 
  UserPlus, 
  TrendingUp
} from "lucide-react";

const metrics = [
  {
    title: "Total Users",
    value: "12,450",
    icon: Users,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-100/50",
  },
  {
    title: "Active Users",
    value: "8,200",
    icon: UserCheck,
    iconColor: "text-green-500",
    iconBg: "bg-green-100/50",
  },
  {
    title: "Passive Users",
    value: "4,250",
    icon: UserX,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-100/50",
  },
  {
    title: "Paid Users",
    value: "3,120",
    icon: DollarSign,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-100/50",
  },
  {
    title: "Free Users",
    value: "9,330",
    icon: Users,
    iconColor: "text-gray-500",
    iconBg: "bg-gray-100/50",
  },
  {
    title: "iOS Users",
    value: "6,780",
    icon: Smartphone,
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-100/50",
  },
  {
    title: "Android Users",
    value: "5,670",
    icon: Smartphone,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-100/50",
  },
  {
    title: "New Today",
    value: "145",
    icon: UserPlus,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-100/50",
  },
];

import { useGetStatsQuery } from "@/redux/features/auth/userApi";

export function OverviewMetrics() {
  const { data: statsData, isLoading } = useGetStatsQuery({});
  const stats = statsData?.data || { totalUsers: 0, activeSubscribers: 0, conversionRate: 0 };

  const metrics = [
    {
      title: "Total Devices",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-100/50",
    },
    {
      title: "Active Subscriptions",
      value: stats.activeSubscribers.toLocaleString(),
      icon: UserCheck,
      iconColor: "text-green-500",
      iconBg: "bg-green-100/50",
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-100/50",
    },
    {
      title: "New Today",
      value: "0", // Need to implement daily count in backend
      icon: UserPlus,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-100/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
      {metrics.map((metric) => (
        <Card key={metric.title} className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : metric.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${metric.iconBg}`}>
                <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
