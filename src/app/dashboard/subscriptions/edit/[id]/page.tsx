"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { useGetPlansQuery, useUpdatePlanMutation } from "@/redux/features/subscription/subscriptionApi";
import { toast } from "sonner";
import Link from "next/link";

export default function EditPlanPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params.id as string;
  
  const { data: plansData, isLoading: isFetching } = useGetPlansQuery({});
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();
  
  const [formData, setFormData] = useState({
    name: "",
    duration: "MONTHLY",
    price: "",
    features: [""]
  });

  useEffect(() => {
    if (plansData?.data) {
      const plan = plansData.data.find((p: any) => p.id === planId);
      if (plan) {
        setFormData({
          name: plan.name,
          duration: plan.duration,
          price: plan.price.toString(),
          features: plan.features.length > 0 ? plan.features : [""]
        });
      }
    }
  }, [plansData, planId]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await updatePlan({
        id: planId,
        ...formData,
        price: parseFloat(formData.price),
        features: formData.features.filter(f => f.trim() !== "")
      }).unwrap();
      
      toast.success("Subscription plan updated successfully");
      router.push("/dashboard/subscriptions");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update plan");
    }
  };

  if (isFetching) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="flex flex-col gap-8 py-8 md:py-10 px-4 lg:px-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/subscriptions">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Plan</h1>
      </div>

      <Card className="border-none shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle>Plan Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Premium Monthly" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select 
                  value={formData.duration} 
                  onValueChange={(val) => setFormData({ ...formData, duration: val })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="YEARLY">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                className="rounded-xl"
              />
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
              
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    placeholder="Enter feature..." 
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="rounded-xl"
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

            <div className="pt-4 flex gap-4">
              <Button 
                type="submit" 
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8"
              >
                {isUpdating ? "Updating..." : "Save Changes"}
              </Button>
              <Link href="/dashboard/subscriptions">
                <Button variant="outline" className="rounded-xl">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
