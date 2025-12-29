export default function Footer() {
  return (
    <footer className="bg-white border-t border-orange-100 py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex justify-center items-center space-x-2 mb-4">
          <div className="bg-orange-500 p-2 rounded-lg text-white">
            <i className="fas fa-paw"></i>
          </div>
          <span className="text-xl font-bold text-gray-800">PetWiki</span>
        </div>
        <p className="text-gray-500 text-sm">© 2024 PetWiki. All things dogs and cats for pet lovers everywhere.</p>
        <div className="flex justify-center space-x-4 mt-4 text-gray-400">
           <i className="fab fa-instagram hover:text-orange-400 cursor-pointer"></i>
           <i className="fab fa-facebook hover:text-orange-400 cursor-pointer"></i>
           <i className="fab fa-twitter hover:text-orange-400 cursor-pointer"></i>
        </div>
      </div>
    </footer>
  );
}



