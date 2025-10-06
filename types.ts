export enum View {
    Dashboard = 'Dashboard',
    Projects = 'Projects',
    TestCases = 'TestCases',
    Reports = 'Reports',
    Settings = 'Settings',
    TestCaseDetail = 'TestCaseDetail'
}

export enum TestStatus {
    Passed = 'Passed',
    Failed = 'Failed',
    Running = 'Running',
    Skipped = 'Skipped',
}

export enum TestStepType {
    Navigate = 'Navigate',
    Click = 'Click',
    Input = 'Input',
    Assert = 'Assert',
    ApiCall = 'ApiCall',
}

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export enum GitStatus {
    Unmodified = 'Unmodified',
    Modified = 'Modified',
    New = 'New',
    Conflicted = 'Conflicted',
}

export interface GitCommit {
    hash: string;
    message: string;
    author: string;
    date: string;
}

export interface TestStep {
    id: string;
    type: TestStepType;
    name: string;
    target: string; // e.g., CSS selector or API endpoint
    value?: string; // e.g., text to input
    method?: ApiMethod; // For ApiCall
    body?: string; // For ApiCall (JSON string)
}

export interface TestCase {
    id: string;
    name: string;
    description?: string;
    type: 'UI' | 'API';
    status: 'Draft' | 'Active' | 'Archived';
    tags: string[];
    lastRun: TestStatus;
    lastRunDate: string;
    creator: string;
    steps: TestStep[];
    gitStatus: GitStatus;
    history: GitCommit[];
}

export interface TestSuite {
    id: string;
    name: string;
    description: string;
    testCaseIds: string[];
}

export interface Project {
    id: string;
    name: string;
    description: string;
    testCaseCount: number;
    lastActivity: string;
}

export interface TestRun {
    id: string;
    suiteName: string;
    status: TestStatus;
    startTime: string;
    duration: string;
    passed: number;
    failed: number;
    total: number;
}