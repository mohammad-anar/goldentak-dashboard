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
import { 
  Crown, 
  Calendar, 
  XCircle, 
  Users 
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

const metrics = [
  {
    label: "Free Users",
    value: "9,330",
    icon: Users,
    iconColor: "text-gray-500",
    iconBg: "bg-gray-100",
  },
  {
    label: "Paid Users",
    value: "3,120",
    icon: Crown,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-100",
  },
  {
    label: "Expiring Soon",
    value: "234",
    icon: Calendar,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-100",
  },
  {
    label: "Cancelled",
    value: "156",
    icon: XCircle,
    iconColor: "text-red-500",
    iconBg: "bg-red-100",
  },
];

const chartData = [
  { month: "Jan", renewals: 250 },
  { month: "Feb", renewals: 300 },
  { month: "Mar", renewals: 320 },
  { month: "Apr", renewals: 360 },
  { month: "May", renewals: 410 },
];

const recentSubscriptions = [
  {
    user: "Ahmet Yılmaz",
    plan: "Premium Monthly",
    amount: "$9.99",
    startDate: "2026-05-12",
    expiry: "2026-06-12",
    status: "Active",
  },
  {
    user: "John Smith",
    plan: "Premium Yearly",
    amount: "$99.99",
    startDate: "2026-05-10",
    expiry: "2027-05-10",
    status: "Active",
  },
  {
    user: "Ali Kaya",
    plan: "Premium Monthly",
    amount: "$9.99",
    startDate: "2026-05-08",
    expiry: "2026-05-15",
    status: "Expiring",
  },
  {
    user: "Sarah Johnson",
    plan: "Premium Monthly",
    amount: "$9.99",
    startDate: "2026-04-20",
    expiry: "2026-05-20",
    status: "Cancelled",
  },
];

export default function SubscriptionsPage() {
  return (
    <div className="flex flex-col gap-8 py-8 md:py-10 px-4 lg:px-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Monthly Renewals Chart */}
      <Card className="border-none shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Monthly Renewals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
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
                  domain={[0, 600]}
                  ticks={[0, 150, 300, 450, 600]}
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
          </div>
        </CardContent>
      </Card>

      {/* Recent Subscriptions Table */}
      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Recent Subscriptions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-none">
                <TableHead className="font-bold text-[12px] text-gray-400 py-4 px-6 uppercase">User</TableHead>
                <TableHead className="font-bold text-[12px] text-gray-400 py-4 px-6 uppercase">Plan</TableHead>
                <TableHead className="font-bold text-[12px] text-gray-400 py-4 px-6 uppercase">Amount</TableHead>
                <TableHead className="font-bold text-[12px] text-gray-400 py-4 px-6 uppercase">Start Date</TableHead>
                <TableHead className="font-bold text-[12px] text-gray-400 py-4 px-6 uppercase">Expiry</TableHead>
                <TableHead className="font-bold text-[12px] text-gray-400 py-4 px-6 uppercase">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSubscriptions.map((sub, index) => (
                <TableRow key={index} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-bold text-gray-800 py-5 px-6">{sub.user}</TableCell>
                  <TableCell className="text-gray-500 py-5 px-6 font-medium">{sub.plan}</TableCell>
                  <TableCell className="text-green-600 py-5 px-6 font-bold">{sub.amount}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
}
