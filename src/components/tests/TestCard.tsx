// components/TestCard.tsx
import React from 'react';
import Card from '../ui/Card';
import { Clock, GraduationCap } from 'lucide-react';

interface TestCardProps {
  title: string;
  type: string;
  subjectIcon?: React.ReactNode;
  description: string;
  startTime: string;
  endTime: string;
  totalDuration: number; // in minutes
  remainingMinutes: number;
  onActionClick: () => void;
  actionLabel?: string;
  badgeColor?: 'blue' | 'green' | 'purple' | 'orange';
}

const TestCard: React.FC<TestCardProps> = ({
  title,
  type,
  subjectIcon,
  description,
  startTime,
  endTime,
  totalDuration,
  remainingMinutes,
  onActionClick,
  actionLabel = "Start",
  badgeColor = "blue",
}) => {
  // Calculate progress percentage
  const progress = Math.max(0, Math.min(100, ((totalDuration - remainingMinutes) / totalDuration) * 100));

  // Badge color mapping
  const badgeColors = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
  };

  return (
    <Card className="min-w-80 bg-yellow-50 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 group">
      {/* Header with Title & Badge */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
          {title}
        </h2>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${badgeColors[badgeColor]}`}
        >
          {type}
        </span>
      </div>

      {/* Subject Icon + Info */}
      <div className="flex items-center space-x-3 mb-5">
        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center shadow-sm">
          {subjectIcon || <GraduationCap className="w-8 h-8 text-blue-600" />}
        </div>
        <div>
          <p className="text-sm text-gray-600">{description}</p>
          <p className="text-xs text-gray-400 mt-1">Starts at {startTime}</p>
        </div>
      </div>

      {/* Timer Section */}
      <div className="space-y-2 mb-5">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <span className="text-base font-medium text-gray-800">
            {remainingMinutes} min remaining
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 font-medium">
          <span>{startTime}</span>
          <span>{endTime}</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onActionClick}
        className="w-full py-2.5 bg-blue-600 text-white text-lg font-medium tracking-wide rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        {actionLabel}
      </button>
    </Card>
  );
};

export default TestCard;