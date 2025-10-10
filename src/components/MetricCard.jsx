// Metric Card Component
const MetricCard = ({ title, value, subtitle, icon: Icon, color, bgColor, borderColor ,titleColor }) => {
  return (
    <div className={`${bgColor} ${borderColor} border-2 rounded-xl p-4 md:p-5 transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-3 md:mb-5">
        <p className={`text-gray-700  font-medium text-[13px] ${titleColor} `}>{title}</p>
        <Icon className={`w-4 h-4 md:w-5 md:h-5 ${color}`} />
      </div>
      <div className={`text-2xl md:text-[28px] font-[400] ${titleColor} mb-5`}>{value}</div>
      <div className={`text-xs md:text-[13px] ${color}`}>{subtitle}</div>
    </div>
  );
};
export default MetricCard;