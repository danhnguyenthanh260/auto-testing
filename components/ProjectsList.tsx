
import React from 'react';
import { Project } from '../types';

const mockProjects: Project[] = [
  { id: 'proj-001', name: 'E-commerce Platform', description: 'End-to-end tests for the main customer-facing website.', testCaseCount: 152, lastActivity: '2 hours ago' },
  { id: 'proj-002', name: 'Mobile App API', description: 'API tests for the iOS and Android applications.', testCaseCount: 310, lastActivity: '5 hours ago' },
  { id: 'proj-003', name: 'Internal Dashboard', description: 'UI and functionality tests for the admin panel.', testCaseCount: 88, lastActivity: '1 day ago' },
  { id: 'proj-004', name: 'Data Processing Pipeline', description: 'Integration tests for the backend data services.', testCaseCount: 292, lastActivity: '3 days ago' },
];

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
        <div>
            <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
            <p className="text-sm text-gray-500 mt-2 mb-4">{project.description}</p>
        </div>
        <div>
            <div className="text-sm text-gray-600">
                <span className="font-semibold">{project.testCaseCount}</span> Test Cases
            </div>
            <div className="text-xs text-gray-400 mt-1">
                Last activity: {project.lastActivity}
            </div>
        </div>
    </div>
);


const ProjectsList: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map(p => <ProjectCard key={p.id} project={p} />)}
      </div>
    </div>
  );
};

export default ProjectsList;
