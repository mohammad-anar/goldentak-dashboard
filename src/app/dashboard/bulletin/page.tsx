"use client";

import { useGetRacesQuery } from "@/redux/features/race/raceApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  MapPin, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Search,
  Filter,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function BulletinPage() {
  const { data: racesData, isLoading } = useGetRacesQuery({});
  const [syncRaces, { isLoading: isSyncing }] = useSyncRacesMutation();
  const races = racesData?.data || [];

  const handleSync = async () => {
    try {
      await syncRaces({}).unwrap();
      toast.success("Race data synchronized successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Sync failed");
    }
  };

  return (
    <div className="flex flex-col gap-8 py-8 md:py-10 px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">Race Bulletin</h1>
          <p className="text-gray-500">Live race schedule and analysis bulletins.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleSync}
            disabled={isSyncing}
            className="rounded-xl flex items-center gap-2 border-blue-100 text-blue-600 hover:bg-blue-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? "Syncing..." : "Sync Data"}
          </Button>
          <Button variant="outline" className="rounded-xl flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Today
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        <Input 
          placeholder="Search races, tracks or horses..." 
          className="pl-12 py-6 rounded-2xl border-none shadow-sm bg-white focus-visible:ring-2 focus-visible:ring-blue-100 transition-all text-lg"
        />
      </div>

      {/* Race Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))
        ) : races.length > 0 ? (
          races.map((race: any) => (
            <Link key={race.id} href={`/dashboard/race/${race.id}`}>
              <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-2xl group cursor-pointer overflow-hidden bg-white">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-bold text-gray-900">{race.time}</span>
                    </div>
                    <Badge className={`
                      ${race.status === 'LIVE' ? 'bg-red-100 text-red-600' : 
                        race.status === 'FINISHED' ? 'bg-gray-100 text-gray-600' : 
                        'bg-blue-100 text-blue-600'} 
                      border-none rounded-full px-3 py-1 font-bold text-[10px] uppercase
                    `}>
                      {race.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-bold text-lg">{race.location}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400 pl-6">
                      <span>{race.trackType || "Turf"}</span>
                      <span>•</span>
                      <span>{race.distance || "1200m"}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between group-hover:px-1 transition-all">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                          H
                        </div>
                      ))}
                      <div className="pl-4 text-xs text-gray-400 font-medium">
                        +{race._count?.entries || 0} Runners
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="p-4 bg-gray-50 rounded-full w-fit mx-auto">
              <CalendarIcon className="w-10 h-10 text-gray-300" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-gray-900">No races found</h3>
              <p className="text-gray-500">There are no races scheduled for the selected date.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
