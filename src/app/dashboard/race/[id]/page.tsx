"use client";

import { useState } from "react";
import { useGetRaceByIdQuery, useCalculateRaceScoresMutation } from "@/redux/features/race/raceApi";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  RefreshCcw, 
  Trophy, 
  User, 
  Weight,
  Hash,
  Calculator,
  AlertCircle,
  BrainCircuit,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Percent,
  TrendingUp
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function RaceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [expandedAnalysis, setExpandedAnalysis] = useState<Record<string, boolean>>({});

  const toggleAnalysis = (entryId: string) => {
    setExpandedAnalysis(prev => ({
      ...prev,
      [entryId]: !prev[entryId]
    }));
  };

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
        {entries.length === 0 && race?.predictionMessage ? (
          <div className="p-8 text-center space-y-4 bg-amber-50/50 border border-amber-200/60 rounded-2xl shadow-sm max-w-2xl mx-auto">
            <div className="p-4 bg-amber-100/80 rounded-full w-fit mx-auto text-amber-600">
              <AlertCircle className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-xl text-amber-900">AI Predictions Pending</h3>
              <p className="text-amber-800 text-sm bg-white/80 p-4 rounded-xl border border-amber-100 shadow-inner inline-block font-medium">
                {race.predictionMessage}
              </p>
              <p className="text-amber-600/80 text-xs">
                The AI Prediction API is scheduled to publish predictions. This page will update automatically once they are ready, or you can try to update the analysis manually.
              </p>
            </div>
          </div>
        ) : entries.length > 0 ? (
          entries.map((entry: any, index: number) => (
            <Card key={entry.id} className="border-none shadow-sm rounded-2xl overflow-hidden hover:ring-2 hover:ring-blue-100 transition-all">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Ranking Section */}
                  <div className={`w-full md:w-24 flex flex-col items-center justify-center py-6 border-b md:border-b-0 md:border-r border-gray-50/50 ${
                    entry.rank === 1 ? 'bg-amber-50/60' : 
                    entry.rank === 2 ? 'bg-slate-50/60' : 
                    entry.rank === 3 ? 'bg-orange-50/60' : 'bg-gray-50/30'
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

                  {/* Content & Actions Section */}
                  <div className="flex-1 flex flex-col justify-between">
                    {/* Top part with Details & Power Metrics */}
                    <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                          <Hash className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-1 flex-1">
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
                              <span>{entry.weight} lbs</span>
                            </div>
                          </div>

                          {/* AI Predictions Badge Grid */}
                          {(entry.winProb !== null || entry.aiSelectionRank !== null || entry.aiConfidence !== null) && (
                            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2 items-center">
                              {entry.aiSelectionRank !== null && (
                                <Badge variant="outline" className="border-blue-200 bg-blue-50/50 text-blue-700 font-semibold gap-1 py-1 px-2.5 rounded-lg text-xs">
                                  <Trophy className="w-3.5 h-3.5 text-blue-500" />
                                  AI Rank: #{entry.aiSelectionRank}
                                </Badge>
                              )}
                              {entry.winProb !== null && (
                                <Badge variant="outline" className="border-emerald-200 bg-emerald-50/50 text-emerald-700 font-semibold gap-1 py-1 px-2.5 rounded-lg text-xs">
                                  <Percent className="w-3.5 h-3.5 text-emerald-500" />
                                  Win Prob: {(entry.winProb * 100).toFixed(1)}%
                                </Badge>
                              )}
                              {entry.winOddsFair !== null && (
                                <Badge variant="outline" className="border-amber-200 bg-amber-50/50 text-amber-700 font-semibold gap-1 py-1 px-2.5 rounded-lg text-xs">
                                  <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                                  Fair Odds: {entry.winOddsFair.toFixed(2)}
                                </Badge>
                              )}
                              {entry.aiConfidence !== null && (
                                <Badge variant="outline" className="border-purple-200 bg-purple-50/50 text-purple-700 font-semibold gap-1 py-1 px-2.5 rounded-lg text-xs">
                                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                                  Confidence: {entry.aiConfidence} ({entry.aiConfidenceScore ? `${(entry.aiConfidenceScore * 100).toFixed(0)}%` : 'N/A'})
                                </Badge>
                              )}
                              {entry.aiAnalysis && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => toggleAnalysis(entry.id)}
                                  className="h-7 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium px-2 py-0.5 rounded-lg flex items-center gap-1 ml-auto animate-pulse"
                                >
                                  <BrainCircuit className="w-3.5 h-3.5" />
                                  {expandedAnalysis[entry.id] ? "Hide Analysis" : "AI Analysis"}
                                  {expandedAnalysis[entry.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Power Metrics */}
                      <div className="flex items-center gap-6 lg:border-l lg:pl-8 border-gray-100 shrink-0">
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

                    {/* Bottom part with AI analysis (if expanded) */}
                    {expandedAnalysis[entry.id] && entry.aiAnalysis && (
                      <div className="px-6 pb-6 border-t border-gray-100/50 pt-4 bg-indigo-50/20">
                        <div className="flex items-center gap-2 mb-2 font-bold text-indigo-900 text-xs uppercase tracking-wider">
                          <BrainCircuit className="w-4 h-4 text-indigo-600 animate-pulse" />
                          AI Insights & Prediction Analysis
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed font-medium">
                          {entry.aiAnalysis}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-20 text-center space-y-4 bg-white rounded-2xl shadow-sm">
            <div className="p-4 bg-gray-50 rounded-full w-fit mx-auto animate-pulse">
              <Calculator className="w-10 h-10 text-gray-300" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-gray-900">No race entries analyzed</h3>
              <p className="text-gray-500 max-w-sm mx-auto text-sm">This race currently has no runners or analysis scores computed. Please click "Update Analysis" to compute scores.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
