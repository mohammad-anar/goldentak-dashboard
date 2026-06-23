"use client";

import { useEffect, useState } from "react";
import { 
  Pie, 
  PieChart, 
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PlatformDistributionChartProps {
  data?: { name: string; value: number; color: string }[];
}

export function PlatformDistributionChart({ data = [] }: PlatformDistributionChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="border-none shadow-sm h-full">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Platform Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="h-[300px] w-full bg-gray-50/50 rounded-2xl animate-pulse" />
        </CardContent>
      </Card>
    );
  }
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const iosItem = data.find((d) => d.name === "iOS");
  const androidItem = data.find((d) => d.name === "Android");
  const iosPercent = total > 0 && iosItem ? Math.round((iosItem.value / total) * 100) : 0;
  const androidPercent = total > 0 && androidItem ? Math.round((androidItem.value / total) * 100) : 0;

  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Platform Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="h-[300px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                }} 
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={100}
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Labels */}
          <div className="absolute top-[20%] right-[25%] text-[12px] font-medium text-indigo-600">
            iOS {iosPercent}% ({iosItem?.value || 0})
          </div>
          <div className="absolute bottom-[20%] right-[30%] text-[12px] font-medium text-pink-600">
            Android {androidPercent}% ({androidItem?.value || 0})
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

