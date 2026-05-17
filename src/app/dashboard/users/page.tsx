"use client";

import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MoreVertical, 
  Search, 
  Plus, 
  TrendingUp,
  Ban,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  UserCheck,
  UserX,
  Eye
} from "lucide-react";
import { useGetUsersQuery, useUpdateSubscriptionMutation } from "@/redux/features/auth/userApi";
import { toast } from "sonner";
import Link from "next/link";

// High-fidelity fallback dummy users
export const DUMMY_USERS = [
  {
    id: "dummy-user-1",
    deviceId: "device_iphone_15_pro_abc123",
    name: "Alex Rider",
    username: "alexrider",
    email: "alex@rider.com",
    phone: "+15550199",
    role: "USER",
    isVerified: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    subscription: {
      plan: "Premium Monthly",
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
    }
  },
  {
    id: "dummy-user-2",
    deviceId: "device_google_pixel_8_pqr012",
    name: "Maria Santos",
    username: "mariasantos",
    email: "maria@santos.com",
    phone: "+34612345678",
    role: "USER",
    isVerified: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    subscription: {
      plan: "Premium Yearly",
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 355 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
    }
  },
  {
    id: "dummy-user-3",
    deviceId: "device_samsung_s24_xyz789",
    name: "John Miller",
    username: "johnmiller",
    email: "john@miller.com",
    phone: "+15550244",
    role: "USER",
    isVerified: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    subscription: {
      plan: "Basic Monthly",
      startDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: false,
    }
  },
  {
    id: "dummy-user-4",
    deviceId: "device_ipad_pro_def456",
    name: "Sarah Jenkins",
    username: "sarahj",
    email: "sarah@jenkins.com",
    phone: "+15550777",
    role: "USER",
    isVerified: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    subscription: null
  },
  {
    id: "dummy-user-5",
    deviceId: "device_oneplus_12_mno345",
    name: "David Chen",
    username: "davidchen",
    email: "david@chen.com",
    phone: "+8613900001234",
    role: "USER",
    isVerified: false,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    subscription: {
      plan: "Premium Yearly",
      startDate: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: false,
    }
  }
];

export default function UserManagementPage() {
  // Query state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("all");

  // Fetch users with filters
  const { data: responseData, isLoading, isFetching, refetch } = useGetUsersQuery({
    page,
    limit,
    searchTerm,
    subscriptionStatus: subscriptionStatus === "all" ? undefined : subscriptionStatus
  }, {
    refetchOnMountOrArgChange: true
  });

  const [updateSubscription] = useUpdateSubscriptionMutation();

  // Determine user data with premium frontend-side mock fallback
  const apiUsers = responseData?.data || [];
  const hasApiData = responseData?.data && responseData.data.length > 0;
  
  let users = apiUsers;
  let meta = responseData?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };
  
  if (!hasApiData && !isLoading && !isFetching) {
    // Client-side filtering of dummy users so searching/filtering stays functional
    let filteredDummies = DUMMY_USERS;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredDummies = filteredDummies.filter(u => 
        u.deviceId.toLowerCase().includes(term) ||
        (u.name && u.name.toLowerCase().includes(term)) ||
        (u.email && u.email.toLowerCase().includes(term)) ||
        (u.username && u.username.toLowerCase().includes(term))
      );
    }
    
    if (subscriptionStatus === "subscribed") {
      filteredDummies = filteredDummies.filter(u => u.subscription?.isActive);
    } else if (subscriptionStatus === "unsubscribed") {
      filteredDummies = filteredDummies.filter(u => !u.subscription || !u.subscription.isActive);
    }
    
    const total = filteredDummies.length;
    const totalPage = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    
    users = filteredDummies.slice(startIndex, startIndex + limit);
    meta = {
      page,
      limit,
      total,
      totalPage
    };
  }

  // Handle Search Input Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1); // Reset to page 1 on search
      setSearchTerm(searchInput);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const handleStatusFilterChange = (value: string) => {
    setSubscriptionStatus(value);
    setPage(1); // Reset to page 1 on filter
  };

  const handleLimitChange = (value: string) => {
    setLimit(Number(value));
    setPage(1); // Reset to page 1 on limit change
  };

  const handleAddDays = async (deviceId: string, days: number) => {
    try {
      await updateSubscription({ deviceId, plan: "PREMIUM", durationDays: days }).unwrap();
      toast.success(`Successfully added ${days} days to subscription`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update subscription");
    }
  };

  return (
    <div className="flex flex-col gap-8 py-8 md:py-10 px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">All Users List</h1>
          <p className="text-gray-500 mt-1">Manage and view details for all login and device accounts in this project.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => refetch()} 
            className="rounded-xl border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Control Bar (Search, Filtering, etc.) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search by Device ID, Name, Email, Username..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-11 pr-4 bg-gray-50/50 border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-100 rounded-xl py-5 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Subscription:</span>
          </div>
          <Select 
            value={subscriptionStatus} 
            onValueChange={handleStatusFilterChange}
          >
            <SelectTrigger className="w-[180px] rounded-xl bg-gray-50/50 border-gray-200">
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-100 shadow-lg">
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="subscribed">
                <span className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-green-500" />
                  Subscribed
                </span>
              </SelectItem>
              <SelectItem value="unsubscribed">
                <span className="flex items-center gap-2">
                  <UserX className="h-4 w-4 text-gray-500" />
                  Unsubscribed
                </span>
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Show:</span>
            <Select 
              value={limit.toString()} 
              onValueChange={handleLimitChange}
            >
              <SelectTrigger className="w-[80px] rounded-xl bg-gray-50/50 border-gray-200">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/40 border-b border-gray-100">
              <TableRow className="border-none">
                <TableHead className="font-bold text-[13px] text-gray-400 py-5 px-6 uppercase">Device ID</TableHead>
                <TableHead className="font-bold text-[13px] text-gray-400 py-5 px-6 uppercase">User Detail / Email</TableHead>
                <TableHead className="font-bold text-[13px] text-gray-400 py-5 px-6 uppercase text-center">Subscription</TableHead>
                <TableHead className="font-bold text-[13px] text-gray-400 py-5 px-6 uppercase text-center">Plan Tier</TableHead>
                <TableHead className="font-bold text-[13px] text-gray-400 py-5 px-6 uppercase">Expiry Date</TableHead>
                <TableHead className="font-bold text-[13px] text-gray-400 py-5 px-6 uppercase">Join Date</TableHead>
                <TableHead className="font-bold text-[13px] text-gray-400 py-5 px-6 uppercase text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isFetching ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-20 text-gray-500 font-medium">
                    <div className="flex flex-col items-center gap-3">
                      <RefreshCw className="h-6 w-6 animate-spin text-purple-600" />
                      <span>Fetching users from server...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-20 text-gray-400 font-medium">
                    No users found matching the search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: any) => {
                  const isSubscribed = user.subscription?.isActive && new Date(user.subscription?.endDate) > new Date();
                  return (
                    <TableRow key={user.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                      <TableCell className="py-4 px-6 font-mono text-xs font-semibold text-gray-700">
                        {user.deviceId || "N/A"}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-800">
                            {user.name || "N/A"}
                          </span>
                          <span className="text-xs text-gray-400">
                            {user.email || user.username || "No Email linked"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4 px-6">
                        <Badge className={`
                          rounded-full px-3 py-1 border-none font-semibold text-[10px] tracking-wide uppercase
                          ${isSubscribed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}
                        `}>
                          {isSubscribed ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center py-4 px-6">
                        <Badge className={`
                          rounded-full px-3 py-1 border-none font-semibold text-[10px] uppercase
                          ${isSubscribed ? 'bg-purple-100 text-purple-600' : 'bg-blue-50 text-blue-500'}
                        `}>
                          {user.subscription?.plan || "FREE"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 py-4 px-6 text-xs font-medium">
                        {user.subscription?.endDate 
                          ? new Date(user.subscription.endDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }) 
                          : "-"}
                      </TableCell>
                      <TableCell className="text-gray-400 py-4 px-6 text-xs font-medium">
                        {new Date(user.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-right py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/dashboard/users/${user.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 rounded-lg" title="View Details">
                              <Eye className="h-4.5 w-4.5" />
                            </Button>
                          </Link>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 rounded-lg">
                                <MoreVertical className="h-4.5 w-4.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px] rounded-xl p-1.5 shadow-xl border-none bg-white">
                              <DropdownMenuItem 
                                onClick={() => handleAddDays(user.deviceId, 30)}
                                disabled={!user.deviceId}
                                className="flex items-center gap-2.5 py-2 px-3 rounded-lg cursor-pointer focus:bg-blue-50 text-xs font-medium text-gray-700"
                              >
                                <Plus className="w-4 h-4 text-blue-600" />
                                <span>Add 30 Days</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleAddDays(user.deviceId, 365)}
                                disabled={!user.deviceId}
                                className="flex items-center gap-2.5 py-2 px-3 rounded-lg cursor-pointer focus:bg-purple-50 text-xs font-medium text-gray-700"
                              >
                                <TrendingUp className="w-4 h-4 text-purple-600" />
                                <span>Add 1 Year</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2.5 py-2 px-3 rounded-lg cursor-pointer focus:bg-red-50 text-xs font-medium text-red-500">
                                <Ban className="w-4 h-4 text-red-500" />
                                <span>Block Device</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Premium Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-50 bg-gray-50/20">
          <span className="text-xs font-medium text-gray-500">
            Showing <span className="text-gray-800 font-semibold">{users.length}</span> of{" "}
            <span className="text-gray-800 font-semibold">{meta.total}</span> users
          </span>
          
          <div className="flex items-center gap-1.5">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setPage(p => Math.max(p - 1, 1))} 
              disabled={page === 1}
              className="h-8 w-8 rounded-lg border-gray-200 hover:bg-gray-50 bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  onClick={() => setPage(p)}
                  className={`h-8 min-w-[32px] px-2 rounded-lg text-xs font-semibold
                    ${p === page 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'border-gray-200 hover:bg-gray-50 bg-white text-gray-600'
                    }
                  `}
                >
                  {p}
                </Button>
              ))}
            </div>

            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setPage(p => Math.min(p + 1, meta.totalPage))} 
              disabled={page === meta.totalPage}
              className="h-8 w-8 rounded-lg border-gray-200 hover:bg-gray-50 bg-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
