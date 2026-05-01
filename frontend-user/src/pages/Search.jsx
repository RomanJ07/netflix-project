import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/layout/Footer";
import moviesData from "../../../data/movies.json";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [genreFilter, setGenreFilter] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");

  const genres = useMemo(() => ["all", ...new Set(moviesData.map((movie) => movie.genre))], []);

  const results = useMemo(() => {
    const normalizedQuery = query.toLowerCase();

    let filtered = moviesData.filter((movie) => {
      if (!normalizedQuery) {
        return true;
      }

      return (
        movie.title.toLowerCase().includes(normalizedQuery) ||
        movie.description.toLowerCase().includes(normalizedQuery)
      );
    });

    if (genreFilter !== "all") {
      filtered = filtered.filter((movie) => movie.genre === genreFilter);
    }

    if (sortBy === "rating") {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "year") {
      filtered = [...filtered].sort((a, b) => b.year - a.year);
    } else if (sortBy === "price") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    }

    return filtered;
  }, [query, genreFilter, sortBy]);

  const handleQueryChange = (e) => {
    const nextQ = e.target.value;
    if (nextQ) {
      setSearchParams({ q: nextQ });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="container mx-auto px-4 pt-28 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Recherche de films</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Rechercher (ex: inception)..."
            className="md:col-span-1 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-primary"
          />

          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-primary"
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre === "all" ? "Tous les genres" : genre}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-primary"
          >
            <option value="relevance">Tri: pertinence</option>
            <option value="rating">Tri: note</option>
            <option value="year">Tri: année</option>
            <option value="price">Tri: prix</option>
          </select>
        </div>

        <p className="text-gray-400 mb-6">{results.length} résultat(s)</p>

        {results.length === 0 ? (
          <p className="text-gray-300">Aucun résultat pour cette recherche.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((movie) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="bg-gray-900/70 border border-gray-800 rounded-lg p-3 hover:border-gray-500 transition"
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-56 object-cover rounded mb-3"
                />
                <h2 className="font-semibold mb-1 line-clamp-1">{movie.title}</h2>
                <p className="text-sm text-gray-400">{movie.genre}</p>
                <p className="text-sm text-gray-400">
                  {movie.year} • {movie.rating}/10
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Search;
