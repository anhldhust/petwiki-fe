'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/dictionary?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/id/1025/1600/900" 
            alt="Hero Background" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Every Pet Has a Story.
          </h1>
          <p className="text-xl text-white mb-8 opacity-90 leading-relaxed drop-shadow-md">
            Dive into the world of dogs and cats. From loyal companions to curious felines, discover everything you need to know about your favorite breeds.
          </p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
            <div className="relative flex-grow">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                placeholder="Search breeds (e.g., Golden Retriever, Siamese)..."
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-xl"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-xl active:scale-95">
              Explore
            </button>
          </form>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Discover by Category</h2>
          <div className="w-24 h-1 bg-orange-400 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            onClick={() => router.push('/dictionary?type=dog')}
            className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-2xl transition-transform hover:-translate-y-2"
          >
            <img src="https://picsum.photos/id/237/800/600" alt="Dogs" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-3xl font-bold text-white mb-2">Canine Kingdom</h3>
              <p className="text-gray-200">Man's best friend in every shape and size.</p>
            </div>
          </div>

          <div 
            onClick={() => router.push('/dictionary?type=cat')}
            className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-2xl transition-transform hover:-translate-y-2"
          >
            <img src="https://picsum.photos/id/40/800/600" alt="Cats" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-3xl font-bold text-white mb-2">Feline Friends</h3>
              <p className="text-gray-200">Elegant hunters and cuddly companions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Facts Section */}
      <section className="bg-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <div className="text-4xl text-orange-500 mb-4"><i className="fas fa-book-open"></i></div>
            <h4 className="text-xl font-bold mb-2">Breed Encyclopedia</h4>
            <p className="text-gray-600">Comprehensive guides for hundreds of breeds worldwide.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <div className="text-4xl text-orange-500 mb-4"><i className="fas fa-history"></i></div>
            <h4 className="text-xl font-bold mb-2">Rich History</h4>
            <p className="text-gray-600">Learn about origins and the legacy of each companion.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <div className="text-4xl text-orange-500 mb-4"><i className="fas fa-images"></i></div>
            <h4 className="text-xl font-bold mb-2">AI Gallery</h4>
            <p className="text-gray-600">See and generate amazing pet content on the fly.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
