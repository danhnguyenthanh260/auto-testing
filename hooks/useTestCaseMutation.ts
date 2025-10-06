import { useState } from 'react';
import { TestCase } from '../types';

const API_URL = 'http://localhost:3001';

interface UseTestCaseMutationProps {
    onSuccess: (testCase: TestCase) => void;
}

// Helper to simulate network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useTestCaseMutation = ({ onSuccess }: UseTestCaseMutationProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const createTestCase = async (newTestCaseData: Omit<TestCase, 'id'>) => {
        setIsCreating(true);
        try {
            await sleep(500); // Simulate latency
            const response = await fetch(`${API_URL}/testCases`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTestCaseData),
            });
            if (!response.ok) throw new Error('Failed to create test case.');
            
            const createdTestCase = await response.json();
            onSuccess(createdTestCase);
        } catch (err) {
            console.error(err);
            // Optionally handle error state
        } finally {
            setIsCreating(false);
        }
    };

    const updateTestCase = async (testCaseToUpdate: TestCase) => {
        setIsUpdating(true);
        try {
            await sleep(700); // Simulate latency
            const response = await fetch(`${API_URL}/testCases/${testCaseToUpdate.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testCaseToUpdate),
            });
            if (!response.ok) throw new Error('Failed to update test case.');

            const savedTestCase = await response.json();
            onSuccess(savedTestCase);
        } catch (err) {
            console.error(err);
            // Optionally handle error state
        } finally {
            setIsUpdating(false);
        }
    };

    return {
        createTestCase,
        updateTestCase,
        isCreating,
        isUpdating,
        isMutating: isCreating || isUpdating,
    };
};
