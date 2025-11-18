"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useProject } from "@/context/ProjectContext";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

// Dynamically import the Gantt chart component to avoid SSR issues
const ClientGantt = dynamic(
  () => import("./ClientGantt"),
  { ssr: false }
);

export default function SchedulePage() {
  const { selectedProject } = useProject();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState(null);

  // Load schedule data
  useEffect(() => {
    if (selectedProject?.id) {
      loadScheduleData();
    }
  }, [selectedProject]);

  const loadScheduleData = async () => {
    if (!selectedProject?.id) return;
    
    setLoading(true);
    try {
      // Fetch schedule data from Supabase
      const { data, error } = await supabase
        .from('project_schedules')
        .select('data')
        .eq('project_id', selectedProject.id)
        .single();

      if (error) throw error;

      if (data?.data) {
        setScheduleData(data);
        setTasks(data.data);
      }
    } catch (error) {
      console.error("Error loading schedule:", error);
      toast.error("Failed to load schedule data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-7 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading schedule data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-7">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Project Schedule</h1>
            <p className="text-sm text-gray-500">
              View and manage your project timeline
            </p>
          </div>
          <Button onClick={loadScheduleData} variant="outline">
            Refresh
          </Button>
        </div>

        {/* Gantt Chart */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          {tasks.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Project Timeline</h2>
                <div className="text-sm text-gray-500">
                  {tasks.length} tasks
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <ClientGantt data={tasks} />
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No schedule data</h3>
              <p className="mt-1 text-sm text-gray-500">
                Upload a schedule to get started.
              </p>
            </div>
          )}
        </div>

        {/* Task Summary */}
        {tasks.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h2 className="text-lg font-semibold mb-4">Task Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-700">Total Tasks</p>
                <p className="text-2xl font-bold text-blue-600">{tasks.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-700">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {tasks.filter(t => t.progress === 100).length}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-yellow-700">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {tasks.filter(t => t.progress > 0 && t.progress < 100).length}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Not Started</p>
                <p className="text-2xl font-bold text-gray-600">
                  {tasks.filter(t => t.progress === 0).length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}