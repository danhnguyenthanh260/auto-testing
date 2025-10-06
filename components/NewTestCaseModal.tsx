import React, { useState } from 'react';
import { TestCase } from '../types';

interface NewTestCaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newTestCase: Omit<TestCase, 'id' | 'lastRun' | 'lastRunDate' | 'creator' | 'steps' | 'gitStatus' | 'history'>) => void;
}

const NewTestCaseModal: React.FC<NewTestCaseModalProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<'UI' | 'API'>('UI');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        if (!name.trim()) {
            alert('Test case name is required.');
            return;
        }
        onSave({
            name,
            type,
            description,
            tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
            status: 'Draft',
        });
        onClose();
        // Reset form
        setName('');
        setType('UI');
        setDescription('');
        setTags('');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 animate-fade-in-down">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">New Test Case</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="e.g., User Login - Valid Credentials"
                        />
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value as 'UI' | 'API')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        >
                            <option>UI</option>
                            <option>API</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="A brief description of the test case."
                        />
                    </div>
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                        <input
                            type="text"
                            id="tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="e.g., smoke, regression, login"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700">Save Test Case</button>
                </div>
            </div>
        </div>
    );
};

export default NewTestCaseModal;