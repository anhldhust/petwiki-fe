'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-orange-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
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
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-md p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <i className="fas fa-times text-xl"></i>
              ) : (
                <i className="fas fa-bars text-xl"></i>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-3 border-t border-orange-100">
            <Link
              href="/"
              className="block px-4 py-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-md transition-colors font-medium"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              href="/dictionary"
              className="block px-4 py-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-md transition-colors font-medium"
              onClick={closeMenu}
            >
              Dictionary
            </Link>
            <Link
              href="/gallery"
              className="block px-4 py-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-md transition-colors font-medium"
              onClick={closeMenu}
            >
              Gallery
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}



