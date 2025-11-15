import React from 'react';
import { HistoryItem } from '../types';

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.134H8.09c-1.18 0-2.09.954-2.09 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

interface HistoryPanelProps {
    history: HistoryItem[];
    onSelectItem: (item: HistoryItem) => void;
    onDeleteItem: (id: string) => void;
    onClearHistory: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelectItem, onDeleteItem, onClearHistory }) => {
    
    const getScoreColor = (score: number) => {
        if (score < 40) return 'bg-red-500 text-red-100';
        if (score < 70) return 'bg-amber-500 text-amber-100';
        return 'bg-green-500 text-green-100';
    };
    
    return (
        <div className="bg-gray-800/50 rounded-xl p-6 shadow-2xl border border-gray-700 backdrop-blur-sm h-full flex flex-col max-h-[calc(100vh-10rem)]">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-200">Script History</h2>
                {history.length > 0 && (
                    <button onClick={onClearHistory} className="text-sm text-gray-400 hover:text-red-400 transition-colors font-semibold">
                        Clear All
                    </button>
                )}
            </div>
            <div className="flex-grow overflow-y-auto -mr-3 pr-3">
                {history.length === 0 ? (
                    <div className="text-center text-gray-500 pt-10 h-full flex flex-col items-center justify-center">
                        <p className='font-semibold'>No saved scripts yet.</p>
                        <p className="text-sm mt-1">Your saved analyses will appear here.</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {history.map(item => (
                            <li key={item.id}>
                                <div className="bg-gray-800 rounded-lg p-3 flex justify-between items-center transition-all duration-200 ring-1 ring-gray-700 hover:ring-cyan-500 hover:shadow-lg hover:shadow-cyan-900/50">
                                    <button onClick={() => onSelectItem(item)} className="text-left flex-grow mr-2 overflow-hidden">
                                        <p className="font-semibold text-white truncate">{item.title}</p>
                                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                            <span>{new Date(item.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getScoreColor(item.analysis.overallScore)}`}>
                                                Score: {item.analysis.overallScore}
                                            </span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteItem(item.id);
                                        }}
                                        className="ml-2 p-2 rounded-full flex-shrink-0 text-gray-500 hover:bg-red-900/50 hover:text-red-400 transition-colors"
                                        aria-label={`Delete script titled ${item.title}`}
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default HistoryPanel;