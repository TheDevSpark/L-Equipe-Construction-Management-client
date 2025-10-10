"use client";

import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

const chartData = [
  { name: "Completed", value: 68, fill: "#7bf1a9" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
};

export default function ProjectCompletion() {
  return (
    <Card className="flex  flex-col  ">
      <CardHeader className="items-center text-[15px] font-[200] text-gray-900 pb-0">
        <CardTitle>Project Completion</CardTitle>
     
      </CardHeader>

      <CardContent className="flex-1 max-h-[220px]  pb-0 justify-center items-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-w-md max-h-[180px]"
        >
          
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={250}
            innerRadius={80}
            outerRadius={120}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="value" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-[500]"
                        >
                          {chartData[0].value}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Complete
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

    {/* Bottom Stats */} <div className="grid grid-cols-2 gap-6  text-center">
      <div>
         <div className="text-2xl font-bold text-green-600">68%</div>
          <div className="text-sm text-gray-600">Completed</div> 
          </div>
       
          <div> 
            <div className="text-2xl font-bold text-gray-400">32%</div>
             <div className="text-sm text-gray-600">
      Remaining</div> 
    </div>
     </div>
    </Card>
  );
}
