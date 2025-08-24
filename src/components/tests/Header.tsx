// components/Header.tsx
import Image from 'next/image';

interface HeaderProb {
  heading: string,
}
const Header = ({heading}:HeaderProb) => {
  return (
    <header className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
      <h1 className="text-4xl font-bold text-gray-600">{heading}</h1>
      <Image
        src="/user-icon.jpeg"
        alt="User"
        width={40}
        height={40}
        className="w-10 h-10 rounded-full object-cover"
      />
    </header>
  );
};

export default Header;