import ScheduleHeader from "@/components/ScheduleHeader";
import ScheduleMetrics from "@/components/ScheduleMetrics";
import ProjectTimeline from "@/components/ProjectTimeline";
import MilestoneTimeline from "@/components/MilestoneTimeline";

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-7">
      <div className="max-w-7xl mx-auto">
        <ScheduleHeader />
        <ScheduleMetrics />
        <ProjectTimeline />
        <MilestoneTimeline />
      </div>
    </div>
  );
}
