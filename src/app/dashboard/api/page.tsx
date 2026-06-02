"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  Database, 
  AlertCircle, 
  RefreshCw,
  Loader2,
  ShieldAlert,
  Server,
  ToggleLeft
} from "lucide-react";
import { 
  useGetApiStatsQuery, 
  useGetLockdownStatusQuery, 
  useEnableLockdownMutation, 
  useDisableLockdownMutation 
} from "@/redux/features/system/systemApi";
import { useSyncRacesMutation } from "@/redux/features/race/raceApi";
import { toast } from "sonner";

export default function ApiManagementPage() {
  const { data: statsResponse, isLoading: isStatsLoading, refetch: refetchStats } = useGetApiStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: lockdownResponse, isLoading: isLockdownLoading } = useGetLockdownStatusQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  
  const [syncRaces, { isLoading: isSyncing }] = useSyncRacesMutation();
  const [enableLockdown, { isLoading: isLocking }] = useEnableLockdownMutation();
  const [disableLockdown, { isLoading: isUnlocking }] = useDisableLockdownMutation();

  const stats = statsResponse?.data;
  const lockdown = lockdownResponse?.data || { isLocked: false, lastResultUpdate: null };

  const handleSync = async () => {
    try {
      await syncRaces({}).unwrap();
      toast.success("Races synchronized successfully");
      refetchStats();
    } catch (err: any) {
      toast.error(err?.data?.message || "Sync failed");
    }
  };

  const handleToggleLockdown = async () => {
    try {
      if (lockdown.isLocked) {
        await disableLockdown({}).unwrap();
        toast.success("Lockdown disabled. System is now open.");
      } else {
        await enableLockdown({}).unwrap();
        toast.success("Saturday Lockdown enabled. Mutations are now blocked.");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Lockdown update failed");
    }
  };

  const formatLastSync = (dateStr?: string | null) => {
    if (!dateStr) return "Never";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const metrics = [
    {
      label: "API Connection",
      value: stats?.metrics?.status || "Inactive",
      icon: CheckCircle,
      iconColor: stats?.metrics?.status === "Active" ? "text-green-500" : "text-gray-400",
      iconBg: stats?.metrics?.status === "Active" ? "bg-green-100" : "bg-gray-100",
    },
    {
      label: "Last Sync Run",
      value: formatLastSync(stats?.metrics?.lastSync),
      icon: Clock,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-100",
    },
    {
      label: "Total Synced Races",
      value: (stats?.metrics?.totalRacesSynced ?? 0).toLocaleString(),
      icon: Database,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    {
      label: "Total Synced Entries",
      value: (stats?.metrics?.totalEntriesSynced ?? 0).toLocaleString(),
      icon: Server,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-100",
    },
  ];

  const endpoints = [
    { name: "Today's Racecards", path: "/races/today", method: "GET" },
    { name: "Race Details", path: "/races/{id}", method: "GET" },
    { name: "AI Race Predictions", path: "/predictions/race/{id}", method: "GET" },
  ];

  return (
    <div className="flex flex-col gap-8 py-8 md:py-10 px-4 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">API Management</h1>
        <Button 
          onClick={handleSync}
          disabled={isSyncing}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 px-6 flex items-center gap-2"
        >
          {isSyncing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Synchronizing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Sync Upcoming Races
            </>
          )}
        </Button>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-none shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                  {isStatsLoading ? (
                    <div className="h-7 w-20 bg-gray-100 animate-pulse rounded-lg mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  )}
                </div>
                <div className={`p-3 rounded-xl ${metric.iconBg}`}>
                  <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Saturday Lockdown Control Card */}
      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-50">
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-900">
            <ShieldAlert className="w-5 h-5 text-purple-600" />
            Saturday Lockdown Override
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6 bg-white">
          {isLockdownLoading ? (
            <div className="py-6 flex justify-center items-center">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            </div>
          ) : lockdown.isLocked ? (
            <div className="p-5 rounded-2xl border border-red-200 bg-red-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-red-700 font-bold">
                  <AlertCircle className="w-5 h-5" />
                  System Lockdown is ACTIVE
                </div>
                <p className="text-xs text-red-600 font-medium">
                  Mobile applications cannot modify data, register new devices, or purchase subscriptions. 
                  Last status update: {formatLastSync(lockdown.lastResultUpdate)}.
                </p>
              </div>
              <Button 
                onClick={handleToggleLockdown}
                disabled={isLocking || isUnlocking}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl py-6 px-6 font-semibold"
              >
                Disable Saturday Lockdown
              </Button>
            </div>
          ) : (
            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle className="w-5 h-5" />
                  System is OPEN
                </div>
                <p className="text-xs text-emerald-600 font-medium">
                  All platform APIs, registrations, and subscription processing routes are working normally.
                </p>
              </div>
              <Button 
                onClick={handleToggleLockdown}
                disabled={isLocking || isUnlocking}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-6 px-6 font-semibold"
              >
                Enable Saturday Lockdown
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Card */}
      <Card className="border-none shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Rapid API Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">API Base URL</label>
              <Input 
                defaultValue="https://ai-horse-racing-predictions.p.rapidapi.com" 
                className="py-6 rounded-xl bg-gray-50/50 border-gray-100"
                disabled
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">API Key (RAPID_API_SECRET_KEY)</label>
              <Input 
                type="password" 
                defaultValue="••••••••••••••••••••" 
                className="py-6 rounded-xl bg-gray-50/50 border-gray-100"
                disabled
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">Sync Mode</label>
            <Input 
              defaultValue="Hybrid (Rapid API + Cached local JSON Fallback)" 
              className="py-6 rounded-xl bg-gray-50/50 border-gray-100"
              disabled
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* API Endpoints Card */}
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Involved API Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {endpoints.map((endpoint, index) => (
                <div key={index} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-800">{endpoint.name}</h3>
                    <p className="text-[13px] text-gray-400 font-mono">{endpoint.path}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-600 border-none rounded-full px-3 py-0.5 text-[10px] font-bold">
                      {endpoint.method}
                    </Badge>
                    <Badge className="bg-green-100 text-green-600 border-none rounded-full px-3 py-0.5 text-[10px] font-bold">
                      ACTIVE
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Syncs Card */}
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recent Sync Batches</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {isStatsLoading ? (
                <div className="p-5 text-center text-gray-400 font-medium">Loading sync history...</div>
              ) : stats?.syncs && stats.syncs.length > 0 ? (
                stats.syncs.map((sync: any, index: number) => (
                  <div key={index} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="space-y-1">
                      <h3 className="font-bold text-gray-800">{sync.name}</h3>
                      <p className="text-[13px] text-gray-400">{formatLastSync(sync.time)}</p>
                      <p className="text-[13px] text-gray-500 font-medium">{sync.result}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-600 border-none rounded-full px-3 py-0.5 text-[11px] font-medium">
                      SUCCESS
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-gray-400 font-medium">No sync batches performed yet. Click the "Sync" button above to run.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
