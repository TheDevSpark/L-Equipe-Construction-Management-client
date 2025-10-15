// Layout.jsx (Main Layout Component)
"use client";

import { useState } from "react";
import Header from "./Navbar";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children, user }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={toggleSidebar} user={user} />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className="flex-1 ">
          {children}
        </main>
      </div>
    </div>
  );
}