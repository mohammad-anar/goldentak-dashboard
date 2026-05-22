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

interface SubscriptionStatusChartProps {
  data?: { name: string; value: number; color: string }[];
}

export function SubscriptionStatusChart({ data = [] }: SubscriptionStatusChartProps) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const freeItem = data.find((d) => d.name === "Free");
  const paidItem = data.find((d) => d.name === "Paid");
  const freePercent = total > 0 && freeItem ? Math.round((freeItem.value / total) * 100) : 0;
  const paidPercent = total > 0 && paidItem ? Math.round((paidItem.value / total) * 100) : 0;

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
            Free {freePercent}% ({freeItem?.value || 0})
          </div>
          <div className="absolute bottom-[30%] right-[30%] text-[12px] font-medium text-purple-600">
            Paid {paidPercent}% ({paidItem?.value || 0})
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

