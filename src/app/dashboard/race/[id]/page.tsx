"use client";

import { useGetRaceByIdQuery, useCalculateRaceScoresMutation } from "@/redux/features/race/raceApi";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  RefreshCcw, 
  Trophy, 
  User, 
  Weight,
  Hash,
  Activity,
  Calculator
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function RaceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: raceData, isLoading } = useGetRaceByIdQuery(id);
  const [calculateScores, { isLoading: isCalculating }] = useCalculateRaceScoresMutation();

  const race = raceData?.data;
  const entries = race?.entries || [];

  const handleRecalculate = async () => {
    try {
      await calculateScores(id).unwrap();
      toast.success("Analysis updated successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Calculation failed");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-8 md:py-10 px-4 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{race?.location}</h1>
            <p className="text-gray-500">{race?.date ? new Date(race.date).toLocaleDateString() : ""} • {race?.time}</p>
          </div>
        </div>
        <Button 
          onClick={handleRecalculate}
          disabled={isCalculating}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2"
        >
          <RefreshCcw className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
          {isCalculating ? "Calculating..." : "Update Analysis"}
        </Button>
      </div>

      {/* Main Analysis List */}
      <div className="space-y-4">
        {entries.map((entry: any, index: number) => (
          <Card key={entry.id} className="border-none shadow-sm rounded-2xl overflow-hidden hover:ring-2 hover:ring-blue-100 transition-all">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Ranking Section */}
                <div className={`w-full md:w-24 flex flex-col items-center justify-center py-6 border-b md:border-b-0 md:border-r border-gray-50 ${
                  entry.rank === 1 ? 'bg-amber-50' : 
                  entry.rank === 2 ? 'bg-slate-50' : 
                  entry.rank === 3 ? 'bg-orange-50' : 'bg-gray-50/30'
                }`}>
                  <span className={`text-3xl font-black ${
                    entry.rank === 1 ? 'text-amber-600' : 
                    entry.rank === 2 ? 'text-slate-400' : 
                    entry.rank === 3 ? 'text-orange-400' : 'text-gray-300'
                  }`}>
                    {entry.rank || "-"}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Rank</span>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      <Hash className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-xl text-gray-900">{entry.horse?.name}</h3>
                        <Badge className={`
                          ${entry.category === 'BIG' ? 'bg-green-100 text-green-600' : 
                            entry.category === 'MEDIUM' ? 'bg-orange-100 text-orange-600' : 
                            entry.category === 'SMALL' ? 'bg-blue-100 text-blue-600' : 
                            'bg-gray-100 text-gray-400'} 
                          border-none rounded-full px-3 py-0.5 font-bold text-[10px]
                        `}>
                          {entry.category || "N/A"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          <span>{entry.jockeyName || "Unknown Jockey"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Weight className="w-3.5 h-3.5 text-gray-400" />
                          <span>{entry.weight} kg</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Power Metrics */}
                  <div className="flex items-center gap-6 lg:border-l lg:pl-8 border-gray-100">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-gray-400 uppercase">H-Power</span>
                      <span className="text-lg font-bold text-gray-900">{entry.horsePower?.toFixed(1) || "-"}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-gray-400 uppercase">J-Power</span>
                      <span className="text-lg font-bold text-gray-900">{entry.jockeyPower?.toFixed(1) || "-"}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="p-3 rounded-2xl bg-blue-600 text-white flex flex-col items-center min-w-[80px]">
                        <span className="text-[10px] font-bold opacity-80 uppercase">Score</span>
                        <span className="text-2xl font-black">{Math.round(entry.normalizedScore || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
