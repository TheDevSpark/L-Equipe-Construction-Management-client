import { FileText, Download } from "lucide-react";
import IssueItem from "./IssueItem";
import StatCard from "./StatCard";


// ReportPreview Component
const ReportPreview = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 max-w-5xl mx-auto">
      {/* Header */}
      <p className="text-[14px] text-gray-900 mb-2">Report Preview - Weekly Summary</p>
   <div className="mb-6 border-b mt-6 pb-2">
  <div className="flex mb-2 justify-between items-start">
    {/* Left Side */}
    <div>
      <h2 className="text-xl font-[400] text-gray-900 mb-1">
        Downtown Office Complex
      </h2>
      <p className="text-sm text-gray-500">
        Project #: 2025-DOC-001
      </p>
      <p className="text-sm text-gray-500">
        Report Period: Sep 27 - Oct 3, 2025
      </p>
    </div>

    {/* Right Side */}
    <div className="text-right">
      <p className="text-sm font-[400] text-gray-900">
        ProBuild Construction LLC
      </p>
      <p className="text-sm text-gray-500">
        123 Builder Ave
      </p>
      <p className="text-sm text-gray-500">
        Cityville, ST 12345
      </p>
    </div>
  </div>
</div>



        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <StatCard 
            label="Overall Progress" 
            value="68%" 
            status="On Track" 
            statusColor="bg-green-600 text-white "
          />
          <StatCard 
            label="Budget Status" 
            value="$2.3M" 
            status="Under Budget" 
            statusColor="bg-green-600 text-white"
          />
          <StatCard 
            label="Active Workers" 
            value="45" 
            status="Avg this week" 
            statusColor=" text-gray-700"
          />
          <StatCard 
            label="Open Items" 
            value="12" 
            status="Attention" 
            statusColor="bg-yellow-600 text-white"
          />
        </div>
   
      {/* Key Accomplishments */}
      <div className="mb-6 mt-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Accomplishments This Week</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-600 flex-shrink-0">✓</span>
            <span>Foundation pour completed on east wing - passed inspection</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 flex-shrink-0">✓</span>
            <span>Steel delivery received and stored on site</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 flex-shrink-0">✓</span>
            <span>MEP rough-in inspection approved for Level 2</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 flex-shrink-0">✓</span>
            <span>Site drainage improvements completed ahead of schedule</span>
          </li>
        </ul>
      </div>

      <div className=" p-6  max-w-2xl">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Issues & Concerns</h3>
      
      <div>
        <IssueItem 
          severity="medium"
          text="Underground utilities work at risk due to unforeseen conflicts" 
        />
        <IssueItem 
          severity="high"
          text="Steel delivery delayed by 3 days - may impact erection schedule" 
        />
      </div>
    </div>

      {/* Action Buttons */}
      <div className="flex border-t-1 flex-wrap gap-3">
        <button className=" mt-3 flex items-center gap-2 bg-blue-600 text-white py-1.5 px-3 rounded-md hover:bg-blue-700 transition-colors text-[13px] font-medium">
          <FileText className="w-4 h-4" />
          Print Report
        </button>
        <button className="flex items-center mt-3  gap-2 bg-white border border-gray-300 text-gray-700 py-1.5 px-3 rounded-md hover:bg-gray-50 transition-colors text-[13px] font-medium">
          <FileText className="w-4 h-4" />
          Email to Team
        </button>
        <button className="flex items-center mt-3  gap-2 bg-white border border-gray-300 text-gray-700 py-1.5 px-3 rounded-md hover:bg-gray-50 transition-colors text-[13px] font-medium">
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
    </div>
  );
};
export default ReportPreview;