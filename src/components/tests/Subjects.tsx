// components/Subjects.tsx
import { User, Book, FileText } from 'lucide-react';

const Subjects = () => {
  const subjectGroups = [
    [
      { name: "Mathematics", icon: User, color: "bg-blue-600" },
      { name: "History", icon: Book, color: "bg-purple-600" },
      { name: "English", icon: FileText, color: "bg-green-600" },
    ],
    [
      { name: "Science", icon: Book, color: "bg-blue-500" },
      { name: "History", icon: Book, color: "bg-purple-500" },
      { name: "English", icon: FileText, color: "bg-green-500" },
    ],
  ];

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Subjects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Group 1 - Blue */}
        <div className="bg-blue-600 rounded-xl p-3">
          {subjectGroups[0].map((subject, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 mb-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <div className={`${subject.color} w-6 h-6 rounded-full flex items-center justify-center`}>
                  <subject.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-black font-medium">{subject.name}</span>
              </div>
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ))}
        </div>

        {/* Group 2 - Light */}
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          {subjectGroups[1].map((subject, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 mb-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <div className={`${subject.color} w-6 h-6 rounded-full flex items-center justify-center`}>
                  <subject.icon className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-black">{subject.name}</span>
              </div>
              <div className="text-gray-400">••••</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subjects;