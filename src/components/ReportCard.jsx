
import { FileText, Download } from 'lucide-react';

// ReportCard Component
const ReportCard = ({ icon, title, description, bgColor,color}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className={`${bgColor} p-2.5 rounded-lg`}>
          <FileText className={`w-6 h-6  ${color}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-[15px] font-[400] text-gray-900 mb-2">{title}</h3>
          <p className="text-[13px] text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-[13px]  font-medium">
          <Download className="w-4 h-4" />
          Export PDF
        </button>
        <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors text-[13px] font-medium">
          <Download className="w-4 h-4" />
          Export Excel
        </button>
      </div>
    </div>
  );
};

export default ReportCard;



