import React from 'react';
import { TestStep, TestStepType, ApiMethod } from '../types';
import { NavigateIcon, ClickIcon, InputIcon, AssertIcon, ApiCallIcon } from './icons/TestStepIcons';
import { TrashIcon } from './icons/ActionIcons';

interface TestStepEditorProps {
    step: TestStep;
    onChange: (step: TestStep) => void;
    onDelete: () => void;
}

const ICONS: Record<TestStepType, React.ReactNode> = {
    [TestStepType.Navigate]: <NavigateIcon />,
    [TestStepType.Click]: <ClickIcon />,
    [TestStepType.Input]: <InputIcon />,
    [TestStepType.Assert]: <AssertIcon />,
    [TestStepType.ApiCall]: <ApiCallIcon />,
};

const InputField: React.FC<{ label: string, value: string, placeholder: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, value, placeholder, onChange }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500">{label}</label>
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="mt-1 block w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
    </div>
);

const TextAreaField: React.FC<{ label: string, value: string, placeholder: string, rows?: number, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }> = ({ label, value, placeholder, rows = 3, onChange }) => (
    <div className="md:col-span-2">
        <label className="block text-xs font-medium text-gray-500">{label}</label>
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="mt-1 block w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary font-mono"
        />
    </div>
);


const TestStepEditor: React.FC<TestStepEditorProps> = ({ step, onChange, onDelete }) => {
    const handleFieldChange = (field: keyof TestStep, value: string) => {
        const updatedStep = { ...step, [field]: value };
        // If we change method to something that doesn't have a body, clear the body
        if (field === 'method' && value !== 'POST' && value !== 'PUT') {
            delete updatedStep.body;
        }
        onChange(updatedStep);
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as TestStepType;
        const updatedStep = { ...step, type: newType };

        // Clear value if the new type is not 'Input'
        if (newType !== TestStepType.Input) {
            delete updatedStep.value;
        }
        // Clear API fields if new type is not 'ApiCall'
        if (newType !== TestStepType.ApiCall) {
            delete updatedStep.method;
            delete updatedStep.body;
        } else {
            // Set default method if it doesn't exist
            updatedStep.method = updatedStep.method || 'GET';
        }
        onChange(updatedStep);
    }
    
    return (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <div className="text-gray-400">{ICONS[step.type]}</div>
                    <select value={step.type} onChange={handleTypeChange} className="text-sm font-semibold bg-transparent border-none focus:ring-0 p-0">
                        {Object.values(TestStepType).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <button onClick={onDelete} className="text-gray-400 hover:text-red-500">
                    <TrashIcon />
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                    label="Step Name / Description"
                    value={step.name}
                    placeholder="e.g., Navigate to Login Page"
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                />
                <InputField
                    label="Target (Selector / URL / API Endpoint)"
                    value={step.target}
                    placeholder="e.g., #login-button or /api/users"
                    onChange={(e) => handleFieldChange('target', e.target.value)}
                />
                {step.type === TestStepType.Input && (
                     <InputField
                        label="Value to Input"
                        value={step.value || ''}
                        placeholder="e.g., user@example.com"
                        onChange={(e) => handleFieldChange('value', e.target.value)}
                    />
                )}
                {step.type === TestStepType.ApiCall && (
                    <>
                        <div>
                            <label className="block text-xs font-medium text-gray-500">Method</label>
                            <select
                                value={step.method || 'GET'}
                                onChange={(e) => handleFieldChange('method', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            >
                                <option>GET</option>
                                <option>POST</option>
                                <option>PUT</option>
                                <option>DELETE</option>
                            </select>
                        </div>
                        {(step.method === 'POST' || step.method === 'PUT') && (
                            <TextAreaField
                                label="Request Body (JSON)"
                                value={step.body || ''}
                                placeholder='e.g., { "key": "value" }'
                                onChange={(e) => handleFieldChange('body', e.target.value)}
                                rows={4}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TestStepEditor;