"use client";
import React, { useState, useMemo } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";

// Helper to convert Excel serial date to JS Date
function excelDateToJSDate(serial) {
  if (typeof serial !== "number") return new Date(serial);
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400;
  const dateInfo = new Date(utcValue * 1000);
  return dateInfo;
}

export default function ClientGantt({ data }) {
  if (!data || data.length === 0) return <p>No schedule data</p>;

  // Convert to Gantt format
  const allTasks = useMemo(
    () =>
      data.map((t, i) => {
        const start = t.start ? excelDateToJSDate(t.start) : new Date();
        const end = t.end ? excelDateToJSDate(t.end) : new Date();

        return {
          start,
          end,
          name: t.name || `Task ${i + 1}`,
          id: String(i),
          progress: t.progress || 0,
          type: "task",
        };
      }),
    [data]
  );

  // Set height based on all tasks
  const chartHeight = Math.max(allTasks.length * 45 + 100, 600);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => {
    const elem = document.getElementById("gantt-container");
    if (!document.fullscreenElement) {
      elem?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handlePrint = () => {
    // Get the current scroll position
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    
    // Temporarily make the container full width and height for printing
    const ganttContainer = document.getElementById("gantt-container");
    const originalStyles = {
      width: ganttContainer.style.width,
      height: ganttContainer.style.height,
      overflow: ganttContainer.style.overflow,
      padding: ganttContainer.style.padding,
      border: ganttContainer.style.border,
      borderRadius: ganttContainer.style.borderRadius,
    };

    // Apply print styles
    ganttContainer.style.width = '100%';
    ganttContainer.style.height = 'auto';
    ganttContainer.style.overflow = 'visible';
    ganttContainer.style.padding = '0';
    ganttContainer.style.border = 'none';
    ganttContainer.style.borderRadius = '0';

    // Get the Gantt chart container and adjust its styles
    const ganttChart = ganttContainer.querySelector('.gantt-container');
    if (ganttChart) {
      ganttChart.style.height = 'auto';
      ganttChart.style.overflow = 'visible';
      ganttChart.style.width = '100%';
    }

    // Create print window
    const newWindow = window.open('', '_blank');
    
    // Add print styles
    newWindow.document.write(`
      <html>
        <head>
          <title>Project Gantt Chart</title>
          <link rel="stylesheet" href="https://unpkg.com/gantt-task-react/dist/index.css" />
          <style>
            @page { 
              size: auto;  /* auto is the initial value */
              margin: 0mm; /* this affects the margin in the printer settings */
            }
            body { 
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .gantt-container {
              width: 100% !important;
              height: auto !important;
              overflow: visible !important;
              transform: none !important;
            }
            .gantt-task-content {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .gantt-task-list-item {
              page-break-inside: avoid;
            }
            @media print {
              .no-print {
                display: none !important;
              }
              .gantt-container {
                overflow: visible !important;
                height: auto !important;
              }
              .gantt-vertical-scroll {
                overflow: visible !important;
                height: auto !important;
              }
              .gantt-horizontal-scroll {
                overflow: visible !important;
                width: 100% !important;
              }
              .gantt-task-list {
                width: 100% !important;
              }
            }
          </style>
        </head>
        <body>
          <div style="width: 100%; overflow: visible;">
            ${ganttContainer.outerHTML}
          </div>
          <script>
            // Wait for fonts and images to load
            window.onload = function() {
              // Set a small delay to ensure everything is rendered
              setTimeout(() => {
                window.print();
                // Close the window after printing
                window.onafterprint = function() {
                  window.close();
                };
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    
    // Close the document to finish loading
    newWindow.document.close();
    
    // Restore original styles after a delay
    setTimeout(() => {
      if (ganttContainer) {
        Object.assign(ganttContainer.style, originalStyles);
      }
      if (ganttChart) {
        ganttChart.style.height = '';
        ganttChart.style.overflow = '';
        ganttChart.style.width = '';
      }
      window.scrollTo(scrollX, scrollY);
    }, 1000);
  };

  return (
    <div
      id="gantt-container"
      className="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg bg-white"
    >
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-base font-semibold">📊 Gantt Chart</h4>
        <div className="flex gap-2">
          <button
            onClick={handleFullscreen}
            className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            🖨 Print
          </button>
        </div>
      </div>

      {/* Gantt Chart */}
      <div 
        style={{ 
          height: '70vh',
          background: "white",
          border: '1px solid #eee',
          borderRadius: '4px',
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        className="gantt-print-container"
      >
        <div style={{ 
          flex: '1 1 auto',
          overflow: 'auto',
          position: 'relative'
        }}>
          <div style={{
            minWidth: 'fit-content',
            minHeight: '100%'
          }}>
            <Gantt
              tasks={allTasks}
              viewMode={ViewMode.Week}
              listCellWidth="180px"
              columnWidth={65}
              barFill={60}
              barCornerRadius={4}
              rowHeight={45}
              ganttHeight={0} // This makes the Gantt chart take the height of its container
            />
          </div>
        </div>
      </div>
    </div>
  );
}
