import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  const animationClass = 'animate-[fade-in_0.3s_ease-out]';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className={`bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-700 max-w-2xl w-full text-gray-300 ${animationClass}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">How to Use the Analyzer</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
            aria-label="Close help dialog"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4 text-gray-300">
          <p>This tool helps you refine your sales scripts by providing an AI-powered analysis and actionable feedback. Follow these simple steps:</p>
          <ol className="list-decimal list-inside space-y-3 pl-2">
            <li>
              <strong>Paste Your Script:</strong> Write or paste the sales script you want to analyze into the main text area.
            </li>
            <li>
              <strong>Analyze:</strong> Click the "Analyze Script" button. The AI will process your text, which might take a few seconds.
            </li>
            <li>
              <strong>Review Your Score:</strong> Check your "Overall Score" on the gauge. This gives you a quick snapshot of your script's effectiveness.
            </li>
            <li>
              <strong>Examine Metrics:</strong> Dive into the specific metrics like Hook Strength, Pain Point Clarity, and CTA Strength to see where you excel and where you can improve.
            </li>
            <li>
              <strong>Implement Improvements:</strong> Read through the "Actionable Improvements" section. The AI provides specific before-and-after examples to make your script more compelling.
            </li>
             <li>
              <strong>Save & Compare:</strong> After analyzing, you can save the result to your "Script History". This allows you to track your progress and compare different versions of your copy.
            </li>
          </ol>
        </div>

        <div className="mt-8 text-right">
          <button
            onClick={onClose}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
