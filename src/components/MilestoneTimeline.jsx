"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// MilestoneTimeline.jsx
const MilestoneTimeline = () => {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [milestones, setMilestones] = useState([
    {
      id: 1,
      category: "Pre-Construction",
      status: "Completed",
      statusColor: "bg-green-500",
      title: "Permit Approvals & Site Mobilization",
      targetDate: "Sep 30, 2025",
      completedDate: "Sep 30, 2025",
      description: "All permits approved and site mobilization complete",
      day: "Day 15",
      isCompleted: true
    },
    {
      id: 2,
      category: "Foundation",
      status: "On Track",
      statusColor: "bg-blue-500",
      title: "Foundation Formwork & Rebar Complete",
      targetDate: "Oct 14, 2025",
      description: "Tracking on schedule for completion",
      day: "Day 29",
      isCompleted: false
    },
    {
      id: 3,
      category: "Structure",
      status: "On Track",
      statusColor: "bg-blue-500",
      title: "Steel Erection - Level 1 Complete",
      targetDate: "Oct 24, 2025",
      description: "Tracking on schedule for completion",
      day: "Day 39",
      isCompleted: false
    },
    {
      id: 4,
      category: "MEP Systems",
      status: "At Risk",
      statusColor: "bg-orange-500",
      title: "MEP Rough-in Inspection Approved",
      targetDate: "Oct 20, 2025",
      description: "Potential delay - monitoring closely",
      day: "Day 35",
      isCompleted: false
    },
    {
      id: 5,
      category: "Envelope",
      status: "On Track",
      statusColor: "bg-blue-500",
      title: "Building Envelope Completion",
      targetDate: "Nov 15, 2025",
      description: "Tracking on schedule for completion",
      day: "Day 61",
      isCompleted: false
    },
    {
      id: 6,
      category: "Interior Finishes",
      status: "On Track",
      statusColor: "bg-blue-500",
      title: "Interior Finishes - 50% Complete",
      targetDate: "Dec 1, 2025",
      description: "Tracking on schedule for completion",
      day: "Day 77",
      isCompleted: false
    },
    {
      id: 7,
      category: "Final",
      status: "On Track",
      statusColor: "bg-blue-500",
      title: "Final Inspection & Certificate of Occupancy",
      targetDate: "Jan 15, 2026",
      description: "Tracking on schedule for completion",
      day: "Day 122",
      isCompleted: false
    }
  ]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!supabase) return; // no env configured -> keep static
      setLoading(true);
      // NOTE: Replace with actual project_id filtering when wired
      const { data, error } = await supabase
        .from("milestones")
        .select("id, category, status, title, target_date, completed_date, description, day_label, is_completed")
        .order("sort_index", { ascending: true });
      if (!isMounted) return;
      if (!error && Array.isArray(data) && data.length) {
        const mapped = data.map((m) => ({
          id: m.id,
          category: m.category,
          status: m.status,
          statusColor: m.status === 'Completed' ? 'bg-green-500' : m.status === 'On Track' ? 'bg-blue-500' : 'bg-orange-500',
          title: m.title,
          targetDate: m.target_date || null,
          completedDate: m.completed_date || null,
          description: m.description || '',
          day: m.day_label || '',
          isCompleted: !!m.is_completed,
        }));
        setMilestones(mapped);
      }
      setLoading(false);
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  function openDetails(milestone) {
    setSelected(milestone);
  }

  function closeDetails() {
    setSelected(null);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Project Milestone Timeline
      </h2>
      
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50">
            <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-transparent rounded-full"></div>
          </div>
        )}
        {/* Vertical Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>
        
        <div className="space-y-8">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="relative flex items-start">
              {/* Timeline Flag Icon */}
              <div className="relative z-10 flex-shrink-0">
                <div className={`w-12 h-12 ${milestone.statusColor} rounded-full flex items-center justify-center border-4 border-white shadow-sm`}>
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 3h18l-3 9H6l-3-9zM6 15h12v2H6v-2z"/>
                  </svg>
                </div>
              </div>
              
              {/* Milestone Card */}
              <button
                type="button"
                onClick={() => openDetails(milestone)}
                className="ml-6 flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4 text-left hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded">
                      {milestone.category}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium text-white rounded ${
                      milestone.status === 'Completed' ? 'bg-green-500' :
                      milestone.status === 'On Track' ? 'bg-blue-500' :
                      'bg-orange-500'
                    }`}>
                      {milestone.status}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {milestone.day}
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">
                  {milestone.title}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Target: {milestone.targetDate}</span>
                  </div>
                  {milestone.completedDate && (
                    <div className="flex items-center gap-1">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Completed: {milestone.completedDate}</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-2">
                  <p className="text-sm text-gray-600">
                    {milestone.description}
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 cursor-pointer" onClick={closeDetails}></div>
          <div className="relative z-10 w-full max-w-xl bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded">{selected.category}</span>
                  <span className={`px-2 py-1 text-xs font-medium text-white rounded ${
                    selected.status === 'Completed' ? 'bg-green-500' :
                    selected.status === 'On Track' ? 'bg-blue-500' :
                    'bg-orange-500'
                  }`}>{selected.status}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{selected.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{selected.description}</p>
              </div>
              <button onClick={closeDetails} className="text-gray-500 hover:text-gray-700 cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Target: {selected.targetDate}</span>
              </div>
              {selected.completedDate && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Completed: {selected.completedDate}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M5 8h14" />
                </svg>
                <span>Status: {selected.isCompleted ? 'Completed' : selected.status}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                </svg>
                <span>{selected.day}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={closeDetails} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer">Close</button>
              <button onClick={closeDetails} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneTimeline;
