

import {  Download, Eye, FileText } from 'lucide-react';
// Quick Actions Component
const QuickActions = () => {
  const actions = [
    { icon: Download, label: 'Download Executive Summary',  },
    { icon: Eye, label: 'View Full Schedule',  },
    { icon: FileText, label: 'Export Budget Report',   }
  ];

  return (
    <div className="bg-gray-50  rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
         <h5 className="text-lg md:text-[15px] mt-2 font-[400] text-gray-800 mb-3">Quick Actions</h5>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {actions.map((action, idx) => (
          <button
            key={idx}
            className={`flex items-center text-[14px] bg-white hover:bg-gray-50 text-black border gap-3 px-4 py-2  rounded-lg hover:shadow-md transition-all group`}
          >
            <action.icon className={`w-5 h-5  group-hover:scale-110 transition-transform`} />
            <span className={`text-sm font-medium `}>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
export default QuickActions;