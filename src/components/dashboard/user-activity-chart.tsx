"use client";

import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
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
  { name: "Active", value: 8200 },
  { name: "Passive", value: 4250 },
];

export function UserActivityChart() {
  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">User Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
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
                domain={[0, 10000]}
                ticks={[0, 2500, 5000, 7500, 10000]}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                }} 
              />
              <Bar 
                dataKey="value" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]} 
                barSize={120}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
