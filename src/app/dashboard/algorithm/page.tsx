"use client"
import {
  useGetAlgorithmSettingsQuery,
  useUpdateAlgorithmSettingsMutation
} from "@/redux/features/algorithm/algorithmApi";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Calculator, Coins, Dna, RotateCcw, Save, Settings2, Trophy, Users, Weight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

const initialWeightsData = [
  { id: "horseWeight", label: "Horse Power", value: 45, icon: Trophy, color: "text-orange-500", bg: "bg-orange-50" },
  { id: "jockeyWeight", label: "Jockey Power", value: 35, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "fatherWeight", label: "Father Power", value: 8, icon: Dna, color: "text-purple-500", bg: "bg-purple-50" },
  { id: "motherWeight", label: "Mother Power", value: 6, icon: Dna, color: "text-pink-500", bg: "bg-pink-50" },
  { id: "damSireWeight", label: "Mother's Father", value: 2, icon: Dna, color: "text-indigo-500", bg: "bg-indigo-50" },
  { id: "pedigreeWeight", label: "Pedigree Power", value: 5, icon: Calculator, color: "text-emerald-500", bg: "bg-emerald-50" },
  { id: "earningsWeight", label: "Earning Power", value: 5, icon: Coins, color: "text-yellow-600", bg: "bg-yellow-50" },
  { id: "weightEffectWeight", label: "Weight Effect", value: 10, icon: Weight, color: "text-gray-600", bg: "bg-gray-50" },
];

export default function AlgorithmManagementPage() {
  const { data: settingsData, isLoading } = useGetAlgorithmSettingsQuery({});
  const [updateSettings, { isLoading: isUpdating }] = useUpdateAlgorithmSettingsMutation();

  const [weights, setWeights] = useState(initialWeightsData);
  const [thresholds, setThresholds] = useState({
    bigThreshold: 20,
    mediumThreshold: 40,
    smallThreshold: 60,
  });

  useEffect(() => {
    if (settingsData?.data) {
      const s = settingsData.data;
      setWeights(prev => prev.map(w => ({ ...w, value: s[w.id] || w.value })));
      setThresholds({
        bigThreshold: s.bigThreshold,
        mediumThreshold: s.mediumThreshold,
        smallThreshold: s.smallThreshold,
      });
    }
  }, [settingsData]);

  const handleSave = async () => {
    try {
      const body = {
        ...thresholds,
        ...Object.fromEntries(weights.map(w => [w.id, w.value]))
      };
      await updateSettings(body).unwrap();
      toast.success("Algorithm settings updated successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update settings");
    }
  };

  const handleWeightChange = (id: string, newValue: number[]) => {
    setWeights(prev => prev.map(w => w.id === id ? { ...w, value: newValue[0] } : w));
  };

  const totalWeight = weights.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="flex flex-col gap-8 py-8 md:py-10 px-4 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">Algorithm Management</h1>
          <p className="text-gray-500">Fine-tune the weights and thresholds used for race analysis.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset Defaults
          </Button>
          <Button
            onClick={handleSave}
            disabled={isUpdating}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Weights Grid */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-gray-400" />
                Power Scoring Weights
              </CardTitle>
              <Badge className={`${totalWeight > 100 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'} border-none rounded-full`}>
                Total: {totalWeight}%
              </Badge>
            </CardHeader>
            <CardContent className="space-y-8">
              {isLoading ? (
                <div className="py-20 text-center text-gray-500">Loading algorithm weights...</div>
              ) : (
                weights.map((weight) => (
                  <div key={weight.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${weight.bg}`}>
                          <weight.icon className={`w-4 h-4 ${weight.color}`} />
                        </div>
                        <span className="font-semibold text-gray-700">{weight.label}</span>
                      </div>
                      <span className="font-bold text-gray-900">{weight.value}%</span>
                    </div>
                    <Slider
                      value={[weight.value]}
                      onValueChange={(val) => handleWeightChange(weight.id, val)}
                      max={100}
                      step={1}
                      className="[&_[data-slot=slider-range]]:bg-blue-600"
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Thresholds & Preview */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Calculator className="w-5 h-5 text-gray-400" />
                Category Thresholds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">BIG Threshold (Gap to Leader)</label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    value={thresholds.bigThreshold}
                    onChange={(e) => setThresholds({ ...thresholds, bigThreshold: parseInt(e.target.value) })}
                    className="rounded-xl bg-gray-50/50 border-gray-100"
                  />
                  <Badge className="bg-green-100 text-green-600 border-none px-3">BIG</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">MEDIUM Threshold</label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    value={thresholds.mediumThreshold}
                    onChange={(e) => setThresholds({ ...thresholds, mediumThreshold: parseInt(e.target.value) })}
                    className="rounded-xl bg-gray-50/50 border-gray-100"
                  />
                  <Badge className="bg-orange-100 text-orange-600 border-none px-3">MEDIUM</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">SMALL Threshold</label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    value={thresholds.smallThreshold}
                    onChange={(e) => setThresholds({ ...thresholds, smallThreshold: parseInt(e.target.value) })}
                    className="rounded-xl bg-gray-50/50 border-gray-100"
                  />
                  <Badge className="bg-red-100 text-red-600 border-none px-3">SMALL</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl bg-blue-600 text-white">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-lg">System Impact</h3>
              <p className="text-blue-100 text-sm">
                Changes to these weights will immediately affect all real-time calculations for upcoming races.
              </p>
              <ul className="text-sm space-y-2 text-blue-50">
                <li>• Rankings will be recalculated</li>
                <li>• Category badges will update</li>
                <li>• AI Confidence levels will shift</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
