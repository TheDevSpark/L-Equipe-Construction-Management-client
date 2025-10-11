// ProjectTimeline.jsx
const ProjectTimeline = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <div className="flex items-center gap-2 text-gray-700">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="font-medium">Project Timeline:</span>
        <span>September 15, 2025 - January 15, 2026</span>
        <span className="text-gray-400">•</span>
        <span>Duration: 122 days</span>
        <span className="text-gray-400">•</span>
        <span>Current: Day 18</span>
      </div>
    </div>
  );
};

export default ProjectTimeline;
