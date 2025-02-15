import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SaveImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, description: string) => void;
    isLoading: boolean;
}

const SaveImageModal: React.FC<SaveImageModalProps> = ({
    isOpen,
    onClose,
    onSave,
    isLoading
}) => {
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(title, description);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-lg shadow-2xl w-[90%] max-w-md border border-blue-500/30">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Save Drawing</h2>
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-300 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-200">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="Enter title"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-200">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="Enter description"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <Button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-700 text-white hover:bg-gray-600 transition duration-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className={`text-white ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} transition duration-200`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="opacity-0">Save</span>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                </>
                            ) : (
                                'Save'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SaveImageModal;
