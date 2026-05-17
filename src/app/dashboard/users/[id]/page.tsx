"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  useGetUserByIdQuery, 
  useUpdateSubscriptionMutation 
} from "@/redux/features/auth/userApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Smartphone, 
  Calendar, 
  ShieldAlert, 
  Crown, 
  Plus, 
  TrendingUp, 
  RefreshCw,
  Clock,
  CircleCheck,
  Ban,
  UserX
} from "lucide-react";
import { toast } from "sonner";

import { DUMMY_USERS } from "../page";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const isDummy = userId?.startsWith("dummy-user-");

  const { data: responseData, isLoading, isFetching, refetch } = useGetUserByIdQuery(userId, {
    skip: !userId || isDummy
  });

  const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation();

  // Find dummy user if requested
  const dummyUser = isDummy 
    ? DUMMY_USERS.find(u => u.id === userId) 
    : undefined;

  const user = dummyUser || responseData?.data;

  const handleAddDays = async (days: number) => {
    if (!user?.deviceId) {
      toast.error("Device ID is required to update subscription");
      return;
    }
    try {
      await updateSubscription({ deviceId: user.deviceId, plan: "PREMIUM", durationDays: days }).unwrap();
      toast.success(`Successfully added ${days} days to subscription`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update subscription");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
        <p className="text-gray-500 font-medium">Loading user profiles...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ShieldAlert className="h-12 w-12 text-red-500" />
        <p className="text-gray-900 font-bold text-xl">User Not Found</p>
        <p className="text-gray-500">The user you are trying to view does not exist or was deleted.</p>
        <Button onClick={() => router.push("/dashboard/users")} className="bg-blue-600 text-white rounded-xl">
          Back to User List
        </Button>
      </div>
    );
  }

  const isSubscribed = user.subscription?.isActive && new Date(user.subscription?.endDate) > new Date();

  return (
    <div className="flex flex-col gap-8 py-8 md:py-10 px-4 lg:px-6 max-w-5xl mx-auto">
      {/* Back Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => router.push("/dashboard/users")}
          className="rounded-xl border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Profile Details</h1>
          <p className="text-sm text-gray-500 font-mono">ID: {user.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side: General Profile Card */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-24 relative" />
            <CardContent className="p-6 pt-0 flex flex-col items-center -mt-12 relative z-10">
              <div className="w-24 h-24 rounded-full bg-white shadow-md border-4 border-white flex items-center justify-center overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-purple-50 flex items-center justify-center text-purple-600">
                    <User className="w-10 h-10" />
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mt-4 text-center">{user.name || "Device Account"}</h2>
              <span className="text-xs text-gray-400 font-mono mt-1">{user.username || `@${user.deviceId?.slice(0, 8)}`}</span>
              
              <div className="flex items-center gap-2 mt-4">
                <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full px-3.5 py-0.5 border-none font-semibold text-[10px]">
                  {user.role}
                </Badge>
                {user.isVerified && (
                  <Badge className="bg-green-50 text-green-600 hover:bg-green-100 rounded-full px-3.5 py-0.5 border-none font-semibold text-[10px]">
                    Verified
                  </Badge>
                )}
              </div>

              <div className="w-full border-t border-gray-100 my-6" />

              <div className="w-full space-y-4 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-gray-400 shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Device ID</p>
                    <p className="font-mono text-xs text-gray-700 truncate">{user.deviceId || "No Device Linked"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Email Address</p>
                    <p className="text-gray-700 truncate">{user.email || "No Email Provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Registered Since</p>
                    <p className="text-gray-700">
                      {new Date(user.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Subscription details & actions */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Subscription State Card */}
          <Card className="border-none shadow-sm rounded-2xl bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-gray-900">Subscription Status</CardTitle>
              <Badge className={`
                rounded-full px-4 py-1 border-none font-semibold text-[11px] uppercase tracking-wider
                ${isSubscribed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}
              `}>
                {isSubscribed ? 'Active Subscriber' : 'Free Tier'}
              </Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {user.subscription ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 font-semibold uppercase">Current Tier / Plan</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Crown className="w-5 h-5 text-purple-600" />
                      <span className="text-lg font-bold text-purple-900">{user.subscription.plan}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 font-semibold uppercase">Subscription Duration</p>
                    <p className="text-gray-800 font-medium mt-1">
                      {user.subscription.planDetail?.duration || "CUSTOM"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 font-semibold uppercase">Start Date</p>
                    <p className="text-gray-800 font-medium mt-1">
                      {new Date(user.subscription.startDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 font-semibold uppercase">Expiry / Renewal Date</p>
                    <p className="text-gray-800 font-bold mt-1 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-purple-500" />
                      {new Date(user.subscription.endDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed border-gray-200 rounded-2xl gap-3">
                  <UserX className="w-8 h-8 text-gray-400" />
                  <p className="text-gray-500 font-medium text-sm text-center">
                    This user has no subscription record. Assign or purchase a subscription to grant access.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 text-sm">Quick Administrative Overrides</h3>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    onClick={() => handleAddDays(30)}
                    disabled={isUpdating || !user.deviceId}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 h-11"
                  >
                    <Plus className="w-4 h-4" /> Add 30 Days Access
                  </Button>
                  <Button 
                    onClick={() => handleAddDays(365)}
                    disabled={isUpdating || !user.deviceId}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center gap-2 h-11"
                  >
                    <TrendingUp className="w-4 h-4" /> Grant 1 Year Premium
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-red-200 hover:bg-red-50 text-red-500 rounded-xl flex items-center gap-2 h-11"
                  >
                    <Ban className="w-4 h-4" /> Block Device Account
                  </Button>
                </div>
              </div>

              {/* Active Plan Included Benefits */}
              {user.subscription?.planDetail && (
                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <h3 className="font-semibold text-gray-900 text-sm">Plan Features Allowed</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.subscription.planDetail.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <CircleCheck className="w-4.5 h-4.5 text-green-500 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
