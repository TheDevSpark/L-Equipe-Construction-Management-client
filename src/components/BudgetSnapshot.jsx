"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BudgetChart = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const categories = [
    { name: "Site Work", budgeted: 450000, spent: 425000 },
    { name: "Foundation", budgeted: 680000, spent: 590000 },
    { name: "Steel", budgeted: 820000, spent: 520000 },
    { name: "MEP", budgeted: 1240000, spent: 780000 },
    { name: "Finishes", budgeted: 580000, spent: 145000 },
  ];

  const totalBudget = 3770000;
  const totalSpent = 2460000;
  const remaining = 1310000;
  const maxValue = 1400000;

  // Format numbers with commas
  const formatCurrency = (value) => {
    return value.toLocaleString();
  };

  // Format for large summary cards
  const formatLarge = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    }
    return value.toLocaleString();
  };

  const handleMouseEnter = (category, e) => {
    setHoveredCategory(category);
    setHoverPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (hoveredCategory) {
      setHoverPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-6 mt-8">
      <Card className="border-2">
        <CardHeader className="flex flex-row items-center justify-between ">
          
          <CardTitle className="text-lg md:text-[15px] mt-2 font-[400] text-gray-800 mb-1">
            Budget Snapshot (Read-Only)
          </CardTitle>
          <div className="flex items-center bg-gray-200 px-2 rounded-[10px] gap-2 text-[13px] text-gray-900">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>View Only</span>
          </div>
        </CardHeader>

        <CardContent>
          {/* Chart Section */}
          <div className="relative  rounded-lg p-6 overflow-hidden">
            <div className="relative h-[240px]">
              {/* Grid Lines */}
              <div className="absolute left-20 right-4 top-0 bottom-10 pointer-events-none">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 border-t border-dashed border-gray-300"
                    style={{ bottom: `${i * 25}%` }}
                  />
                ))}
              </div>

              {/* Y-Axis Labels */}
              <div className="absolute left-0 top-0 bottom-10 w-20 flex flex-col justify-between text-sm font-medium text-gray-700">
                <span>1,400,000</span>
                <span>1,050,000</span>
                <span>700,000</span>
                <span>350,000</span>
                <span>0</span>
              </div>

              {/* Bars Container */}
              <div className="absolute left-20 right-4 top-0 bottom-10 flex items-end justify-between px-6">
                {categories.map((category, index) => {
                  const budgetedHeight = (category.budgeted / maxValue) * 100;
                  const spentHeight = (category.spent / maxValue) * 100;

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-end w-1/6"
                    >
                      <div className="flex items-end justify-center gap-2 h-50">
                        {/* Budgeted Bar */}
                        <div
                          className="w-15 bg-[#3b82f6]  transition-all cursor-pointer hover:opacity-90"
                          style={{ height: `${budgetedHeight}%` }}
                          onMouseEnter={(e) => handleMouseEnter(category, e)}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={handleMouseLeave}
                        />
                        {/* Spent Bar */}
                        <div
                          className="w-15 bg-[#10b981]  transition-all cursor-pointer hover:opacity-90"
                          style={{ height: `${spentHeight}%` }}
                          onMouseEnter={(e) => handleMouseEnter(category, e)}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={handleMouseLeave}
                        />
                      </div>
                      {/* X-Axis Label */}
                      <div className="text-xs mt-2 text-gray-700 font-medium">
                        {category.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6  text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-[#3b82f6]"></div>
                <span className="text-[#3b82f6]">Budgeted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-[#10b981]"></div>
                <span className="text-[#10b981]">Spent</span>
              </div>
            </div>
          </div>

          {/* Tooltip */}
          {hoveredCategory && (
            <div
              className="fixed bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 z-50 pointer-events-none"
              style={{
                left: `${hoverPosition.x + 10}px`,
                top: `${hoverPosition.y - 80}px`,
              }}
            >
              <div className="font-semibold text-gray-800 mb-2">
                {hoveredCategory.name}
              </div>
              <div className="text-sm text-blue-600 mb-1">
                Budgeted: {formatCurrency(hoveredCategory.budgeted)}
              </div>
              <div className="text-sm text-green-600">
                Spent: {formatCurrency(hoveredCategory.spent)}
              </div>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="bg-blue-50 rounded-lg px-4 py-1 text-center border border-blue-100">
              <div className="text-sm mt-2 text-blue-900 mb-2 font-[400]">
                Total Budget
              </div>
              <div className="text[22px] font-[500] text-blue-900">
                {formatLarge(totalBudget)}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg px-4 py-1 text-center border border-green-100">
              <div className="text-sm mt-2 text-green-900 mb-2 font-[400]">
                Total Spent
              </div>
              <div className="text[22px] font-[500] text-green-900">
                {formatLarge(totalSpent)}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg px-4 py-1 text-center border border-purple-100">
              <div className="text-sm mt-2 text-purple-900 mb-2 font-[400]">
                Remaining
              </div>
              <div className="text[22px] font-[500] text-purple-900">
                {formatLarge(remaining)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetChart;
