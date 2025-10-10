"use client";
import { CheckCircle } from "lucide-react";
import { LineChart as LineChartIcon } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProgressTracking() {
  const weeks = [
    { week: "Week 1", actual: 12, planned: 10 },
    { week: "Week 2", actual: 22, planned: 20 },
    { week: "Week 3", actual: 28, planned: 30 },
    { week: "Week 4", actual: 38, planned: 40 },
    { week: "Week 5", actual: 48, planned: 50 },
    { week: "Week 6", actual: 58, planned: 60 },
    { week: "Week 7", actual: 68, planned: 68 },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className=" items-center text-[15px] font-[200] text-gray-900 pb-0">
            <CardTitle>Progress Tracking</CardTitle>
     
          </div>
        
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weeks} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickFormatter={(value) => value.replace("Week ", "W")}
            />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} domain={[0, 80]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-sm text-gray-600">{value}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", r: 4 }}
              name="Actual"
            />
            <Line
              type="monotone"
              dataKey="planned"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={{ fill: "#60a5fa", r: 4 }}
              name="Planned"
            />
          </LineChart>
        </ResponsiveContainer>

         <div className="flex items-center gap-2 border border-green-200 bg-green-50 text-green-900 text-[12px] rounded-lg px-4 py-2">
      <CheckCircle className="w-4 h-4 text-green-900" />
      <p>Project is tracking on schedule with planned milestones</p>
    </div>
      </CardContent>
    </Card>
  );
}
