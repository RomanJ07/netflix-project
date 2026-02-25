import { useState } from "react";

function SearchBar({ movies = [], onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredSuggestions =
    searchTerm.length >= 2
      ? movies
          .filter(
            (movie) =>
              movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              movie.description.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(0, 5)
      : [];

  const handleSelect = (movie) => {
    setSearchTerm(movie.title);
    setIsOpen(false);
    if (onSearch) onSearch(movie);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher un film..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (searchTerm.length >= 2) setIsOpen(true);
          }}
          onBlur={() => setTimeout(() => setIsOpen(false), 100)}
          className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-white"
        />
        <svg
          className="absolute left-3 top-3 w-5 h-5 text-gray-400"
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
      </div>
      {isOpen && filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-lg mt-1">
          {filteredSuggestions.map((movie) => (
            <li
              key={movie.id}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onMouseDown={() => handleSelect(movie)}
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-10 h-14 object-cover rounded"
              />
              <span>{movie.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;