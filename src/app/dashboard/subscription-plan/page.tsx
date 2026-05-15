"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Plus, Trash2, Edit, Save, X, UserPlus } from "lucide-react";
import { 
  useGetPlansQuery, 
  useCreatePlanMutation, 
  useUpdatePlanMutation,
  useCreateSubscriptionMutation
} from "@/redux/features/subscription/subscriptionApi";
import { useGetUsersQuery } from "@/redux/features/auth/authApi";
import { toast } from "sonner";

const dummyPlans = [
  {
    id: "dummy-basic",
    name: "Basic Plan (Fallback)",
    duration: "MONTHLY",
    price: 29.99,
    features: ["Access to daily races", "Basic horse analysis", "Email support"],
  },
  {
    id: "dummy-premium",
    name: "Premium Plan (Fallback)",
    duration: "MONTHLY",
    price: 59.99,
    features: ["Advanced AI predictions", "Jockey performance stats", "Priority support"],
  }
];

export default function SubscriptionPlanPage() {
  const { data: plansData, isLoading: isFetching } = useGetPlansQuery({});
  const { data: usersData } = useGetUsersQuery({});
  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();
  const [assignSubscription, { isLoading: isAssigning }] = useCreateSubscriptionMutation();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAssignSheetOpen, setIsAssignSheetOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    duration: "MONTHLY",
    price: "",
    features: [""]
  });

  const [assignData, setAssignData] = useState({
    userId: "",
    planId: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: ""
  });

  const plans = plansData?.data?.length > 0 ? plansData.data : dummyPlans;
  const users = usersData?.data || [];


  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index: number) => {
    if (formData.features.length === 1) return;
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      duration: "MONTHLY",
      price: "",
      features: [""]
    });
  };

  const handleEdit = (plan: any) => {
    setEditingId(plan.id);
    setFormData({
      name: plan.name,
      duration: plan.duration,
      price: plan.price.toString(),
      features: plan.features.length > 0 ? plan.features : [""]
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        features: formData.features.filter(f => f.trim() !== "")
      };
      if (editingId) {
        await updatePlan({ id: editingId, ...payload }).unwrap();
        toast.success("Plan updated successfully");
      } else {
        await createPlan(payload).unwrap();
        toast.success("Plan created successfully");
      }
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  const handlePlanChangeForAssign = (planId: string) => {
    const plan = plans.find((p: any) => p.id === planId);
    if (plan) {
      const start = new Date(assignData.startDate);
      const end = new Date(start);
      if (plan.duration === "MONTHLY") {
        end.setMonth(end.getMonth() + 1);
      } else {
        end.setFullYear(end.getFullYear() + 1);
      }
      setAssignData({ 
        ...assignData, 
        planId, 
        endDate: end.toISOString().split('T')[0] 
      });
    } else {
      setAssignData({ ...assignData, planId });
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignData.userId || !assignData.planId || !assignData.endDate) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await assignSubscription(assignData).unwrap();
      toast.success("Subscription assigned successfully");
      setIsAssignSheetOpen(false);
      setAssignData({
        userId: "",
        planId: "",
        startDate: new Date().toISOString().split('T')[0],
        endDate: ""
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to assign subscription");
    }
  };

  return (
    <div className="flex flex-col gap-8 py-8 md:py-10 px-4 lg:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
          <p className="text-gray-500">Create packages and assign them to users.</p>
        </div>
        
        <Sheet open={isAssignSheetOpen} onOpenChange={setIsAssignSheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Assign User
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md rounded-l-3xl">
            <SheetHeader className="pb-6">
              <SheetTitle className="text-2xl font-bold">Assign Subscription</SheetTitle>
            </SheetHeader>
            <form onSubmit={handleAssignSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Select User</Label>
                <Select onValueChange={(val) => setAssignData({ ...assignData, userId: val })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Choose a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name || user.email || user.deviceId || user.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Subscription Plan</Label>
                <Select onValueChange={handlePlanChangeForAssign}>
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
                    value={assignData.startDate}
                    onChange={(e) => setAssignData({ ...assignData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <input 
                    type="date" 
                    value={assignData.endDate}
                    onChange={(e) => setAssignData({ ...assignData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isAssigning}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl w-full h-12 text-lg font-semibold"
                >
                  {isAssigning ? "Assigning..." : "Confirm Assignment"}
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Form Card */}
      <Card className="border-none shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            {editingId ? "Edit Plan" : "Create New Plan"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Premium Monthly" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl bg-gray-50/50 border-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select 
                  value={formData.duration} 
                  onValueChange={(val) => setFormData({ ...formData, duration: val })}
                >
                  <SelectTrigger className="rounded-xl bg-gray-50/50 border-gray-100">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="YEARLY">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="rounded-xl bg-gray-50/50 border-gray-100"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Features</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addFeature}
                  className="rounded-lg h-8 gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Feature
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      placeholder="Enter feature..." 
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="rounded-xl bg-gray-50/50 border-gray-100"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeFeature(index)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <Button 
                type="submit" 
                disabled={isCreating || isUpdating}
                className={`${editingId ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-xl px-8 flex items-center gap-2 h-11`}
              >
                {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingId ? (isUpdating ? "Updating..." : "Save Changes") : (isCreating ? "Creating..." : "Create Plan")}
              </Button>
              {editingId && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                  className="rounded-xl flex items-center gap-2 h-11"
                >
                  <X className="w-4 h-4" /> Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List Card */}
      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-white">
          <CardTitle className="text-lg font-bold">Existing Plans</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-none">
                <TableHead className="font-bold text-[12px] text-gray-400 py-4 px-6 uppercase">Name</TableHead>
                <TableHead className="font-bold text-[12px] text-gray-400 py-4 px-6 uppercase">Duration</TableHead>
                <TableHead className="font-bold text-[12px] text-gray-400 py-4 px-6 uppercase">Price</TableHead>
                <TableHead className="font-bold text-[12px] text-gray-400 py-4 px-6 uppercase">Features</TableHead>
                <TableHead className="font-bold text-[12px] text-gray-400 py-4 px-6 uppercase text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetching ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10">Loading...</TableCell></TableRow>
              ) : plans.length > 0 ? (
                plans.map((plan: any) => (
                  <TableRow key={plan.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-bold text-gray-800 py-5 px-6">{plan.name}</TableCell>
                    <TableCell className="text-gray-500 py-5 px-6">
                      <span className="capitalize px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold">
                        {plan.duration.toLowerCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-green-600 py-5 px-6 font-bold">${plan.price}</TableCell>
                    <TableCell className="text-gray-400 py-5 px-6 text-xs max-w-xs">
                      {plan.features.join(", ")}
                    </TableCell>
                    <TableCell className="py-5 px-6 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEdit(plan)}
                        className="text-blue-600 hover:bg-blue-50 rounded-xl"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={5} className="text-center py-10 text-gray-500">No plans found. Create one above.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
