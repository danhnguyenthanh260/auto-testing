import { useState, useEffect } from 'react';
import { TestCase, TestSuite } from '../types';

const API_URL = 'http://localhost:3001';

export const useTestCases = () => {
    const [testCases, setTestCases] = useState<TestCase[]>([]);
    const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [casesRes, suitesRes] = await Promise.all([
                    fetch(`${API_URL}/testCases`),
                    fetch(`${API_URL}/testSuites`)
                ]);

                if (!casesRes.ok || !suitesRes.ok) {
                    throw new Error('Failed to fetch data');
                }

                const casesData = await casesRes.json();
                const suitesData = await suitesRes.json();

                // Sort test cases by last run date or creation
                setTestCases(casesData.sort((a: TestCase, b: TestCase) => (b.lastRunDate > a.lastRunDate) ? 1 : -1));
                setTestSuites(suitesData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return { testCases, testSuites, setTestCases, isLoading, error };
};
