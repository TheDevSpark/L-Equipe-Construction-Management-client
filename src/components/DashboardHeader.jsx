

// Header Component
const DashboardHeader = () => {
  return (
    <div className="bg-gradient-to-r border from-purple-600 to-purple-700 rounded-xl p-6 md:p-7 mb-6 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className=" text-white font-[600] text-[17px] mb-2">
            Owner's Representative Dashboard
          </h2>
          <p className="text-purple-100 text-sm md:text-[14px] mt-7">
            Executive overview - Read-only access to project status and reports
          </p>
        </div>
      </div>
    </div>
  );
};
export default DashboardHeader;