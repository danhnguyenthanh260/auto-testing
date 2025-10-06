import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProjectsList from './components/ProjectsList';
import TestCasesList from './components/TestCasesList';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Header from './components/Header';
import TestCaseDetail from './components/TestCaseDetail';
import GitSyncModal from './components/GitSyncModal';
import Loader from './components/Loader';
import { useTestCases } from './hooks/useTestCases';
import { useTestCaseMutation } from './hooks/useTestCaseMutation';
import { View, TestCase, TestStatus, GitStatus } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [isGitModalOpen, setIsGitModalOpen] = useState(false);

  const { testCases, testSuites, setTestCases, isLoading, error } = useTestCases();

  const handleMutationSuccess = (updatedOrNewCase: TestCase) => {
      setTestCases(prev => {
        const index = prev.findIndex(tc => tc.id === updatedOrNewCase.id);
        if (index > -1) {
            // Update existing
            const newCases = [...prev];
            newCases[index] = updatedOrNewCase;
            return newCases;
        } else {
            // Add new
            return [updatedOrNewCase, ...prev];
        }
      });
      // Also update selected test case if it's the one being modified
      if (selectedTestCase?.id === updatedOrNewCase.id) {
        setSelectedTestCase(updatedOrNewCase);
      }
  };

  const { createTestCase, updateTestCase: mutateTestCase } = useTestCaseMutation({
    onSuccess: handleMutationSuccess
  });

  const changedFiles = useMemo(() => testCases.filter(tc => tc.gitStatus === GitStatus.Modified || tc.gitStatus === GitStatus.New), [testCases]);

  const handleViewTestCase = (testCase: TestCase) => {
    setSelectedTestCase(testCase);
    setCurrentView(View.TestCaseDetail);
  };

  const handleBackToList = () => {
    setSelectedTestCase(null);
    setCurrentView(View.TestCases);
  };
  
  const handleUpdateTestCase = async (updatedTestCase: TestCase, markAsModified: boolean = true) => {
    const newStatus = (markAsModified && updatedTestCase.gitStatus !== GitStatus.New) 
      ? GitStatus.Modified 
      : updatedTestCase.gitStatus;
    
    const finalTestCase = { ...updatedTestCase, gitStatus: newStatus };
    await mutateTestCase(finalTestCase);
  };

  const handleCreateTestCase = async (newTestCaseData: Omit<TestCase, 'id' | 'lastRun' | 'lastRunDate' | 'creator' | 'steps' | 'gitStatus' | 'history'>) => {
    const newTestCase: Omit<TestCase, 'id'> = {
        ...newTestCaseData,
        lastRun: TestStatus.Skipped,
        lastRunDate: 'N/A',
        creator: 'QA Engineer',
        steps: [],
        gitStatus: GitStatus.New,
        history: [],
    };
    await createTestCase(newTestCase);
  };
  
  const handlePush = async (commitMessage: string) => {
    const newCommit = {
        hash: Math.random().toString(36).substring(2, 9),
        message: commitMessage,
        author: 'QA Engineer',
        date: new Date().toISOString().split('T')[0],
    };

    const promises = changedFiles.map(tc => {
      const updatedTestCase = {
        ...tc,
        gitStatus: GitStatus.Unmodified,
        history: [newCommit, ...tc.history],
      };
      return handleUpdateTestCase(updatedTestCase, false);
    });
    
    await Promise.all(promises);
  };
  
  const handlePull = async () => {
    const conflictedTestCaseId = 'tc-002';
    const remoteChangesDescription = "Remote change: Added validation for empty password field.";
    const remoteTestCase = testCases.find(tc => tc.id === conflictedTestCaseId);

    if (!remoteTestCase) return;

    const localConflictVersion = { 
        ...remoteTestCase, 
        description: "Local change: Updated login error message text.",
        gitStatus: GitStatus.Conflicted 
    };

    await handleUpdateTestCase(localConflictVersion, false);
    
    // We need to return the updated local version from the state
    const updatedLocal = testCases.find(tc => tc.id === conflictedTestCaseId) || localConflictVersion;

    return {
      local: updatedLocal,
      remote: { ...remoteTestCase, description: remoteChangesDescription },
    }
  };

  const handleResolveConflict = async (testCaseId: string, resolvedTestCase: TestCase) => {
     const resolvedWithStatus = {
        ...resolvedTestCase,
        gitStatus: GitStatus.Modified 
     };
     await handleUpdateTestCase(resolvedWithStatus, false);
  };
  
  const renderMainContent = () => {
    if (isLoading) {
        return <Loader message="Connecting to API..." />;
    }
    if (error) {
        return (
          <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-2xl font-bold text-red-700">API Connection Error</h2>
            <p className="mt-2 text-red-600">Could not connect to the mock API server. (Error: {error})</p>
            <p className="mt-4 text-gray-700">
              Please make sure the mock API server is running in a separate terminal.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              You can start it by running <code className="bg-gray-200 p-1 rounded font-mono">npm run start:api</code> from your project directory.
            </p>
          </div>
        );
    }
    return renderContent();
  }

  const renderContent = () => {
    switch (currentView) {
      case View.Dashboard:
        return <Dashboard />;
      case View.Projects:
        return <ProjectsList />;
      case View.TestCases:
        return <TestCasesList 
                  testCases={testCases}
                  testSuites={testSuites}
                  onViewTestCase={handleViewTestCase} 
                  onCreateTestCase={handleCreateTestCase}
                  onUpdateTestCase={handleUpdateTestCase}
               />;
      case View.Reports:
        return <Reports />;
      case View.Settings:
        return <Settings />;
      case View.TestCaseDetail:
        return selectedTestCase ? (
            <TestCaseDetail 
                testCase={selectedTestCase} 
                onBack={handleBackToList} 
                onTestCaseUpdate={handleUpdateTestCase}
            />
        ) : <TestCasesList 
              testCases={testCases}
              testSuites={testSuites}
              onViewTestCase={handleViewTestCase} 
              onCreateTestCase={handleCreateTestCase}
              onUpdateTestCase={handleUpdateTestCase}
            />;
      default:
        return <Dashboard />;
    }
  };
  
  const getTitle = () => {
    if (currentView === View.TestCaseDetail) {
      const statusIndicator = selectedTestCase?.gitStatus === GitStatus.Modified ? ' *' : (selectedTestCase?.gitStatus === GitStatus.New ? ' +' : '');
      return (selectedTestCase?.name || 'Test Case Detail') + statusIndicator;
    }
    const titles: Record<View, string> = {
      [View.Dashboard]: 'Dashboard',
      [View.Projects]: 'Projects',
      [View.TestCases]: 'Test Cases',
      [View.Reports]: 'Reports',
      [View.Settings]: 'Settings',
      [View.TestCaseDetail]: 'Test Case Detail'
    };
    return titles[currentView] || 'Dashboard';
  }

  return (
    <>
      <GitSyncModal 
        isOpen={isGitModalOpen}
        onClose={() => setIsGitModalOpen(false)}
        changedFiles={changedFiles}
        conflictedFiles={testCases.filter(tc => tc.gitStatus === GitStatus.Conflicted)}
        onPush={handlePush}
        onPull={handlePull}
        onResolve={handleResolveConflict}
      />
      <div className="flex h-screen bg-gray-100 font-sans">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title={getTitle()} changedFilesCount={changedFiles.length} onGitSyncClick={() => setIsGitModalOpen(true)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 md:p-8">
            {renderMainContent()}
          </main>
        </div>
      </div>
    </>
  );
};

export default App;