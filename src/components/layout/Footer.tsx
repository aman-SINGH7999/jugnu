import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-white">My Virtual School</h2>
          <p className="mt-2 text-sm">
            Master your knowledge with our interactive online tests and progress tracking.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/tests" className="hover:text-blue-400">Tests</Link></li>
            <li><Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link></li>
            <li><Link href="/about" className="hover:text-blue-400">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-blue-400">Contact</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-white font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4">
            <Link href="#"><span className="hover:text-blue-400">🌐</span></Link>
            <Link href="#"><span className="hover:text-blue-400">🐦</span></Link>
            <Link href="#"><span className="hover:text-blue-400">📘</span></Link>
            <Link href="#"><span className="hover:text-blue-400">📸</span></Link>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} My Virtual School. All rights reserved.
      </div>
    </footer>
  );
}
