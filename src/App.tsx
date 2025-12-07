import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { ProjectDetail } from './components/ProjectDetail';
import { MemberManagement } from './components/MemberManagement';
import { projects as initialProjects, members } from './data/mockData';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projects] = useState(initialProjects);

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('project-detail');
  };

  const handleBackToDashboard = () => {
    setSelectedProjectId(null);
    setCurrentView('dashboard');
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <Dashboard projects={projects} onProjectSelect={handleProjectSelect} />
        )}

        {currentView === 'projects' && (
          <Dashboard projects={projects} onProjectSelect={handleProjectSelect} />
        )}

        {currentView === 'project-detail' && selectedProject && (
          <ProjectDetail project={selectedProject} onBack={handleBackToDashboard} />
        )}

        {currentView === 'members' && (
          <MemberManagement members={members} projects={projects} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © 2024 팀 배정 대시보드. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
