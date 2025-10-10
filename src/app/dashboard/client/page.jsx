import BudgetChart from "@/components/BudgetSnapshot";

import DailyReports from "@/components/DailyReports";
import DashboardHeader from "@/components/DashboardHeader";
import KeyMetrics from "@/components/KeyMetrics";
import ProgressTracking from "@/components/ProgressTracking";
import ProjectCompletion from "@/components/ProjectCompletion";
import QuickActions from "@/components/QuickActions";
import UpcomingMilestones from "@/components/UcomingMilestones";


// Main Dashboard Component
export default function OwnerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-7">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />
        <KeyMetrics />
        
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ProjectCompletion />
        <ProgressTracking />
      </div>
   

        <BudgetChart/>

  
          <UpcomingMilestones />
          
          <DailyReports/>

  

        <QuickActions/>
      </div>
    </div>
  );
}