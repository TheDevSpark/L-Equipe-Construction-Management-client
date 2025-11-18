"use client";

import { useEffect, useState, useMemo } from "react";
import { useProject } from "@/context/ProjectContext";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  excelDateToJSDate,
  formatMoney,
  processScheduleData,
  processBudgetData,
  getChartOptions,
  calculateProjectCompletionPercentage
} from "@/lib/summaryHelpers";
import { Percent } from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Empty state component
function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-8">
      <div className="mx-auto h-12 w-12 text-gray-400">{icon}</div>
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export default function ClientDashboard() {
  const { selectedProject } = useProject();
  const [summary, setSummary] = useState({
    total_daily_reports: 0,
    totalBudget: 0,
    teamMembers: 0,
    schedule: [],
    reports: [],
    budgetSummaryData: []
  });
  const [scheduleTasks, setScheduleTasks] = useState([]);
  const [budgetData, setBudgetData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chart options
  const chartOptions = useMemo(() => getChartOptions(budgetData), [budgetData]);

  // Fetch project data
  useEffect(() => {
    if (!selectedProject?.id) return;

    const fetchProjectData = async () => {
      try {
        setLoading(true);
        
        // Fetch project details
        const { data: projectData, error: projectError } = await supabase
          .from('project')
          .select('*')
          .eq('id', selectedProject.id)
          .single();

        if (projectError) throw projectError;

        // Fetch daily reports
        const { data: dailyReports, error: reportsError } = await supabase
          .from('daily_reports')
          .select('*')
          .eq('project_id', selectedProject.id);

        if (reportsError) throw reportsError;

        // Fetch schedule data
        const { data: scheduleData, error: scheduleError } = await supabase
          .from('project_schedules')
          .select('data')
          .eq('project_id', selectedProject.id)
          .single();

        if (scheduleError && scheduleError.code !== 'PGRST116') throw scheduleError;

        // Fetch budget data
        const { data: budgetData, error: budgetError } = await supabase
          .from('project_budgets')
          .select('data')
          .eq('project_id', selectedProject.id)
          .single();

        if (budgetError && budgetError.code !== 'PGRST116') throw budgetError;

        const schedule = scheduleData?.data || [];
        const budgetSummaryData = budgetData?.data || [];

        // Process data
        const processedSchedule = processScheduleData(schedule);
        const processedBudgetData = processBudgetData(budgetSummaryData);

        setScheduleTasks(processedSchedule);
        setBudgetData(processedBudgetData);

        setSummary({
          total_daily_reports: dailyReports?.length || 0,
          totalBudget: projectData.budget || 0,
          teamMembers: projectData.team_members?.length || 0,
          schedule,
          reports: dailyReports || [],
          budgetSummaryData
        });

      } catch (error) {
        console.error('Error fetching project data:', error);
        setError(error.message || 'Failed to load project data');
        toast.error('Failed to load project data');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [selectedProject]);

  if (loading) {
    if (!selectedProject) {
      return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-17 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 text-lg">No Projects To Show</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-17 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-7 mb-6">
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
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Daily Reports Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Project Progress</h3>
            <div className="p-2 bg-blue-100 rounded-full">
            <Percent />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800">{calculateProjectCompletionPercentage(summary.schedule)}%</div>
          <p className="text-sm text-gray-500 mt-1">Total Progress Made</p>
        </div>

        {/* Budget Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Project Budget</h3>
            <div className="p-2 bg-green-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800">{formatMoney(summary.totalBudget)}</div>
          <p className="text-sm text-gray-500 mt-1">Total allocated budget</p>
        </div>

        {/* Team Members Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Team Members</h3>
            <div className="p-2 bg-purple-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800">{summary.teamMembers}</div>
          <p className="text-sm text-gray-500 mt-1">Team members assigned</p>
        </div>

        {/* Schedule Tasks Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Schedule Tasks</h3>
            <div className="p-2 bg-yellow-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800">{summary.schedule.length}</div>
          <p className="text-sm text-gray-500 mt-1">Total tasks in schedule</p>
        </div>
      </div>

      {/* Schedule Lookahead and Budget Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2-Week Schedule Lookahead */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            2-Week Schedule Lookahead
          </h3>
          <div className="space-y-4">
            {scheduleTasks.length > 0 ? (
              scheduleTasks.map((task) => (
                <div
                  key={task.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{task.title}</h4>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        task.statusColor === 'green'
                          ? 'bg-green-100 text-green-800'
                          : task.statusColor === 'orange'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    {task.startDate} - {task.endDate} • {task.responsibleParty}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          task.statusColor === 'green'
                            ? 'bg-green-500'
                            : task.statusColor === 'orange'
                            ? 'bg-orange-500'
                            : 'bg-gray-400'
                        }`}
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {task.progress}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
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
                <h4 className="mt-2 text-sm font-medium text-gray-900">
                  No upcoming tasks
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  No tasks are scheduled for the next 2 weeks.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Budget Variance Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Budget Variance by Trade
          </h3>
          <div className="h-80">
            {budgetData.labels.length > 0 ? (
              <Bar data={budgetData} options={chartOptions} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h4 className="mt-2 text-sm font-medium text-gray-900">
                  No budget data available
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  Upload budget data to see the variance chart.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Daily Reports */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Daily Reports
        </h3>
        <div className="space-y-4">
          {summary.reports.length > 0 ? (
            summary.reports.slice(0, 3).map((report) => (
              <div key={report.id} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">
                    {new Date(report.report_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </h4>
                  <div className="text-sm text-gray-500">
                    {report.weather_condition || 'N/A'}
                  </div>
                </div>
                <p className="text-gray-600 mb-2">{report.work_summary || 'No summary provided'}</p>
                <div className="text-sm text-gray-500">
                  {report.total_workers ? `(${report.total_workers} crew members)` : '(No crew data)'}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h4 className="mt-2 text-sm font-medium text-gray-900">
                No daily reports
              </h4>
              <p className="mt-1 text-sm">
                No daily reports have been submitted for this project yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}