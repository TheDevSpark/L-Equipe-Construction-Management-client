"use client";

import { useState } from "react";
import DocumentsHeader from "@/components/DocumentsHeader";
import DocumentSearchFilter from "@/components/DocumentSearchFilter";
import DocumentTable from "@/components/DocumentTable";
import DocumentStats from "@/components/DocumentStats";

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-7">
      <div className="max-w-7xl mx-auto">
        <DocumentsHeader />
        <DocumentSearchFilter 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <DocumentTable 
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />
        <DocumentStats />
      </div>
    </div>
  );
}
