import { useState } from "react";
function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Recherche pour : ${searchTerm}`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Bouton de recherche */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:text-gray-300 transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
      {/* Input de recherche (apparaît au clic) */}
      {isOpen && (
        <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input 
              type="text" 
              value={searchTerm}
              onChange={handleChange}
              placeholder="Rechercher un film..."
              className="w-64 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-white"
              autoFocus
            />
            <button type="submit" className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-white">
              Rechercher
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
