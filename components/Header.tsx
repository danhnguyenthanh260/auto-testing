import React from 'react';
import GitIcon from './icons/GitIcon';

interface HeaderProps {
    title: string;
    changedFilesCount: number;
    onGitSyncClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, changedFilesCount, onGitSyncClick }) => {
    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
            <div className="flex items-center space-x-4">
                <button 
                    onClick={onGitSyncClick}
                    className="relative flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    <GitIcon />
                    <span className="ml-2">Git Sync</span>
                    {changedFilesCount > 0 && (
                        <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                            {changedFilesCount}
                        </span>
                    )}
                </button>
                <button className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                </button>
                <div className="flex items-center">
                    <img className="w-10 h-10 rounded-full object-cover" src="https://picsum.photos/100" alt="User" />
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">QA Engineer</p>
                        <p className="text-xs text-gray-500">Workspace Admin</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;