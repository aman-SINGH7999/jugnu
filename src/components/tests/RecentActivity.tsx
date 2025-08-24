// components/RecentActivity.tsx
import { User, Book, FileText } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    { name: "Mathematics", icon: User, color: "bg-blue-600" },
    { name: "History", icon: Book, color: "bg-purple-600" },
    { name: "English", icon: FileText, color: "bg-green-600" },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Recent Activity</h2>
        <button className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-sm hover:bg-opacity-30 transition-colors">
          All
        </button>
      </div>
      <div className="space-y-2">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 ${activity.color} rounded-full flex items-center justify-center`}>
                <activity.icon className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium">{activity.name}</span>
            </div>
            <div className="text-xs text-white opacity-80">••••</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;