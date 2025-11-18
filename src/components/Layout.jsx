// Layout.jsx (Main Layout Component)
"use client";

import { useState } from "react";
import Header from "./Navbar";
import Sidebar from "./Sidebar";
import ProjectSelector from "./ProjectSelector";

export default function DashboardLayout({ children, user }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onMenuToggle={toggleSidebar} user={user} />
      <ProjectSelector />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className="flex-1 overflow-auto m-5">
          {children}
        </main>
      </div>
    </div>
  );
}