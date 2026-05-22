"use client";

import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  UserPlus, 
  Calendar,
  Trophy
} from "lucide-react";

interface OverviewMetricsProps {
  data?: {
    totalUsers: number;
    activeSubscribers: number;
    conversionRate: number;
    newToday: number;
    totalRaces: number;
    totalHorses: number;
  };
  isLoading?: boolean;
}

export function OverviewMetrics({ data, isLoading }: OverviewMetricsProps) {
  const stats = data || {
    totalUsers: 0,
    activeSubscribers: 0,
    conversionRate: 0,
    newToday: 0,
    totalRaces: 0,
    totalHorses: 0,
  };

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
      value: `${Number(stats.conversionRate || 0).toFixed(1)}%`,
      icon: TrendingUp,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-100/50",
    },
    {
      title: "New Today",
      value: stats.newToday.toLocaleString(),
      icon: UserPlus,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-100/50",
    },
    {
      title: "Total Races",
      value: stats.totalRaces.toLocaleString(),
      icon: Calendar,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-100/50",
    },
    {
      title: "Total Horses",
      value: stats.totalHorses.toLocaleString(),
      icon: Trophy,
      iconColor: "text-indigo-500",
      iconBg: "bg-indigo-100/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 px-4 lg:px-6">
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
