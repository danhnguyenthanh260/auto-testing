import React, { useState } from 'react';

const Settings: React.FC = () => {
    const [repoUrl, setRepoUrl] = useState('https://github.com/your-org/autotest-repo.git');
    const [token, setToken] = useState('');

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800">Settings</h2>
                <p className="mt-2 text-gray-600">
                    Manage your workspace, projects, user roles, integrations, and billing information here.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">Git Integration</h3>
                    <p className="mt-1 text-sm text-gray-500">Connect a Git repository to version control your test cases.</p>
                </div>
                <div className="p-6 space-y-4">
                     <div>
                        <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-700">Repository URL</label>
                        <input
                            type="text"
                            id="repoUrl"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="https://github.com/your-org/your-repo.git"
                        />
                    </div>
                     <div>
                        <label htmlFor="token" className="block text-sm font-medium text-gray-700">Personal Access Token</label>
                        <input
                            type="password"
                            id="token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="••••••••••••••••••••••••••••••••••••"
                        />
                         <p className="mt-2 text-xs text-gray-500">
                            Use a fine-grained personal access token with read/write access to the repository.
                         </p>
                    </div>
                </div>
                <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end">
                    <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700">Save Configuration</button>
                </div>
            </div>
        </div>
    );
};

export default Settings;