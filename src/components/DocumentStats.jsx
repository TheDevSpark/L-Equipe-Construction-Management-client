// DocumentStats.jsx
const DocumentStats = () => {
  const stats = [
    {
      title: "Total Documents",
      value: "247",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      titleColor: "text-blue-900"
    },
    {
      title: "Drawings",
      value: "45",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
      titleColor: "text-green-900"
    },
    {
      title: "Reports",
      value: "89",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      titleColor: "text-purple-900"
    },
    {
      title: "Photos",
      value: "113",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-700",
      titleColor: "text-orange-900"
    }
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Document Library Stats
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-4`}
          >
            <div className={`text-sm font-medium ${stat.titleColor} mb-1`}>
              {stat.title}
            </div>
            <div className={`text-2xl font-bold ${stat.textColor}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentStats;
