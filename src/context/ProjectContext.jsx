// // src/context/ProjectContext.jsx
// "use client";

// import { createContext, useContext, useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabaseClient';

// const ProjectContext = createContext();

// export function ProjectProvider({ children }) {
//   const [projects, setProjects] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         setLoading(true);
//         const { data, error } = await supabase
//           .from('projects')
//           .select('*')
//           .order('created_at', { ascending: false });

//         if (error) throw error;
//         setProjects(data || []);

//         // Select the first project by default if none selected
//         if (data?.length > 0 && !selectedProject) {
//           setSelectedProject(data[0]);
//         }
//       } catch (error) {
//         console.error('Error fetching projects:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//   }, []);

//   const selectProject = (project) => {
//     setSelectedProject(project);
//   };

//   return (
//     <ProjectContext.Provider value={{ 
//       projects, 
//       selectedProject, 
//       loading, 
//       selectProject,
//       setSelectedProject
//     }}>
//       {children}
//     </ProjectContext.Provider>
//   );
// }

// export const useProject = () => {
//   const context = useContext(ProjectContext);
//   if (context === undefined) {
//     throw new Error('useProject must be used within a ProjectProvider');
//   }
//   return context;
// };
// src/context/ProjectContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchAvailableProjects = async () => {
    try {
      setLoading(true);
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) {
        router.push('/login');
        return;
      }

      // First, let's see the structure of the clients column
      console.log('User ID:', user.id);
      
      // Method 1: Try using the contains operator with the array syntax
      const { data, error } = await supabase
        .from('project')
        .select('*')
      
        
      // If the above doesn't work, uncomment the following method:
      // Method 2: Using raw SQL with jsonb_contains
      // const { data, error } = await supabase.rpc('get_user_projects', { user_id: user.id });

      if (error) throw error;
      const availableProjects = data.filter(project => project?.clients?.includes(user.id));
      
      setProjects(availableProjects || []);
      
      // Auto-select the first project if none is selected
      if (availableProjects?.length > 0 && !selectedProject) {
        setSelectedProject(availableProjects[0]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableProjects();
  }, []); // Empty dependency array to run only once on mount

  const selectProject = (project) => {
    setSelectedProject(project);
  };

  return (
    <ProjectContext.Provider value={{ 
      projects, 
      selectedProject, 
      loading, 
      selectProject,
      setSelectedProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};