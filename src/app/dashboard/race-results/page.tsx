"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Clock, 
  MapPin, 
  Trophy, 
  TrendingUp,
  Calendar
} from "lucide-react";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

const todaysRaces = [
  {
    time: "14:00",
    location: "Istanbul",
    distance: "1600m",
    status: "Completed",
    winner: "Thunder Bolt",
    statusVariant: "bg-green-100 text-green-600",
  },
  {
    time: "15:30",
    location: "Ankara",
    distance: "2000m",
    status: "Completed",
    winner: "Lightning Star",
    statusVariant: "bg-green-100 text-green-600",
  },
  {
    time: "16:45",
    location: "Izmir",
    distance: "1400m",
    status: "Live",
    statusVariant: "bg-red-100 text-red-600",
  },
  {
    time: "18:00",
    location: "Istanbul",
    distance: "1800m",
    status: "Upcoming",
    statusVariant: "bg-blue-100 text-blue-600",
  },
];

const topHorses = [
  { rank: "#1", name: "Thunder Bolt", stats: "15 wins / 20 races", rate: 75 },
  { rank: "#2", name: "Lightning Star", stats: "12 wins / 18 races", rate: 67 },
  { rank: "#3", name: "Storm Runner", stats: "10 wins / 16 races", rate: 63 },
  { rank: "#4", name: "Golden Eagle", stats: "9 wins / 15 races", rate: 60 },
  { rank: "#5", name: "Silver Arrow", stats: "8 wins / 14 races", rate: 57 },
];

const trackData = [
  { name: "Istanbul", avgSpeed: 75, totalRaces: 150 },
  { name: "Ankara", avgSpeed: 68, totalRaces: 120 },
  { name: "Izmir", avgSpeed: 52, totalRaces: 95 },
  { name: "Bursa", avgSpeed: 45, totalRaces: 80 },
];

const recentResults = [
  { race: "Istanbul Cup", date: "2026-05-12", winner: "Thunder Bolt", jockey: "Ali Demir", time: "1:38.45" },
  { race: "Ankara Derby", date: "2026-05-11", winner: "Lightning Star", jockey: "Mehmet Yılmaz", time: "2:05.23" },
  { race: "Izmir Sprint", date: "2026-05-10", winner: "Storm Runner", jockey: "Ahmet Kaya", time: "1:25.67" },
  { race: "Bursa Classic", date: "2026-05-09", winner: "Golden Eagle", jockey: "Mustafa Öz", time: "1:42.89" },
];

export default function RaceResultsPage() {
  return (
    <div className="flex flex-col gap-8 py-8 md:py-10 px-4 lg:px-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900">Race Results & Statistics</h1>

      {/* Today's Races */}
      <Card className="border-none shadow-sm rounded-2xl">
        <CardHeader className="flex flex-row items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <CardTitle className="text-lg font-bold">Today&apos;s Races</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {todaysRaces.map((race, index) => (
              <div key={index} className="p-5 rounded-2xl border border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="font-bold text-gray-800">{race.time}</span>
                  </div>
                  <Badge className={`${race.statusVariant} border-none rounded-full px-3 py-0.5 text-[10px] font-bold`}>
                    {race.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[13px] text-gray-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{race.location}</span>
                  </div>
                  <p className="text-[13px] text-gray-400 pl-5">Distance: {race.distance}</p>
                </div>
                {race.winner && (
                  <div className="pt-2 border-t border-gray-50 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-orange-400" />
                    <span className="text-[14px] font-bold text-gray-700">{race.winner}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Horses */}
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center gap-2">
            <Trophy className="w-5 h-5 text-gray-400" />
            <CardTitle className="text-lg font-bold">Top Performing Horses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {topHorses.map((horse) => (
              <div key={horse.rank} className="p-5 rounded-2xl border border-gray-100 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-gray-300">{horse.rank}</span>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">{horse.name}</span>
                      <span className="text-[13px] text-gray-400">{horse.stats}</span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-green-600">{horse.rate}%</span>
                </div>
                <Progress 
                  value={horse.rate} 
                  className="h-2 bg-gray-100 [&>[data-slot=progress-indicator]]:bg-green-500" 
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Track Performance */}
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Track Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trackData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="rect"
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                  <Bar 
                    name="Avg Speed (km/h)"
                    dataKey="avgSpeed" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]} 
                    opacity={0.6}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Race Results */}
      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Recent Race Results</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-none">
                <TableHead className="font-bold text-[12px] text-gray-400 py-4 px-6 uppercase">Race</TableHead>
                <TableHead className="font-bold text-[12px] text-gray-400 py-4 px-6 uppercase">Date</TableHead>
                <TableHead className="font-bold text-[12px] text-gray-400 py-4 px-6 uppercase">Winner</TableHead>
                <TableHead className="font-bold text-[12px] text-gray-400 py-4 px-6 uppercase">Jockey</TableHead>
                <TableHead className="font-bold text-[12px] text-gray-400 py-4 px-6 uppercase">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentResults.map((result, index) => (
                <TableRow key={index} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-bold text-gray-800 py-5 px-6">{result.race}</TableCell>
                  <TableCell className="text-gray-400 py-5 px-6 font-medium">{result.date}</TableCell>
                  <TableCell className="py-5 px-6">
                    <div className="flex items-center gap-2 font-bold text-gray-700">
                      <Trophy className="w-4 h-4 text-orange-400" />
                      {result.winner}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 py-5 px-6 font-medium">{result.jockey}</TableCell>
                  <TableCell className="text-gray-900 py-5 px-6 font-bold">{result.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
