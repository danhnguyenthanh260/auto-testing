import React, { useState, useEffect } from 'react';
import { TestCase, TestStatus, TestStep, GitCommit, GitStatus } from '../types';
import TestStepBuilder from './TestStepBuilder';

interface TestCaseDetailProps {
    testCase: TestCase;
    onBack: () => void;
    // Fix: Update onTestCaseUpdate prop type to accept an optional boolean for marking modification.
    onTestCaseUpdate: (testCase: TestCase, markAsModified?: boolean) => void;
}

const Tag: React.FC<{ name: string }> = ({ name }) => (
    <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs font-mono rounded-md mr-1">{name}</span>
);

const StatusBadge: React.FC<{ status: TestStatus }> = ({ status }) => {
    const colorClasses = {
        [TestStatus.Passed]: 'bg-green-100 text-green-800',
        [TestStatus.Failed]: 'bg-red-100 text-red-800',
        [TestStatus.Running]: 'bg-blue-100 text-blue-800',
        [TestStatus.Skipped]: 'bg-yellow-100 text-yellow-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center ${colorClasses[status]}`}>
            {status === TestStatus.Running && (
                <svg className="animate-spin -ml-1 mr-1.5 h-3 w-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {status}
        </span>
    );
};

type ActiveTab = 'details' | 'history';

const TestCaseDetail: React.FC<TestCaseDetailProps> = ({ testCase, onBack, onTestCaseUpdate }) => {
    const [localTestCase, setLocalTestCase] = useState<TestCase>(testCase);
    const [activeTab, setActiveTab] = useState<ActiveTab>('details');

    useEffect(() => {
        setLocalTestCase(testCase);
    }, [testCase]);

    const handleRunTest = () => {
        const runningTestCase = { ...localTestCase, lastRun: TestStatus.Running };
        onTestCaseUpdate(runningTestCase, false); // Running a test shouldn't mark it as a git modification itself
        
        setTimeout(() => {
            const result = Math.random() > 0.3 ? TestStatus.Passed : TestStatus.Failed;
            const finishedTestCase = { ...runningTestCase, lastRun: result, lastRunDate: new Date().toLocaleString() };
            onTestCaseUpdate(finishedTestCase, true); // But the result should be recorded
        }, Math.random() * 2000 + 1000);
    };
    
    const handleStepsChange = (newSteps: TestStep[]) => {
      const updatedTestCase = { ...localTestCase, steps: newSteps };
      onTestCaseUpdate(updatedTestCase);
    };

    const gitStatusText = {
        [GitStatus.New]: "New, uncommitted file.",
        [GitStatus.Modified]: "Changes have not been committed.",
        [GitStatus.Unmodified]: "Up to date.",
        [GitStatus.Conflicted]: "Merge conflict detected."
    }

    const gitStatusColor = {
        [GitStatus.New]: "text-green-600",
        [GitStatus.Modified]: "text-yellow-600",
        [GitStatus.Unmodified]: "text-gray-500",
        [GitStatus.Conflicted]: "text-red-600 font-bold"
    }

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                    <div>
                        <button onClick={onBack} className="text-sm text-indigo-600 hover:underline mb-4">&larr; Back to Test Cases</button>
                        <h1 className="text-2xl font-bold text-gray-800">{localTestCase.name}</h1>
                        <p className="text-gray-600 mt-2 mb-4">{localTestCase.description}</p>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${localTestCase.type === 'UI' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>{localTestCase.type}</span>
                            {localTestCase.tags.map(tag => <Tag key={tag} name={tag} />)}
                        </div>
                    </div>
                    <button 
                        onClick={handleRunTest}
                        disabled={localTestCase.lastRun === TestStatus.Running}
                        className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center flex-shrink-0"
                    >
                        {localTestCase.lastRun === TestStatus.Running && (
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {localTestCase.lastRun === TestStatus.Running ? 'Running...' : 'Run Test'}
                    </button>
                </div>
                <div className="mt-6 border-t pt-4 grid grid-cols-2 gap-4">
                     <div>
                        <h3 className="text-md font-semibold text-gray-700">Current Status</h3>
                        <div className="mt-2 flex items-center space-x-4">
                            <StatusBadge status={localTestCase.lastRun} />
                            <span className="text-sm text-gray-500">Last run on: {localTestCase.lastRunDate}</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-md font-semibold text-gray-700">Git Status</h3>
                        <p className={`text-sm mt-2 ${gitStatusColor[localTestCase.gitStatus]}`}>{gitStatusText[localTestCase.gitStatus]}</p>
                    </div>
                </div>
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Test Steps
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'history' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        History
                    </button>
                </nav>
            </div>

            {activeTab === 'details' ? (
                <TestStepBuilder steps={localTestCase.steps} onStepsChange={handleStepsChange} />
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Commit History</h3>
                     <ul className="divide-y divide-gray-200">
                         {localTestCase.history.length > 0 ? localTestCase.history.map(commit => (
                            <li key={commit.hash} className="py-4">
                                <p className="text-sm font-medium text-gray-800">{commit.message}</p>
                                <p className="text-sm text-gray-500">
                                    <span className="font-mono text-xs bg-gray-100 p-1 rounded">{commit.hash}</span> by <strong>{commit.author}</strong> on {commit.date}
                                </p>
                            </li>
                         )) : (
                            <p className="py-8 text-center text-gray-500">No commit history for this test case.</p>
                         )}
                     </ul>
                </div>
            )}
        </div>
    );
};

export default TestCaseDetail;