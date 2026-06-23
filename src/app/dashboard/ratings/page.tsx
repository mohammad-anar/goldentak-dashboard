"use client";

import { useState, useMemo } from "react";
import { useGetRatingsQuery } from "@/redux/features/rating/ratingApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Star, 
  Search, 
  Filter, 
  Loader2, 
  MessageSquare, 
  Smartphone,
  Calendar
} from "lucide-react";

export default function RatingsPage() {
  const { data: response, isLoading } = useGetRatingsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [starFilter, setStarFilter] = useState("all");

  const ratings = response?.data || [];

  // Compute aggregate statistics
  const stats = useMemo(() => {
    if (ratings.length === 0) {
      return {
        avgRating: 0,
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const total = ratings.length;
    let sum = 0;
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    ratings.forEach((item: any) => {
      const r = Math.min(5, Math.max(1, item.rating)) as 5 | 4 | 3 | 2 | 1;
      sum += r;
      dist[r] = (dist[r] || 0) + 1;
    });

    return {
      avgRating: Number((sum / total).toFixed(1)),
      total,
      distribution: dist
    };
  }, [ratings]);

  // Filtered ratings
  const filteredRatings = useMemo(() => {
    return ratings.filter((item: any) => {
      const matchesSearch = 
        item.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.comment && item.comment.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStar = 
        starFilter === "all" || 
        item.rating.toString() === starFilter;

      return matchesSearch && matchesStar;
    });
  }, [ratings, searchTerm, starFilter]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < count ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} 
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px] gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <span className="text-gray-500 font-medium">Loading user feedback...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-8 md:py-10 px-4 lg:px-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Feedbacks & Ratings</h1>
        <p className="text-gray-500 mt-1">Monitor app store/ratings feedback from mobile clients.</p>
      </div>

      {/* Aggregate Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Rating Score Card */}
        <Card className="border-none shadow-sm rounded-2xl bg-white flex flex-col justify-between overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Average Rating</CardTitle>
          </CardHeader>
          <CardContent className="py-2 flex items-center gap-6">
            <div className="text-6xl font-black text-gray-900">{stats.avgRating}</div>
            <div>
              {renderStars(Math.round(stats.avgRating))}
              <p className="text-xs text-gray-400 mt-1.5 font-medium">Based on {stats.total} entries</p>
            </div>
          </CardContent>
          <div className="bg-amber-500/10 h-1.5 w-full mt-auto" />
        </Card>

        {/* Rating Breakdown / Progress Chart */}
        <Card className="border-none shadow-sm rounded-2xl bg-white md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Star Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {([5, 4, 3, 2, 1] as const).map((stars) => {
              const count = stats.distribution[stars] || 0;
              const percent = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={stars} className="flex items-center gap-4 text-xs font-semibold">
                  <span className="w-12 text-gray-500 flex items-center gap-1 font-bold">
                    {stars} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-gray-500">{count} ({percent}%)</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Control Bar (Search, Filtering, etc.) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search by Device ID or comment content..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 pr-4 bg-gray-50/50 border-gray-200 focus:border-amber-300 focus:ring focus:ring-amber-100 rounded-xl py-5 text-sm"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Rating:</span>
          </div>
          <Select 
            value={starFilter} 
            onValueChange={setStarFilter}
          >
            <SelectTrigger className="w-[180px] rounded-xl bg-gray-50/50 border-gray-200">
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-100 shadow-lg">
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/40 border-b border-gray-100">
              <TableRow className="border-none">
                <TableHead className="font-bold text-[13px] text-gray-400 py-5 px-6 uppercase">Device ID</TableHead>
                <TableHead className="font-bold text-[13px] text-gray-400 py-5 px-6 uppercase text-center">Rating Stars</TableHead>
                <TableHead className="font-bold text-[13px] text-gray-400 py-5 px-6 uppercase">User Comment / Feedback</TableHead>
                <TableHead className="font-bold text-[13px] text-gray-400 py-5 px-6 uppercase">Submitted Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRatings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-20 text-gray-400 font-medium">
                    No rating entries found matching the criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRatings.map((item: any) => (
                  <TableRow key={item.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                    <TableCell className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="font-mono text-xs font-semibold text-gray-800 tracking-tight">
                          {item.deviceId}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-5 px-6">
                      <div className="flex justify-center">
                        {renderStars(item.rating)}
                      </div>
                    </TableCell>
                    <TableCell className="py-5 px-6">
                      {item.comment ? (
                        <div className="flex items-start gap-2.5 max-w-xl">
                          <MessageSquare className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                          <span className="text-sm font-medium text-gray-700 leading-relaxed">
                            {item.comment}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs italic text-gray-400">No comment provided</span>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-500 py-5 px-6 text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
