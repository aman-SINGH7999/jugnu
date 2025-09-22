import React from 'react';

// Base Loader Interface
interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'purple' | 'green' | 'red' | 'yellow' | 'gray' | 'white';
  className?: string;
}

// Size mappings
const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const colorClasses = {
  blue: 'border-blue-500',
  purple: 'border-purple-500',
  green: 'border-green-500',
  red: 'border-red-500',
  yellow: 'border-yellow-500',
  gray: 'border-gray-500',
  white: 'border-white'
};

// 1. Spinning Circle Loader
export const SpinnerLoader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  color = 'blue', 
  className = '' 
}) => {
  return (
    <div className={`inline-block ${className}`}>
      <div 
        className={`${sizeClasses[size]} border-2 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
};

// 2. Pulsing Dots Loader
export const PulseDotsLoader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  color = 'blue', 
  className = '' 
}) => {
  const dotSize = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  const bgColorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    gray: 'bg-gray-500',
    white: 'bg-white'
  };

  return (
    <div className={`flex space-x-1 ${className}`}>
      <div className={`${dotSize[size]} ${bgColorClasses[color]} rounded-full animate-pulse`}></div>
      <div className={`${dotSize[size]} ${bgColorClasses[color]} rounded-full animate-pulse`} style={{ animationDelay: '0.1s' }}></div>
      <div className={`${dotSize[size]} ${bgColorClasses[color]} rounded-full animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
    </div>
  );
};

// 3. Bouncing Dots Loader
export const BouncingDotsLoader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  color = 'blue', 
  className = '' 
}) => {
  const dotSize = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  const bgColorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    gray: 'bg-gray-500',
    white: 'bg-white'
  };

  return (
    <div className={`flex space-x-1 ${className}`}>
      <div className={`${dotSize[size]} ${bgColorClasses[color]} rounded-full animate-bounce`}></div>
      <div className={`${dotSize[size]} ${bgColorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
      <div className={`${dotSize[size]} ${bgColorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
    </div>
  );
};

// 4. Progress Bar Loader
interface ProgressLoaderProps extends LoaderProps {
  progress?: number; // 0-100
  showPercentage?: boolean;
}

export const ProgressLoader: React.FC<ProgressLoaderProps> = ({ 
  size = 'md', 
  color = 'blue', 
  className = '',
  progress = 50,
  showPercentage = false
}) => {
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4'
  };

  const bgColorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    gray: 'bg-gray-500',
    white: 'bg-white'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full ${heights[size]} bg-gray-200 rounded-full overflow-hidden`}>
        <div 
          className={`${heights[size]} ${bgColorClasses[color]} transition-all duration-300 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-sm text-gray-600 mt-1 text-center">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

// 5. Skeleton Loader
interface SkeletonLoaderProps {
  lines?: number;
  className?: string;
  avatar?: boolean;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  lines = 3, 
  className = '',
  avatar = false
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {avatar && (
        <div className="flex items-center space-x-4 mb-4">
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className={`h-4 bg-gray-300 rounded ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 6. Ripple Loader
export const RippleLoader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  color = 'blue', 
  className = '' 
}) => {
  const containerSize = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const borderColorClasses = {
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    green: 'border-green-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500',
    gray: 'border-gray-500',
    white: 'border-white'
  };

  return (
    <div className={`relative ${containerSize[size]} ${className}`}>
      <div className={`absolute inset-0 rounded-full border-2 ${borderColorClasses[color]} opacity-75 animate-ping`}></div>
      <div className={`absolute inset-0 rounded-full border-2 ${borderColorClasses[color]} opacity-50 animate-ping`} style={{ animationDelay: '0.5s' }}></div>
    </div>
  );
};

// 7. Card Loader (for content cards)
export const CardLoader: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`border rounded-lg p-4 shadow-sm ${className}`}>
      <div className="animate-pulse">
        <div className="h-32 bg-gray-300 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

// 8. Page Overlay Loader
interface OverlayLoaderProps {
  isVisible: boolean;
  message?: string;
  loader?: React.ReactNode;
}

export const OverlayLoader: React.FC<OverlayLoaderProps> = ({ 
  isVisible, 
  message = 'Loading...', 
  loader 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg text-center">
        <div className="mb-4">
          {loader || <SpinnerLoader size="lg" color="blue" />}
        </div>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
};

// 9. Button Loader
interface ButtonLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export const ButtonWithLoader: React.FC<ButtonLoaderProps> = ({ 
  isLoading, 
  children, 
  disabled = false,
  className = '',
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`relative px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {isLoading && (
        <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <SpinnerLoader size="sm" color="white" />
        </span>
      )}
      <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  );
};

// 10. Table Row Loader
export const TableRowLoader: React.FC<{ columns: number; rows?: number }> = ({ 
  columns, 
  rows = 5 
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-4 py-3">
              <div className="h-4 bg-gray-300 rounded"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};