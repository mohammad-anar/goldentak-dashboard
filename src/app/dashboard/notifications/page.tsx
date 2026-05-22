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
  Loader2 
} from "lucide-react";
import { 
  useGetRecentNotificationsQuery, 
  useGetNotificationStatsQuery, 
  useSendNotificationMutation 
} from "@/redux/features/notification/notificationApi";
import { toast } from "sonner";

const recipientTypes = [
  { id: "all", label: "All Users", icon: Users },
  { id: "paid", label: "Paid Users", icon: Crown },
  { id: "ios", label: "iOS Only", icon: Smartphone },
  { id: "android", label: "Android Only", icon: Smartphone },
];

export default function NotificationsPage() {
  const [selectedRecipient, setSelectedRecipient] = useState("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  // Queries & Mutations
  const { data: statsResponse, isLoading: isStatsLoading } = useGetNotificationStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: recentResponse, isLoading: isRecentLoading } = useGetRecentNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [sendNotification, { isLoading: isSending }] = useSendNotificationMutation();

  const stats = statsResponse?.data || { totalSent: "0", delivered: "0", opened: "0", clickRate: "0%" };
  const recentNotifications = recentResponse?.data || [];

  const metrics = [
    { label: "Total Sent", value: stats.totalSent, color: "text-gray-900" },
    { label: "Delivered", value: stats.delivered, color: "text-green-500" },
    { label: "Opened", value: stats.opened, color: "text-blue-500" },
    { label: "Click Rate", value: stats.clickRate, color: "text-purple-600" },
  ];

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a notification title");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a notification message");
      return;
    }

    try {
      await sendNotification({
        title,
        message,
        recipientType: selectedRecipient,
      }).unwrap();

      toast.success("Notification sent successfully!");
      setTitle("");
      setMessage("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send notification");
    }
  };

  const getRecipientLabel = (id: string) => {
    const found = recipientTypes.find((r) => r.id === id);
    return found ? found.label : "Target Users";
  };

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
          <CardContent>
            <form onSubmit={handleSendNotification} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-500">Select Recipients</label>
                <div className="grid grid-cols-2 gap-3">
                  {recipientTypes.map((type) => (
                    <button
                      type="button"
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="py-6 rounded-xl bg-gray-50/50 border-gray-100 placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-500">Message</label>
                <Textarea 
                  placeholder="Enter your message" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[150px] rounded-xl bg-gray-50/50 border-gray-100 placeholder:text-gray-400 p-4"
                />
              </div>

              <Button 
                type="submit"
                disabled={isSending}
                className="w-full py-7 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg flex items-center gap-2"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Notification
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Notifications Card */}
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {isRecentLoading ? (
              <div className="text-center py-20 text-gray-500 font-medium">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                <span>Loading recent notifications...</span>
              </div>
            ) : recentNotifications.length === 0 ? (
              <div className="text-center py-20 text-gray-400 font-medium border border-dashed border-gray-200 rounded-2xl">
                No notification history found.
              </div>
            ) : (
              recentNotifications.map((notif: any) => (
                <div key={notif.id} className="p-5 rounded-2xl border border-gray-100 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">{notif.title}</h3>
                    <Badge className="bg-green-100 text-green-600 border-none rounded-full px-3 py-0.5 text-[11px] font-medium">
                      Delivered
                    </Badge>
                  </div>
                  <p className="text-[13px] text-gray-600 line-clamp-3 leading-relaxed">
                    {notif.message}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-gray-50 text-[11px] text-gray-400">
                    <span>To: {getRecipientLabel(notif.recipient)}</span>
                    <span>{new Date(notif.createdAt).toLocaleString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-none shadow-sm rounded-2xl">
            <CardContent className="p-6 space-y-1">
              <p className="text-sm font-medium text-gray-400">{metric.label}</p>
              {isStatsLoading ? (
                <div className="h-8 w-16 bg-gray-100 animate-pulse rounded-lg mt-1" />
              ) : (
                <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
