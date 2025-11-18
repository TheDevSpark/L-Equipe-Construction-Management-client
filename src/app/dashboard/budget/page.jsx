"use client";

import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectContext, useProject } from "@/context/ProjectContext";
import { supabase } from "@/lib/supabaseClient";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BudgetPage() {
  const { selectedProject } = useProject()
  const [budgetData, setBudgetData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate summary metrics
  const summary = budgetData.reduce((acc, item) => {
    const amount = typeof item["Contract Amount"] === 'number' ? item["Contract Amount"] : 
                 (typeof item["Contract Amount"] === 'object' ? item["Contract Amount"]?.amount || 0 : 0);
    const paid = typeof item["Paid to Date"] === 'number' ? item["Paid to Date"] : 
               (typeof item["Paid to Date"] === 'object' ? item["Paid to Date"]?.amount || 0 : 0);
    
    return {
      totalBudget: acc.totalBudget + amount,
      totalPaid: acc.totalPaid + paid,
      remaining: acc.remaining + (amount - paid),
      totalItems: acc.totalItems + 1
    };
  }, { totalBudget: 0, totalPaid: 0, remaining: 0, totalItems: 0 });

  // Format chart data
  const chartData = {
    labels: budgetData
      .filter(item => (item["Contract Amount"] || 0) > 0) // Only show items with contract amount > 0
      .map(item => item["TRADER /VENDOR NAME"]?.toString() || 'Unnamed'),
    datasets: [
      {
        label: 'Contract Amount',
        data: budgetData
          .filter(item => (item["Contract Amount"] || 0) > 0)
          .map(item => Number(item["Contract Amount"]) || 0),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Paid to Date',
        data: budgetData
          .filter(item => (item["Contract Amount"] || 0) > 0)
          .map(item => Number(item["Paid to Date"]) || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  // Load data from Supabase
  useEffect(() => {
    const fetchBudgetData = async () => {
      if (!selectedProject?.id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch budget data from Supabase
        const { data, error } = await supabase
          .from('project_budgets')
          .select('*')
          .eq('project_id', selectedProject.id)
          .maybeSingle();

        if (error) throw error;

        if (data?.data) {
          // The data is already in the correct format from the database
          // Just ensure all items have the required fields
          const processedData = data.data.map(item => ({
            ...item,
            "Remaining Balanc": (item["Contract Amount"]?.amount || 0) - (item["Paid to Date"]?.amount || 0)
          }));
          
          setBudgetData(processedData);
        } else {
          setBudgetData([]);
          toast.warning('No budget data found for this project');
        }
      } catch (error) {
        console.error('Error fetching budget data:', error);
        toast.error('Failed to load budget data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgetData();
  }, [selectedProject]);

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value) => {
    if (value === '--') return value;
    const num = Number(value);
    if (isNaN(num)) return '0%';
    return `${(num * 100).toFixed(0)}%`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {selectedProject?.project_name || 'Project'} Budget
          </h1>
          <p className="text-muted-foreground">
            {selectedProject?.project_name ? 
              `Budget overview for ${selectedProject.project_name}` : 
              'Select a project to view budget'}
          </p>
        </div>
        {!selectedProject && (
          <p className="text-sm text-amber-500">
            Please select a project from the sidebar
          </p>
        )}
      </div>

      {!selectedProject ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Please select a project to view budget information
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalBudget)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalPaid)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.remaining)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <Bar options={chartOptions} data={chartData} />
          </div>
        </CardContent>
      </Card>

      {/* Budget Table */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Vendor
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      Contract Amount
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      Approved COs
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      Revised Total
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      Paid to Date
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      Remaining
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      % Complete
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {budgetData.map((item) => (
                    <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">
                        {item["TRADER /VENDOR NAME"]}
                      </td>
                      <td className="p-4 text-right align-middle">
                        {formatCurrency(item["Contract Amount"])}
                      </td>
                      <td className="p-4 text-right align-middle">
                        {item["Approved Change Orders"]}
                      </td>
                      <td className="p-4 text-right align-middle">
                        {formatCurrency(item["Revised Contract Total"])}
                      </td>
                      <td className="p-4 text-right align-middle">
                        {formatCurrency(item["Paid to Date"])}
                      </td>
                      <td className="p-4 text-right align-middle">
                        {formatCurrency(item["Remaining Balanc"])}
                      </td>
                      <td className="p-4 text-right align-middle">
                        {formatPercentage(item["% Complete"])}
                      </td>
                      <td className="p-4 text-right align-middle">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item["Payment Status"] === 'Pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item["Payment Status"]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t bg-muted/50 font-medium">
                    <td className="p-4 align-middle">Total</td>
                    <td className="p-4 text-right align-middle">
                      {formatCurrency(summary.totalBudget)}
                    </td>
                    <td className="p-4 text-right align-middle">--</td>
                    <td className="p-4 text-right align-middle">
                      {formatCurrency(summary.totalBudget)}
                    </td>
                    <td className="p-4 text-right align-middle">
                      {formatCurrency(summary.totalPaid)}
                    </td>
                    <td className="p-4 text-right align-middle">
                      {formatCurrency(summary.remaining)}
                    </td>
                    <td className="p-4 text-right align-middle">
                      {summary.totalBudget > 0 
                        ? `${Math.round((summary.totalPaid / summary.totalBudget) * 100)}%` 
                        : '0%'}
                    </td>
                    <td className="p-4 text-right align-middle">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {summary.totalPaid > 0 ? 'In Progress' : 'Not Started'}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}