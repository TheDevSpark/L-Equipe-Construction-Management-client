
import {CircleCheckBig, Download } from 'lucide-react';


// Daily Reports Component
const DailyReports = () => {
  const reports = [
    {
      date: 'Oct 2, 2025',
      activities: 'Foundation pour completed on east wing. Steel delivery received.',
      weather: { condition: 'Sunny, 72°F', status: 'None reported' },
      workers: 45
    },
    {
      date: 'Oct 1, 2025',
      activities: 'Steel erection progressing on Level 1. MEP rough-in inspection passed.',
      weather: { condition: 'Partly Cloudy, 68°F', status: 'Minor electrical conduit conflict - resolved' },
      workers: 42
    },
    {
      date: 'Sep 30, 2025',
      activities: 'Interior framing continued. HVAC ductwork installation ongoing.',
      weather: { condition: 'Light Rain, 65°F', status: 'Rain delayed exterior work by 2 hours' },
      workers: 38
    }
  ];

  return (
    <div className="bg-white rounded-xl mb-5  p-4 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
       <h5 className="text-lg md:text-[15px] mt-2 font-[400] text-gray-800 mb-3">
          Recent Daily Report Summaries
        </h5>
        <button className="flex items-center gap-2 px-3 md:px-4 py-2  border text-[13px] text-black  hover:bg-gray-50 rounded-lg transition-colors">
          
          <Download className="w-4 h-4" />
          <span>Export Reports</span>
        </button>
      </div>

      <div className="space-y-4 md:space-y-6">
        {reports.map((report, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 md:p-5 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-[400] text-gray-800 text-sm md:text-[15px]">
                  {report.date}
                </h3>
                <CircleCheckBig className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
               
              </div>
              <span className="text-xs md:text-[13px] text-gray-900 bg-gray-200 px-2 md:px-2 py-0.5 rounded-full">
                {report.workers} workers
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <h4 className="text-xs md:text-[12px] font-medium text-gray-500 mb-1">Key Activities</h4>
                <p className="text-sm md:text-[13px] text-gray-900">{report.activities}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <h4 className="text-xs md:text-[12px] font-medium text-gray-500 mb-1">Weather</h4>
                  <p className="text-sm md:text-[13px] text-gray-900">{report.weather.condition}</p>
                </div>
                <div>
                  <h4 className="  text-xs md:text-[12px] font-medium text-gray-500 mb-1">Issues</h4>
                  <p className="text-sm md:text-[13px] text-gray-900">{report.weather.status}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyReports;