
import React from 'react';
import { TestRun, TestStatus } from '../types';

const mockRuns: TestRun[] = [
    { id: 'run-01', suiteName: 'Smoke Tests', status: TestStatus.Passed, startTime: '10:30 AM', duration: '2m 10s', passed: 50, failed: 0, total: 50 },
    { id: 'run-02', suiteName: 'API Regression', status: TestStatus.Passed, startTime: '09:15 AM', duration: '5m 45s', passed: 121, failed: 0, total: 121 },
    { id: 'run-03', suiteName: 'Full E2E Suite', status: TestStatus.Failed, startTime: '02:00 AM', duration: '25m 30s', passed: 340, failed: 2, total: 342 },
    { id: 'run-04', suiteName: 'Login Flow', status: TestStatus.Passed, startTime: 'Yesterday', duration: '1m 05s', passed: 12, failed: 0, total: 12 },
    { id: 'run-05', suiteName: 'Payment Gateway', status: TestStatus.Running, startTime: 'Now', duration: '...', passed: 5, failed: 0, total: 20 },
];

const StatusIcon: React.FC<{ status: TestStatus }> = ({ status }) => {
    const icons = {
        [TestStatus.Passed]: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>,
        [TestStatus.Failed]: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>,
        [TestStatus.Running]: <svg className="h-5 w-5 text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>,
        [TestStatus.Skipped]: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 5a1 1 0 011-1h.01a1 1 0 01.99 1.01l-.01.98a1 1 0 01-1.99-.01l.01-.98zM10 14a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" /></svg>,
    }
    return icons[status];
};

const RecentRunsTable: React.FC = () => {
    return (
        <ul className="space-y-4">
            {mockRuns.map(run => (
                <li key={run.id} className="flex items-center space-x-4">
                    <StatusIcon status={run.status} />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{run.suiteName}</p>
                        <p className="text-xs text-gray-500">
                           {run.status === TestStatus.Passed || run.status === TestStatus.Failed ? `${run.passed}/${run.total} passed in ${run.duration}` : `Triggered ${run.startTime}`}
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default RecentRunsTable;
