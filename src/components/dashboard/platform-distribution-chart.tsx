"use client";

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

const data = [
  { name: "iOS", value: 54, color: "#6366f1" },
  { name: "Android", value: 46, color: "#ec4899" },
];

export function PlatformDistributionChart() {
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
            iOS 54%
          </div>
          <div className="absolute bottom-[20%] right-[30%] text-[12px] font-medium text-pink-600">
            Android 46%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
