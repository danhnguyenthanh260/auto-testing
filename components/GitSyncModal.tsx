import React, { useState } from 'react';
import { TestCase, GitStatus } from '../types';
import GitIcon from './icons/GitIcon';

interface GitSyncModalProps {
    isOpen: boolean;
    onClose: () => void;
    changedFiles: TestCase[];
    conflictedFiles: TestCase[];
    onPush: (commitMessage: string) => Promise<void>;
    onPull: () => Promise<{ local: TestCase, remote: TestCase } | undefined>;
    onResolve: (testCaseId: string, resolvedTestCase: TestCase) => void;
}

const GitStatusIndicator: React.FC<{ status: GitStatus; isLarge?: boolean }> = ({ status, isLarge=false }) => {
    const styles = {
        [GitStatus.New]: { text: 'New', color: 'text-green-700', bg: 'bg-green-100' },
        [GitStatus.Modified]: { text: 'Modified', color: 'text-yellow-700', bg: 'bg-yellow-100' },
        [GitStatus.Conflicted]: { text: 'Conflict', color: 'text-red-700', bg: 'bg-red-100' },
        [GitStatus.Unmodified]: { text: 'Unmodified', color: 'text-gray-700', bg: 'bg-gray-100' },
    };
    const style = styles[status];
    return <span className={`px-2 py-1 ${isLarge ? 'text-sm' : 'text-xs'} font-medium rounded-full ${style.bg} ${style.color}`}>{style.text}</span>;
}

const ConflictResolver: React.FC<{
    conflict: { local: TestCase, remote: TestCase };
    onResolve: (resolved: TestCase) => void;
    onCancel: () => void;
}> = ({ conflict, onResolve, onCancel }) => {
    return (
        <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-lg">
            <h4 className="font-bold text-red-800">Merge Conflict: {conflict.local.name}</h4>
            <p className="text-sm text-red-600">A conflict was detected. Please choose which version to keep.</p>
            <div className="mt-3 grid grid-cols-2 gap-4">
                <div className="border p-3 rounded-md bg-white">
                    <h5 className="font-semibold">Local Version</h5>
                    <p className="text-xs text-gray-500 mt-1 bg-gray-100 p-2 rounded">{conflict.local.description}</p>
                    <button onClick={() => onResolve(conflict.local)} className="mt-2 w-full text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Keep Local</button>
                </div>
                <div className="border p-3 rounded-md bg-white">
                    <h5 className="font-semibold">Remote Version</h5>
                    <p className="text-xs text-gray-500 mt-1 bg-gray-100 p-2 rounded">{conflict.remote.description}</p>
                    <button onClick={() => onResolve(conflict.remote)} className="mt-2 w-full text-xs px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Keep Remote</button>
                </div>
            </div>
             <button onClick={onCancel} className="mt-2 text-xs text-gray-500 hover:underline">Cancel Pull</button>
        </div>
    )
}

const GitSyncModal: React.FC<GitSyncModalProps> = ({ isOpen, onClose, changedFiles, conflictedFiles, onPush, onPull, onResolve }) => {
    const [commitMessage, setCommitMessage] = useState('');
    const [isPushing, setIsPushing] = useState(false);
    const [isPulling, setIsPulling] = useState(false);
    const [conflictData, setConflictData] = useState<{ local: TestCase, remote: TestCase } | null>(null);
    
    if (!isOpen) return null;

    const handlePush = async () => {
        if (!commitMessage.trim()) {
            alert('Commit message is required.');
            return;
        }
        setIsPushing(true);
        await onPush(commitMessage);
        setIsPushing(false);
        setCommitMessage('');
        onClose();
    };
    
    const handlePull = async () => {
        setIsPulling(true);
        const conflict = await onPull();
        if (conflict) {
            setConflictData(conflict);
        } else {
             onClose();
        }
        setIsPulling(false);
    }
    
    const handleResolve = (resolvedTestCase: TestCase) => {
        onResolve(resolvedTestCase.id, resolvedTestCase);
        setConflictData(null); // Conflict is resolved, clear it
    }

    const totalChanges = changedFiles.length + conflictedFiles.length;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 animate-fade-in-down">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                        <GitIcon />
                        <h2 className="text-xl font-bold text-gray-800">Git Sync</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                </div>
                
                {conflictData ? (
                    <ConflictResolver conflict={conflictData} onResolve={handleResolve} onCancel={() => setConflictData(null)} />
                ) : (
                <>
                    <div className="flex space-x-2 mb-4">
                        <button 
                            onClick={handlePull}
                            disabled={isPulling || isPushing}
                            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 flex justify-center items-center"
                        >
                            {isPulling && <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                            {isPulling ? 'Pulling...' : 'Pull Changes'}
                        </button>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <h3 className="font-semibold text-gray-800">Changes ({totalChanges})</h3>
                        {totalChanges > 0 ? (
                             <ul className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                                {[...conflictedFiles, ...changedFiles].map(file => (
                                    <li key={file.id} className="flex justify-between items-center bg-white p-2 rounded-md border">
                                        <span className="text-sm text-gray-700">{file.name}</span>
                                        <GitStatusIndicator status={file.gitStatus} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 mt-2">No changes to commit.</p>
                        )}
                    </div>
    
                    {totalChanges > 0 && (
                        <div className="mt-4">
                             <label htmlFor="commitMessage" className="block text-sm font-medium text-gray-700">Commit Message</label>
                             <input
                                type="text"
                                id="commitMessage"
                                value={commitMessage}
                                onChange={(e) => setCommitMessage(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="e.g., Fix login button selector"
                            />
                        </div>
                    )}
                </>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button 
                        onClick={handlePush} 
                        disabled={totalChanges === 0 || isPushing || isPulling || conflictData !== null}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                    >
                         {isPushing && <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                        {isPushing ? 'Pushing...' : `Commit & Push ${totalChanges} File(s)`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GitSyncModal;