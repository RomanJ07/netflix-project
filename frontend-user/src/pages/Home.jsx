import MovieHero from "../components/movies/MovieHero";
import MovieList from "../components/movies/MovieList";
import Navbar from "../components/common/Navbar";
import Footer from "../components/layout/Footer";
import moviesData from "../../../data/movies.json";

function Home() {
  // Le premier film pour le Hero
  const heroMovie = moviesData[0];

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

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <MovieHero movie={heroMovie} />
      <div className="container mx-auto">
        <MovieList title="Films populaires" movies={popularMovies} />
        <MovieList title="Science-Fiction" movies={sciFiMovies} />
        <MovieList title="Films récents" movies={recentMovies} />
      </div>
      <Footer />
    </div>
  );
}

export default Home;