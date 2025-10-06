import React from 'react';
import { TestStep, TestStepType } from '../types';
import TestStepEditor from './TestStepEditor';

interface TestStepBuilderProps {
    steps: TestStep[];
    onStepsChange: (steps: TestStep[]) => void;
}

const TestStepBuilder: React.FC<TestStepBuilderProps> = ({ steps, onStepsChange }) => {
    
    const handleStepChange = (index: number, updatedStep: TestStep) => {
        const newSteps = [...steps];
        newSteps[index] = updatedStep;
        onStepsChange(newSteps);
    };

    const handleDeleteStep = (index: number) => {
        const newSteps = steps.filter((_, i) => i !== index);
        onStepsChange(newSteps);
    };

    const handleAddUiStep = () => {
        const newStep: TestStep = {
            id: `step-${Date.now()}`,
            type: TestStepType.Navigate,
            name: 'New UI Step',
            target: '/home',
        };
        onStepsChange([...steps, newStep]);
    };

    const handleAddApiStep = () => {
        const newStep: TestStep = {
            id: `step-${Date.now()}`,
            type: TestStepType.ApiCall,
            name: 'New API Call',
            target: '/api/v1/users',
            method: 'GET',
        };
        onStepsChange([...steps, newStep]);
    };

    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Test Steps</h3>
            </div>
            <div className="p-4 space-y-4">
                {steps.length > 0 ? (
                    steps.map((step, index) => (
                        <TestStepEditor 
                            key={step.id} 
                            step={step} 
                            onChange={(updatedStep) => handleStepChange(index, updatedStep)}
                            onDelete={() => handleDeleteStep(index)}
                        />
                    ))
                ) : (
                    <p className="py-8 text-center text-gray-500">No steps defined. Add the first step to begin.</p>
                )}
            </div>
            <div className="p-4 border-t border-gray-200 flex space-x-2">
                <button 
                    onClick={handleAddUiStep}
                    className="flex-1 text-center py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    + Add UI Step
                </button>
                 <button 
                    onClick={handleAddApiStep}
                    className="flex-1 text-center py-2 bg-purple-100 text-purple-700 font-medium rounded-md hover:bg-purple-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    + Add API Call Step
                </button>
            </div>
        </div>
    );
};

export default TestStepBuilder;