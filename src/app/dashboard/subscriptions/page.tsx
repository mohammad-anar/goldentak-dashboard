"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Crown, 
  Calendar, 
  XCircle, 
  Users,
  Loader2,
  Plus
} from "lucide-react";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { useGetSubscriptionOverviewQuery } from "@/redux/features/subscription/subscriptionApi";
import Link from "next/link";

export default function SubscriptionsPage() {
  const { data: response, isLoading } = useGetSubscriptionOverviewQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const overview = response?.data || {
    metrics: {
      freeUsers: "0",
      paidUsers: "0",
      expiringSoon: "0",
      cancelled: "0",
    },
    chartData: [],
    recentSubscriptions: [],
  };

  const metricsData = [
    {
      label: "Free Users",
      value: overview.metrics.freeUsers,
      icon: Users,
      iconColor: "text-gray-500",
      iconBg: "bg-gray-100",
    },
    {
      label: "Paid Users",
      value: overview.metrics.paidUsers,
      icon: Crown,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    {
      label: "Expiring Soon",
      value: overview.metrics.expiringSoon,
      icon: Calendar,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-100",
    },
    {
      label: "Cancelled",
      value: overview.metrics.cancelled,
      icon: XCircle,
      iconColor: "text-red-500",
      iconBg: "bg-red-100",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-500 font-medium">Loading subscription details...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-8 md:py-10 px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Subscription Overview</h1>
          <p className="text-gray-500 mt-1">Monitor subscriber metrics and manually assign premium plans.</p>
        </div>
        <div>
          <Link href="/dashboard/subscriptions/assign">
            <Button className="bg-[#006841] hover:bg-[#006841]/90 text-white rounded-xl py-6 px-6 font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200">
              <Plus className="w-5 h-5" />
              Assign Premium User
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((metric) => (
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

      {/* Monthly Renewals Chart */}
      <Card className="border-none shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Monthly Renewals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            {overview.chartData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                No subscription renewal history.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={overview.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Bar 
                    dataKey="renewals" 
                    fill="#8b5cf6" 
                    radius={[4, 4, 0, 0]} 
                    barSize={120}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Subscriptions Table */}
      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Recent Subscriptions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {overview.recentSubscriptions.length === 0 ? (
            <div className="text-center py-20 text-gray-400 font-medium border-t border-gray-100">
              No recent subscriptions found.
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="border-none">
                  <TableHead className="font-bold text-[12px] text-gray-400 py-4 px-6 uppercase">User</TableHead>
                  <TableHead className="font-bold text-[12px] text-gray-400 py-4 px-6 uppercase">Type</TableHead>
                  <TableHead className="font-bold text-[12px] text-gray-400 py-4 px-6 uppercase">Start Date</TableHead>
                  <TableHead className="font-bold text-[12px] text-gray-400 py-4 px-6 uppercase">Expiry</TableHead>
                  <TableHead className="font-bold text-[12px] text-gray-400 py-4 px-6 uppercase">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overview.recentSubscriptions.map((sub: any, index: number) => (
                  <TableRow key={index} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-bold text-gray-800 py-5 px-6">{sub.user}</TableCell>
                    <TableCell className="text-purple-600 py-5 px-6 font-bold uppercase">{sub.plan}</TableCell>
                    <TableCell className="text-gray-400 py-5 px-6 font-medium">{sub.startDate}</TableCell>
                    <TableCell className="text-gray-400 py-5 px-6 font-medium">{sub.expiry}</TableCell>
                    <TableCell className="py-5 px-6">
                      <Badge className={`
                        rounded-full px-3 py-0.5 border-none font-medium text-[11px]
                        ${sub.status === 'Active' ? 'bg-green-100 text-green-600' : 
                          sub.status === 'Expiring' ? 'bg-orange-100 text-orange-600' : 
                          'bg-red-100 text-red-600'}
                      `}>
                        {sub.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
