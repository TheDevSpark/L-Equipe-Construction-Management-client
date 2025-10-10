

import {   Flag } from 'lucide-react';
// Upcoming Milestones Component
const UpcomingMilestones = () => {
  const milestones = [
    { title: 'Foundation Formwork & Rebar Completion', date: 'Oct 14, 2025', daysLeft: 11, status: 'On track' },
    { title: 'Steel Erection Level 1 Complete', date: 'Oct 24, 2025', daysLeft: 21, status: 'On track' },
    { title: 'MEP Rough-in Inspection', date: 'Oct 20, 2025', daysLeft: 17, status: 'At risk' },
    { title: 'Building Envelope Completion', date: 'Nov 15, 2025', daysLeft: 43, status: 'On track' }
  ];

  return (
    <div className="bg-white rounded-xl mb-5 p-4 md:p-6 shadow-sm border border-gray-100">
      <h5 className="text-lg md:text-[15px] font-[400] text-gray-800 mb-7">
        Upcoming Project Milestones
      </h5>
      
      <div className="space-y-3 md:space-y-2">
        {milestones.map((milestone, idx) => (
          <div key={idx} className="flex items-start gap-3 md:gap-4 p-3 md:p-2 border rounded-lg  ">
            <div className="w-10 h-10 md:w-12 md:h-12  rounded-lg flex items-center justify-center flex-shrink-0">
             <Flag className="w-5 h-5 md:w-6 md:h-6 text-blue-600"   />
             
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-[500] text-gray-800 text-sm mt-2 md:text-[14px] mb-1">
                {milestone.title}
              </h3>
              <p className="text-xs md:text-[13px] text-gray-500">{milestone.date}</p>
            </div>
            <div className="flex flex-col mt-2.5 items-end gap-1 flex-shrink-0">
              <span className={`px-2  py-0.5 rounded-[8px] text-[11px] font-[500] ${
                milestone.status === 'On track' 
                  ? 'bg-green-600 text-white'
                  : 'bg-yellow-600 text-black'
              }`}>
                {milestone.status}
              </span>
              <span className="text-xs text-gray-500">{milestone.daysLeft} days</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default UpcomingMilestones;