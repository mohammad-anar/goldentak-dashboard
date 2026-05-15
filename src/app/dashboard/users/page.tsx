"use client";

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
  MoreVertical, 
  Search, 
  Eye, 
  Ban, 
  Plus, 
  TrendingUp,
  Smartphone
} from "lucide-react";
import { useGetUsersQuery, useUpdateSubscriptionMutation } from "@/redux/features/auth/userApi";
import { toast } from "sonner";

export default function UserManagementPage() {
  const { data: usersData, isLoading } = useGetUsersQuery({});
  const [updateSubscription] = useUpdateSubscriptionMutation();
  
  const users = usersData?.data || [];

  const handleAddDays = async (deviceId: string, days: number) => {
    try {
      await updateSubscription({ deviceId, plan: "PREMIUM", durationDays: days }).unwrap();
      toast.success(`Successfully added ${days} days to subscription`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update subscription");
    }
  };

  return (
    <div className="flex flex-col gap-8 py-8 md:py-10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search device IDs..." 
            className="pl-10 bg-white border-none shadow-sm rounded-xl py-6"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="px-4 lg:px-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-none">
                <TableHead className="font-bold text-[13px] text-gray-400 py-6 uppercase">Device ID</TableHead>
                <TableHead className="font-bold text-[13px] text-gray-400 py-6 uppercase text-center">Subscription</TableHead>
                <TableHead className="font-bold text-[13px] text-gray-400 py-6 uppercase text-center">Plan</TableHead>
                <TableHead className="font-bold text-[13px] text-gray-400 py-6 uppercase">Expiry Date</TableHead>
                <TableHead className="font-bold text-[13px] text-gray-400 py-6 uppercase">Join Date</TableHead>
                <TableHead className="font-bold text-[13px] text-gray-400 py-6 uppercase text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20 text-gray-500">Loading devices...</TableCell>
                </TableRow>
              ) : users.map((user: any) => (
                <TableRow key={user.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-medium text-gray-600 py-5 font-mono text-xs">{user.deviceId}</TableCell>
                  <TableCell className="text-center py-5">
                    <Badge className={`
                      rounded-full px-4 py-1 border-none font-medium text-[11px]
                      ${user.subscription?.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}
                    `}>
                      {user.subscription?.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center py-5">
                    <Badge className={`
                      rounded-full px-4 py-1 border-none font-medium text-[11px]
                      ${user.subscription ? 'bg-purple-100 text-purple-600' : 'bg-blue-50 text-blue-400'}
                    `}>
                      {user.subscription?.plan || "FREE"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 py-5">
                    {user.subscription?.endDate ? new Date(user.subscription.endDate).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell className="text-gray-500 py-5">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right py-5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px] rounded-xl p-2 shadow-lg border-none bg-white">
                        <DropdownMenuItem 
                          onClick={() => handleAddDays(user.deviceId, 30)}
                          className="flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer focus:bg-blue-50"
                        >
                          <Plus className="w-4 h-4 text-blue-600" />
                          <span className="text-[14px] font-medium text-gray-700">Add 30 Days</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleAddDays(user.deviceId, 365)}
                          className="flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer focus:bg-purple-50"
                        >
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                          <span className="text-[14px] font-medium text-gray-700">Add 1 Year</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer focus:bg-red-50">
                          <Ban className="w-4 h-4 text-red-500" />
                          <span className="text-[14px] font-medium text-red-500">Block Device</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
