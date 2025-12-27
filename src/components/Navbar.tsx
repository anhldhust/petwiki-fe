'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-orange-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-orange-500 p-2 rounded-lg text-white">
                <i className="fas fa-paw"></i>
              </div>
              <span className="text-2xl font-bold text-gray-800 tracking-tight">PetWiki</span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-8 font-medium">
            <Link href="/" className="text-gray-600 hover:text-orange-500 transition-colors">Home</Link>
            <Link href="/dictionary" className="text-gray-600 hover:text-orange-500 transition-colors">Dictionary</Link>
            <Link href="/gallery" className="text-gray-600 hover:text-orange-500 transition-colors">Gallery</Link>
          </div>
          <div className="md:hidden">
             <i className="fas fa-bars text-gray-500 text-xl cursor-pointer"></i>
          </div>
        </div>
      </div>
    </nav>
  );
}

