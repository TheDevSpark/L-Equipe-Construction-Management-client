"use client";

import ReportCard from '@/components/ReportCard';
import ReportPreview from '@/components/ReportPreview';
import React, { useState } from 'react';

// Main Page Component
const ReportsExportingPage = () => {
 

  const reports = [
    {
      icon: 'file',
      title: 'Daily Report Summary',
      description: 'Comprehensive daily activities, weather, crew count, and progress',
      bgColor: 'bg-blue-100',
      color:'text-blue-600'

    },
    {
      icon: 'file',
      title: 'Budget Status Report',
      description: 'Detailed financial breakdown with variance analysis',
      bgColor: 'bg-green-100',
      color:'text-green-600'
    },
    {
      icon: 'file',
      title: 'Schedule Report',
      description: 'Full project schedule with milestones and critical path',
       bgColor: 'bg-purple-100',
      color:'text-purple-600'
    },
    {
      icon: 'file',
      title: 'Punch List Report',
      description: 'Complete punch list with photos and status updates',
        bgColor: 'bg-orange-100',
      color:'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      
        
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-[18px] font-[600] text-gray-900 ">Reports & Exporting</h2>
              <p className="text-gray-500 text-sm">Generate and export project reports in multiple formats</p>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {reports.map((report, index) => (
                <ReportCard key={index} {...report} />
              ))}
            </div>

         
            <ReportPreview />
        
    
      </div>
    </div>
  );
};

export default ReportsExportingPage;