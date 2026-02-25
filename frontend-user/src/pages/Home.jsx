import MovieHero from "../components/movies/MovieHero";
import {useState} from "react";
import MovieFilter from "../components/movies/MovieFilter";
import MovieList from "../components/movies/MovieList";
import Navbar from "../components/common/Navbar";
import Footer from "../components/layout/Footer";
import moviesData from "../../../data/movies.json";

function Home() {
  // Le premier film pour le Hero
  const heroMovie = moviesData[0];
  const [allMovies] = useState(moviesData);
  const [filteredMovies, setFilteredMovies] = useState(moviesData);
  // Panier global
  const [cartItems, setCartItems] = useState([]);

  // 5 films populaires au hasard
  const getRandomMovies = (movies, count) => {
    const shuffled = [...movies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  const popularMovies = getRandomMovies(moviesData, 5);

  // 5 films de Science-Fiction
  const sciFiMovies = moviesData
    .filter((movie) => movie.genre === "Science-Fiction")
    .slice(0, 5);

  // Films récents (après 2010)
  const recentMovies = moviesData.filter((movie) => movie.year > 2010);

  // Ajout au panier
  const handleAddToCart = (movie) => {
    setCartItems((prev) => prev.find((m) => m.id === movie.id) ? prev : [...prev, movie]);
  };
  // Suppression du panier
  const handleRemoveFromCart = (id) => {
    setCartItems((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} />
      <MovieHero movie={heroMovie} onAddToCart={handleAddToCart} />
      <div className="container mx-auto">
        <MovieFilter movies={allMovies} onFilter={setFilteredMovies} />
        <MovieList title="Films disponibles" movies={filteredMovies} onAddToCart={handleAddToCart} />
        <MovieList title="Films populaires" movies={popularMovies} onAddToCart={handleAddToCart} />
        <MovieList title="Science-Fiction" movies={sciFiMovies} onAddToCart={handleAddToCart} />
        <MovieList title="Films récents" movies={recentMovies} onAddToCart={handleAddToCart} />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
