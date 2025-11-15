
import React from 'react';

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  maxValue?: number;
  unit?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, maxValue = 10, unit = '/10' }) => {
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
          <h3 className="text-sm font-medium">{title}</h3>
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
