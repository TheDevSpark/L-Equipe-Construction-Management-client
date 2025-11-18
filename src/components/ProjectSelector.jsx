// src/components/ProjectSelector.jsx
"use client";

import { useProject } from '@/context/ProjectContext';

export default function ProjectSelector() {
  const { projects, selectedProject, selectProject } = useProject();

  const handleProjectChange = (e) => {
      
      const project = projects.find(p => p.id == e.target.value);
      console.log(project);
    if (project) {
      selectProject(project);
    }
  };

  if (!selectedProject) return null;

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center">
          <label htmlFor="project-select" className="mr-2 text-sm font-medium text-gray-700">
            Project:
          </label>
          <select
            id="project-select"
            value={selectedProject?.id || ''}
            onChange={handleProjectChange}
            className="block w-64 rounded-md border-gray-300 py-1 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.projectName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}