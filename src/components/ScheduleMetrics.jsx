// ScheduleMetrics.jsx
const ScheduleMetrics = () => {
  const metrics = [
    {
      title: "Total Milestones",
      value: "7",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      titleColor: "text-blue-900"
    },
    {
      title: "Completed",
      value: "1",
      subtitle: "14% complete",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
      titleColor: "text-green-900"
    },
    {
      title: "On Track",
      value: "6",
      subtitle: "86% of total",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      titleColor: "text-purple-900"
    },
    {
      title: "At Risk",
      value: "1",
      subtitle: "Requires attention",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-700",
      titleColor: "text-orange-900"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`${metric.bgColor} ${metric.borderColor} border rounded-lg p-4`}
        >
          <div className={`text-sm font-medium ${metric.titleColor} mb-1`}>
            {metric.title}
          </div>
          <div className={`text-2xl font-bold ${metric.textColor} mb-1`}>
            {metric.value}
          </div>
          {metric.subtitle && (
            <div className={`text-xs ${metric.textColor} opacity-80`}>
              {metric.subtitle}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ScheduleMetrics;
