// components/ScheduleCard.tsx
import React from 'react';
import Card from '../ui/Card';
import { Clock, Calendar, GraduationCap } from 'lucide-react';

interface ScheduleCardProps {
  title: string;
  type: string;
  subjectIcon?: React.ReactNode;
  description: string;
  date: string; // exam date
  startTime: string;
  endTime: string;
  duration: number; // minutes
  badgeColor?: 'blue' | 'green' | 'purple' | 'orange';
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  title,
  type,
  subjectIcon,
  description,
  date,
  startTime,
  endTime,
  duration,
  badgeColor = 'purple',
}) => {
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
        <h2 className="text-lg font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
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
        <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center shadow-sm">
          {subjectIcon || <GraduationCap className="w-8 h-8 text-purple-600" />}
        </div>
        <div>
          <p className="text-sm text-gray-600">{description}</p>
          <p className="text-xl font-semibold text-gray-400 mt-1 flex items-center gap-1">
            <Calendar className="w-6 h-6 text-gray-500" />
            {date}
          </p>
        </div>
      </div>

      {/* Timing & Duration */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-600" />
          <span className="text-sm text-gray-700">
            {startTime} – {endTime}
          </span>
        </div>
        <div className="text-xs font-medium text-gray-500">
          Duration: {duration} min
        </div>
      </div>
    </Card>
  );
};

export default ScheduleCard;
