"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useGetPlansQuery, useCreateSubscriptionMutation } from "@/redux/features/subscription/subscriptionApi";
import { useGetUsersQuery } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import Link from "next/link";

export default function AssignSubscriptionPage() {
  const router = useRouter();
  const { data: plansData } = useGetPlansQuery({});
  const { data: usersData } = useGetUsersQuery({});
  const [assignSubscription, { isLoading }] = useCreateSubscriptionMutation();
  
  const [formData, setFormData] = useState({
    userId: "",
    planId: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: ""
  });

  const plans = plansData?.data || [];
  const users = usersData?.data || [];

  const handlePlanChange = (planId: string) => {
    const plan = plans.find((p: any) => p.id === planId);
    if (plan) {
      const start = new Date(formData.startDate);
      const end = new Date(start);
      if (plan.duration === "MONTHLY") {
        end.setMonth(end.getMonth() + 1);
      } else {
        end.setFullYear(end.getFullYear() + 1);
      }
      setFormData({ 
        ...formData, 
        planId, 
        endDate: end.toISOString().split('T')[0] 
      });
    } else {
      setFormData({ ...formData, planId });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userId || !formData.planId || !formData.endDate) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await assignSubscription(formData).unwrap();
      toast.success("Subscription assigned successfully");
      router.push("/dashboard/subscriptions");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to assign subscription");
    }
  };

  return (
    <div className="flex flex-col gap-8 py-8 md:py-10 px-4 lg:px-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/subscriptions">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Assign Subscription</h1>
      </div>

      <Card className="border-none shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            Manual Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Select User</Label>
              <Select onValueChange={(val) => setFormData({ ...formData, userId: val })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Choose a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user: any) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name || user.email || user.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Subscription Plan</Label>
              <Select onValueChange={handlePlanChange}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Choose a plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan: any) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} (${plan.price})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <input 
                  type="date" 
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <input 
                  type="date" 
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl w-full"
              >
                {isLoading ? "Assigning..." : "Confirm Assignment"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
