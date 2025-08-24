// components/ResourceCard.tsx
import Image from 'next/image';

const ResourceCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center space-x-3">
        <Image
          src="/user-icon.jpeg"
          alt="Teacher"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h3 className="font-medium text-gray-800">Study materials</h3>
          <p className="text-sm text-gray-500">FAQ, study materials</p>
        </div>
        <div className="ml-auto text-gray-400">••••</div>
      </div>
    </div>
  );
};

export default ResourceCard;