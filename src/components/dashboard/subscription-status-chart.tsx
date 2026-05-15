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
  { name: "Free", value: 75, color: "#64748b" },
  { name: "Paid", value: 25, color: "#8b5cf6" },
];

export function SubscriptionStatusChart() {
  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Subscription Status</CardTitle>
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
          <div className="absolute top-[25%] left-[30%] text-[12px] font-medium text-gray-500">
            Free 75%
          </div>
          <div className="absolute bottom-[30%] right-[30%] text-[12px] font-medium text-purple-600">
            Paid 25%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
