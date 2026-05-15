"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  Database, 
  AlertCircle, 
  RefreshCw 
} from "lucide-react";

const metrics = [
  {
    label: "API Status",
    value: "Active",
    icon: CheckCircle,
    iconColor: "text-green-500",
    iconBg: "bg-green-100",
  },
  {
    label: "Last Sync",
    value: "2 mins ago",
    icon: Clock,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-100",
  },
  {
    label: "Total Requests",
    value: "45,678",
    icon: Database,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-100",
  },
  {
    label: "Failed Requests",
    value: "23",
    icon: AlertCircle,
    iconColor: "text-red-500",
    iconBg: "bg-red-100",
  },
];

const endpoints = [
  { name: "Race Results", path: "/api/races/results", lastCall: "1 min ago", count: "12,450 calls" },
  { name: "Statistics", path: "/api/statistics", lastCall: "3 mins ago", count: "8,920 calls" },
  { name: "Horse Details", path: "/api/horses", lastCall: "5 mins ago", count: "15,780 calls" },
  { name: "Track Info", path: "/api/tracks", lastCall: "2 mins ago", count: "6,340 calls" },
  { name: "Jockey Stats", path: "/api/jockeys", lastCall: "10 mins ago", count: "4,210 calls" },
  { name: "Cities", path: "/api/cities", lastCall: "15 mins ago", count: "2,890 calls" },
];

const syncs = [
  { name: "Race Results", time: "2026-05-12 14:45", result: "156 records synced" },
  { name: "Horse Data", time: "2026-05-12 14:30", result: "89 records synced" },
  { name: "Statistics", time: "2026-05-12 14:15", result: "234 records synced" },
  { name: "Track Info", time: "2026-05-12 14:00", result: "45 records synced" },
];

export default function ApiManagementPage() {
  return (
    <div className="flex flex-col gap-8 py-8 md:py-10 px-4 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">API Management</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 px-6 flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh All Data
        </Button>
      </div>

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

      {/* Configuration Card */}
      <Card className="border-none shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold">TJK API Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">API Base URL</label>
              <Input 
                defaultValue="https://api.tjk.org" 
                className="py-6 rounded-xl bg-gray-50/50 border-gray-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">API Key</label>
              <Input 
                type="password" 
                defaultValue="••••••••••••••••••••" 
                className="py-6 rounded-xl bg-gray-50/50 border-gray-100"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">Sync Interval</label>
            <Input 
              placeholder="Select sync interval" 
              className="py-6 rounded-xl bg-gray-50/50 border-gray-100"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* API Endpoints Card */}
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-bold">API Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {endpoints.map((endpoint, index) => (
                <div key={index} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-800">{endpoint.name}</h3>
                    <p className="text-[13px] text-gray-400 font-mono">{endpoint.path}</p>
                    <p className="text-[12px] text-gray-400">Last call: {endpoint.lastCall}</p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <Badge className="bg-green-100 text-green-600 border-none rounded-full px-3 py-0.5 text-[11px] font-medium">
                      Active
                    </Badge>
                    <span className="text-[13px] text-gray-400">{endpoint.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Syncs Card */}
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recent Syncs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {syncs.map((sync, index) => (
                <div key={index} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-800">{sync.name}</h3>
                    <p className="text-[13px] text-gray-400">{sync.time}</p>
                    <p className="text-[13px] text-gray-500 font-medium">{sync.result}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-600 border-none rounded-full px-3 py-0.5 text-[11px] font-medium">
                    Success
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
