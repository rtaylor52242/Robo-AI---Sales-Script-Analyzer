
import React from 'react';

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  maxValue?: number;
  unit?: string;
  tooltip?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, maxValue = 10, unit = '/10', tooltip }) => {
  const isScore = unit === '/10';
  
  const getBarColor = (val: number, max: number) => {
    const percentage = (val / max) * 100;
    if (percentage < 40) return 'bg-red-500';
    if (percentage < 70) return 'bg-amber-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 flex flex-col justify-between shadow-lg h-full">
      <div>
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">{title}</h3>
            {tooltip && (
              <div className="relative group">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  className="w-4 h-4 cursor-help text-gray-500 hover:text-cyan-400 transition-colors"
                >
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                </svg>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-xs text-center text-gray-200 rounded border border-gray-600 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 pointer-events-none">
                  {tooltip}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            )}
          </div>
          <div className="w-6 h-6">{icon}</div>
        </div>
        <p className="text-3xl font-bold text-white">
          {value}
          {isScore && <span className="text-xl font-medium text-gray-400">{unit}</span>}
        </p>
      </div>
      {isScore && (
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
          <div
            className={`${getBarColor(value, maxValue)} h-2.5 rounded-full`}
            style={{ width: `${(value / maxValue) * 100}%`, transition: 'width 0.5s ease-out' }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default MetricCard;