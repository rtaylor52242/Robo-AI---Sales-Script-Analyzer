
import React from 'react';
import { Improvement } from '../types';

interface ImprovementCardProps {
  improvement: Improvement;
  index: number;
}

const ImprovementCard: React.FC<ImprovementCardProps> = ({ improvement, index }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-cyan-500/20 hover:ring-1 hover:ring-cyan-500">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
          {index + 1}
        </div>
        <p className="text-gray-300 italic">"{improvement.explanation}"</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-red-400 mb-2">Before</h4>
          <p className="bg-red-900/30 text-red-200 p-3 rounded-md text-sm font-mono">
            {improvement.before}
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-green-400 mb-2">After</h4>
          <p className="bg-green-900/30 text-green-200 p-3 rounded-md text-sm font-mono">
            {improvement.after}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImprovementCard;
