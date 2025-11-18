/**
 * Utility functions for schedule and date operations
 */

/**
 * Convert Excel serial date to JavaScript Date
 * @param {number} serial - Excel serial date
 * @returns {Date} JavaScript Date object
 */
export const excelDateToJSDate = (serial) => {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  return new Date(utc_value * 1000);
};

/**
 * Format money in short form (e.g., $1.2M, $3.4K)
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted money string
 */
export const formatMoney = (amount) => {
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
      maximumFractionDigits: 0,
    })}`;
  }
};

/**
 * Process schedule data for 2-week lookahead
 * @param {Array} schedule - Array of schedule tasks
 * @returns {Array} Processed schedule tasks for the next 2 weeks
 */
export const processScheduleData = (schedule = []) => {
  if (!schedule || !Array.isArray(schedule)) return [];

  const today = new Date();
  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(today.getDate() + 14);

  return schedule
    .filter((task) => {
      if (!task.start || !task.end) return false;
      const taskStartDate = excelDateToJSDate(task.start);
      const taskEndDate = excelDateToJSDate(task.end);
      return (
        (taskStartDate >= today && taskStartDate <= twoWeeksFromNow) ||
        (taskStartDate <= today && taskEndDate >= today)
      );
    })
    .slice(0, 5)
    .map((task) => ({
      id: task.id || Math.random().toString(36).substr(2, 9),
      title: task.name || 'Untitled Task',
      startDate: excelDateToJSDate(task.start).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      endDate: excelDateToJSDate(task.end).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      responsibleParty: task.resource || 'Not Assigned',
      status:
        task.progress === 100
          ? 'Completed'
          : task.progress > 50
          ? 'On Track'
          : task.progress > 0
          ? 'In Progress'
          : 'Not Started',
      progress: task.progress || 0,
      statusColor:
        task.progress === 100
          ? 'green'
          : task.progress > 50
          ? 'green'
          : task.progress > 0
          ? 'orange'
          : 'gray',
    }));
};

/**
 * Process budget data for chart visualization
 * @param {Array} budgetSummaryData - Raw budget data
 * @returns {Object} Processed data for chart
 */
export const processBudgetData = (budgetSummaryData = []) => {
  if (!budgetSummaryData || !Array.isArray(budgetSummaryData)) {
    return {
      labels: [],
      datasets: []
    };
  }

  const validBudgetItems = budgetSummaryData.filter(
    (item) =>
      item &&
      item['Contract Amount'] !== undefined &&
      item['Remaining Balanc'] !== undefined &&
      item['TRADER /VENDOR NAME']
  ).slice(0, 5);

  const budgetLabels = validBudgetItems.map(
    (item) => item['TRADER /VENDOR NAME']
  );

  const plannedData = validBudgetItems.map(
    (item) => item['Contract Amount'] || 0
  );

  const actualData = validBudgetItems.map(
    (item) =>
      (item['Contract Amount'] || 0) - (item['Remaining Balanc'] || 0)
  );

  return {
    labels: budgetLabels,
    datasets: [
      {
        label: 'Planned',
        data: plannedData,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Actual',
        data: actualData,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };
};

/**
 * Default chart options for budget variance
 */
export const getChartOptions = (budgetData) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Budget Variance by Trade',
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.dataset.label || '';
          const value = context.parsed.y;
          return `${label}: ${formatMoney(value)}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      suggestedMax:
        budgetData?.datasets?.length > 0 &&
        Math.max(...budgetData.datasets.flatMap((d) => d.data)) > 0
          ? Math.max(...budgetData.datasets.flatMap((d) => d.data)) * 1.2
          : 1000,
      ticks: {
        callback: function(value) {
          return formatMoney(value);
        },
        font: {
          size: 12,
        },
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
    },
    x: {
      ticks: {
        font: {
          size: 11,
        },
        maxRotation: 45,
      },
      grid: {
        display: false,
      },
    },
  },
});

// calculate project completion percentage
export const calculateProjectCompletionPercentage = (scheduleData) => {
  if (!scheduleData || !Array.isArray(scheduleData)) return 0;

  const totalTasks = scheduleData.length;
  const completedTasks = scheduleData.filter((task) => task.progress === 100).length;

  return Math.round(((completedTasks / totalTasks) * 100), 2) || "0%";
};
