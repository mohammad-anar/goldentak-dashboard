"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Users, 
  Crown, 
  Smartphone, 
  CheckCircle2 
} from "lucide-react";

const recipientTypes = [
  { id: "all", label: "All Users", icon: Users },
  { id: "paid", label: "Paid Users", icon: Crown },
  { id: "ios", label: "iOS Only", icon: Smartphone },
  { id: "android", label: "Android Only", icon: Smartphone },
];

const recentNotifications = [
  {
    title: "New Race Results",
    to: "All Users",
    date: "2026-05-12 14:30",
    status: "Delivered",
  },
  {
    title: "Premium Feature Update",
    to: "Paid Users",
    date: "2026-05-11 10:15",
    status: "Delivered",
  },
  {
    title: "iOS App Update",
    to: "iOS Users",
    date: "2026-05-10 16:45",
    status: "Delivered",
  },
  {
    title: "Maintenance Notice",
    to: "All Users",
    date: "2026-05-09 09:00",
    status: "Delivered",
  },
];

const metrics = [
  { label: "Total Sent", value: "1,245", color: "text-gray-900" },
  { label: "Delivered", value: "1,198", color: "text-green-500" },
  { label: "Opened", value: "856", color: "text-blue-500" },
  { label: "Click Rate", value: "68%", color: "text-purple-600" },
];

export default function NotificationsPage() {
  const [selectedRecipient, setSelectedRecipient] = useState("all");

  return (
    <div className="flex flex-col gap-8 py-8 md:py-10 px-4 lg:px-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900">Notification System</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Send New Notification Card */}
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Send New Notification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-500">Select Recipients</label>
              <div className="grid grid-cols-2 gap-3">
                {recipientTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedRecipient(type.id)}
                    className={`
                      flex items-center gap-3 px-4 py-4 rounded-xl border transition-all duration-200
                      ${selectedRecipient === type.id 
                        ? "border-blue-500 bg-blue-50/50 text-blue-600" 
                        : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"}
                    `}
                  >
                    <type.icon className={`w-5 h-5 ${selectedRecipient === type.id ? "text-blue-500" : "text-gray-400"}`} />
                    <span className="text-[14px] font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-500">Notification Title</label>
              <Input 
                placeholder="Enter notification title" 
                className="py-6 rounded-xl bg-gray-50/50 border-gray-100 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-500">Message</label>
              <Textarea 
                placeholder="Enter your message" 
                className="min-h-[150px] rounded-xl bg-gray-50/50 border-gray-100 placeholder:text-gray-400 p-4"
              />
            </div>

            <Button className="w-full py-7 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg flex items-center gap-2">
              <Send className="w-5 h-5" />
              Send Notification
            </Button>
          </CardContent>
        </Card>

        {/* Recent Notifications Card */}
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {recentNotifications.map((notif, index) => (
              <div key={index} className="p-5 rounded-2xl border border-gray-100 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-800">{notif.title}</h3>
                  <Badge className="bg-green-100 text-green-600 border-none rounded-full px-3 py-0.5 text-[11px] font-medium">
                    Delivered
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-[13px] text-gray-500">To: {notif.to}</p>
                  <p className="text-[13px] text-gray-400">{notif.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-none shadow-sm rounded-2xl">
            <CardContent className="p-6 space-y-1">
              <p className="text-sm font-medium text-gray-400">{metric.label}</p>
              <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
