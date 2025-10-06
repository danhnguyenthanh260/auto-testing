
import React from 'react';
import { View } from '../types';
import DashboardIcon from './icons/DashboardIcon';
import ProjectIcon from './icons/ProjectIcon';
import TestCaseIcon from './icons/TestCaseIcon';
import ReportsIcon from './icons/ReportsIcon';
import SettingsIcon from './icons/SettingsIcon';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavItem: React.FC<{
  view: View;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ view, label, icon, isActive, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${
      isActive
        ? 'bg-primary text-white shadow-md'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-4 text-sm font-medium">{label}</span>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <div className="w-64 bg-dark text-white flex flex-col p-4 shadow-2xl">
      <div className="flex items-center mb-10 p-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-xl font-bold ml-2">AutoTest</h1>
      </div>
      <nav>
        <ul>
          <NavItem
            view={View.Dashboard}
            label="Dashboard"
            icon={<DashboardIcon />}
            isActive={currentView === View.Dashboard}
            onClick={() => setCurrentView(View.Dashboard)}
          />
          <NavItem
            view={View.Projects}
            label="Projects"
            icon={<ProjectIcon />}
            isActive={currentView === View.Projects}
            onClick={() => setCurrentView(View.Projects)}
          />
          <NavItem
            view={View.TestCases}
            label="Test Cases"
            icon={<TestCaseIcon />}
            isActive={currentView === View.TestCases}
            onClick={() => setCurrentView(View.TestCases)}
          />
          <NavItem
            view={View.Reports}
            label="Reports"
            icon={<ReportsIcon />}
            isActive={currentView === View.Reports}
            onClick={() => setCurrentView(View.Reports)}
          />
        </ul>
      </nav>
      <div className="mt-auto">
        <ul>
          <NavItem
            view={View.Settings}
            label="Settings"
            icon={<SettingsIcon />}
            isActive={currentView === View.Settings}
            onClick={() => setCurrentView(View.Settings)}
          />
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
