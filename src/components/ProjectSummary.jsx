"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Format money utility function
const formatMoney = (amount) => {
  if (!amount && amount !== 0) return "$0";
  
  const num = typeof amount === 'string' 
    ? parseFloat(amount.replace(/[^0-9.-]+/g, "")) 
    : amount;

  if (Math.abs(num) >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  } else if (Math.abs(num) >= 1000) {
    return `$${(num / 1000).toFixed(1)}K`;
  } else {
    return `$${num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  }
};

export default function ProjectSummary({ projectId }) {
  const [summary, setSummary] = useState({
    total_daily_reports: 0,
    totalBudget: 0,
    teamMembers: 0,
    schedule: [],
    reports: [],
    budgetSummaryData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for chart data and schedule lookahead
  const [budgetData, setBudgetData] = useState({
    labels: [],
    datasets: []
  });
  const [scheduleTasks, setScheduleTasks] = useState([]);

  useEffect(() => {
    if (!projectId) return;
    
    const fetchSummary = async () => {
      try {
        setLoading(true);
        
        // Fetch project details
        const { data: projectData, error: projectError } = await supabase
          .from('project')
          .select('*')
          .eq('id', projectId)
          .single();

        if (projectError) throw projectError;

        // Fetch daily reports
        const { data: dailyReports, error: reportsError } = await supabase
          .from('daily_reports')
          .select('*')
          .eq('project_id', projectId);

        if (reportsError) throw reportsError;

        // Fetch team members count
        const teamMembers = projectData.team_members?.length || 0;

        // Fetch schedule data
        const { data: scheduleData, error: scheduleError } = await supabase
          .from('project_schedules')
          .select('data')
          .eq('project_id', projectId)
          .single();

        if (scheduleError && scheduleError.code !== 'PGRST116') {
          // PGRST116 is "No rows found" error which we can ignore
          throw scheduleError;
        }

        // Fetch budget summary
        const { data: budgetData, error: budgetError } = await supabase
          .from('project_budgets')
          .select('data')
          .eq('project_id', projectId)
          .single();

        if (budgetError && budgetError.code !== 'PGRST116') {
          throw budgetError;
        }

        setSummary({
          total_daily_reports: dailyReports?.length || 0,
          totalBudget: projectData.budget || 0,
          teamMembers,
          schedule: scheduleData?.data || [],
          reports: dailyReports || [],
          budgetSummaryData: budgetData?.data || []
        });

      } catch (err) {
        console.error('Error fetching project summary:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error loading project summary: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Daily Reports Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 font-medium">Daily Reports</h3>
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="text-3xl font-bold text-blue-600 mb-2">
          {summary.total_daily_reports || 0}
        </div>
        <div className="text-sm text-blue-600">Total submitted</div>
      </div>

      {/* Budget Status Card */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 font-medium">Budget Status</h3>
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        </div>
        <div className="text-3xl font-bold text-green-600 mb-2">
          {summary.totalBudget ? formatMoney(summary.totalBudget) : "$0"}
        </div>
        <div className="text-sm text-green-600">
          {summary.totalBudget ? "Total budget" : "No budget set"}
        </div>
      </div>

      {/* Active Team Members Card */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 font-medium">Team Members</h3>
          <svg
            className="w-6 h-6 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <div className="text-3xl font-bold text-purple-600 mb-2">
          {summary.teamMembers || 0}
        </div>
        <div className="text-sm text-purple-600">
          {summary.teamMembers ? "Team members" : "No team members"}
        </div>
      </div>

      {/* Schedule Progress Card */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 font-medium">Schedule Tasks</h3>
          <svg
            className="w-6 h-6 text-orange-600"
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
        </div>
        <div className="text-3xl font-bold text-orange-600 mb-2">
          {summary.schedule?.length || 0}
        </div>
        <div className="text-sm text-orange-600">
          {summary.schedule?.length ? "Total tasks" : "No schedule data"}
        </div>
      </div>
    </div>
  );
}
