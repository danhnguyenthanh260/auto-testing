import React, { useState, useMemo } from 'react';
import { TestCase, TestStatus, TestSuite, GitStatus } from '../types';
import NewTestCaseModal from './NewTestCaseModal';
import SuiteIcon from './icons/SuiteIcon';

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

const Tag: React.FC<{ name: string }> = ({ name }) => (
    <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs font-mono rounded-md mr-1">{name}</span>
);

const GitStatusIndicator: React.FC<{ status: GitStatus }> = ({ status }) => {
    const indicators = {
        [GitStatus.New]: <span className="text-green-500 font-bold" title="New">+</span>,
        [GitStatus.Modified]: <span className="text-yellow-500 font-bold" title="Modified">*</span>,
        [GitStatus.Conflicted]: <span className="text-red-500 font-bold" title="Conflicted">!</span>,
        [GitStatus.Unmodified]: null,
    };
    return <div className="w-4 text-center">{indicators[status]}</div>;
}

interface TestCasesListProps {
  testCases: TestCase[];
  testSuites: TestSuite[];
  onViewTestCase: (testCase: TestCase) => void;
  onCreateTestCase: (testCase: Omit<TestCase, 'id' | 'lastRun' | 'lastRunDate' | 'creator' | 'steps' | 'gitStatus' | 'history'>) => void;
  onUpdateTestCase: (testCase: TestCase, markAsModified?: boolean) => void;
}

type ActiveTab = 'cases' | 'suites';

const TestCasesList: React.FC<TestCasesListProps> = ({ testCases, testSuites, onViewTestCase, onCreateTestCase, onUpdateTestCase }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<ActiveTab>('cases');

    const handleRunTest = (testCaseId: string) => {
        const testCase = testCases.find(tc => tc.id === testCaseId);
        if (!testCase) return;
        onUpdateTestCase({ ...testCase, lastRun: TestStatus.Running }, false);
        
        setTimeout(() => {
            const result = Math.random() > 0.3 ? TestStatus.Passed : TestStatus.Failed;
            onUpdateTestCase({ ...testCase, lastRun: result, lastRunDate: new Date().toLocaleString() }, true);
        }, Math.random() * 2000 + 1000);
    };

    const handleRunSuite = (suiteId: string) => {
      const suite = testSuites.find(s => s.id === suiteId);
      if (!suite) return;

      suite.testCaseIds.forEach(tcId => {
          const testCase = testCases.find(tc => tc.id === tcId);
          if(testCase) onUpdateTestCase({ ...testCase, lastRun: TestStatus.Running }, false);
      });

      setTimeout(() => {
         suite.testCaseIds.forEach(tcId => {
             const testCase = testCases.find(tc => tc.id === tcId);
             if(testCase) {
                const result = Math.random() > 0.2 ? TestStatus.Passed : TestStatus.Failed; // 80% pass rate for suites
                onUpdateTestCase({ ...testCase, lastRun: result, lastRunDate: new Date().toLocaleString() }, true);
             }
         });
      }, Math.random() * 2000 + 3000);
    };

    const getSuiteStatus = (suite: TestSuite): TestStatus => {
      const suiteTestCases = testCases.filter(tc => suite.testCaseIds.includes(tc.id));
      if (suiteTestCases.some(tc => tc.lastRun === TestStatus.Running)) return TestStatus.Running;
      if (suiteTestCases.some(tc => tc.lastRun === TestStatus.Failed)) return TestStatus.Failed;
      if (suiteTestCases.length > 0 && suiteTestCases.every(tc => tc.lastRun === TestStatus.Passed)) return TestStatus.Passed;
      return TestStatus.Skipped;
    }

    const filteredTestCases = useMemo(() => {
        if (!searchQuery) return testCases;
        const lowercasedQuery = searchQuery.toLowerCase();
        return testCases.filter(tc =>
            tc.name.toLowerCase().includes(lowercasedQuery) ||
            tc.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
        );
    }, [searchQuery, testCases]);

  return (
    <>
      <NewTestCaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onCreateTestCase}
      />
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <input 
              type="text" 
              placeholder="Search by name or tag..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
              New Test Case
          </button>
        </div>

        <div className="border-b border-gray-200 mb-4">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                    onClick={() => setActiveTab('cases')}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'cases' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    Test Cases
                </button>
                <button
                    onClick={() => setActiveTab('suites')}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'suites' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    Test Suites
                </button>
            </nav>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'cases' ? (
             <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-4"></th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Run</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTestCases.map((tc) => (
                  <tr key={tc.id} className="hover:bg-gray-50">
                    <td className="px-2 py-4 whitespace-nowrap"><GitStatusIndicator status={tc.gitStatus} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tc.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tc.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <StatusBadge status={tc.lastRun} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tc.tags.map(tag => <Tag key={tag} name={tag} />)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tc.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        onClick={() => handleRunTest(tc.id)}
                        disabled={tc.lastRun === TestStatus.Running}
                        className="text-indigo-600 hover:text-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        Run
                      </button>
                      <button onClick={() => onViewTestCase(tc)} className="text-gray-600 hover:text-gray-900">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suite Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Case Statuses</th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testSuites.map(suite => {
                  const suiteStatus = getSuiteStatus(suite);
                  const isRunning = suiteStatus === TestStatus.Running;
                  const suiteTestCases = suite.testCaseIds.map(id => testCases.find(tc => tc.id === id)).filter(Boolean) as TestCase[];

                  return (
                    <tr key={suite.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                        <SuiteIcon />
                        <span className="ml-2">{suite.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{suite.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          {suiteTestCases.map(tc => {
                            const colorClasses = {
                              [TestStatus.Passed]: 'bg-green-500',
                              [TestStatus.Failed]: 'bg-red-500',
                              [TestStatus.Running]: 'bg-blue-500 animate-pulse',
                              [TestStatus.Skipped]: 'bg-gray-400',
                            };
                            return (
                              <span key={tc.id} className="group relative">
                                <span className={`block w-3 h-3 rounded-full ${colorClasses[tc.lastRun]}`}></span>
                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                  {tc.name}
                                </span>
                              </span>
                            );
                          })}
                          <span className="text-sm text-gray-500 ml-2">({suiteTestCases.length})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <StatusBadge status={suiteStatus} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                         <button 
                          onClick={() => handleRunSuite(suite.id)}
                          disabled={isRunning}
                          className="text-indigo-600 hover:text-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          Run Suite
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default TestCasesList;