// StatCard Component
const StatCard = ({ label, value, status, statusColor }) => {
  return (
    <div className="border border-gray-300 rounded-[12px] p-4 shadow-sm">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-xl font-[500] text-gray-800 ">{value}</p>
      <span
        className={`inline-block px-2  py-0.5 rounded-[8px] text-[11px] font-[500] ${statusColor}`}
      >
        {status}
      </span>
    </div>
  );
};

export default StatCard;
