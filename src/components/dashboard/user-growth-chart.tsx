"use client";

import { 
  Line, 
  LineChart, 
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
  { month: "Jan", users: 8000 },
  { month: "Feb", users: 9500 },
  { month: "Mar", users: 10500 },
  { month: "Apr", users: 11800 },
  { month: "May", users: 13000 },
];

export function UserGrowthChart() {
  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">User Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                domain={[0, 14000]}
                ticks={[0, 3500, 7000, 10500, 14000]}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                }} 
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-blue-500 font-medium">Users</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
