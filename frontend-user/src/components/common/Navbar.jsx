import { useState } from "react";
import PropTypes from "prop-types";
import SearchBar from "../movies/SearchBar";
import CartButton from "./CartButton";
import moviesData from "../../../../data/movies.json";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
function Navbar({ cartItems, onRemoveFromCart }) {
  const [isScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  const navClassName = ({ isActive }) =>
    isActive
      ? "text-primary font-bold"
      : "text-gray-300 hover:text-white transition-colors";

  // Note : useEffect sera vu au TP 03
  // Pour l'instant, version statique
  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-colors duration-300
${isScrolled ? "bg-black" : "bg-gradient-to-b from-black/80 to-transparent"}`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <NavLink to="/" className="text-primary text-3xl font-bold tracking-tight">
              NETFLIX
            </NavLink>

            {/* Navigation Links */}
            <ul className="hidden md:flex space-x-6">
              <li>
                <NavLink to="/" end className={navClassName}>
                  Accueil
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-rentals" className={navClassName}>
                  Mes locations
                </NavLink>
              </li>
            </ul>
          </div>
          {/* User Section */}
          <div className="flex items-center space-x-4">
            <SearchBar
              movies={moviesData}
              onSearch={(movie) => navigate(`/movie/${movie.id}`)}
            />
            <CartButton cartItems={cartItems} onRemoveFromCart={onRemoveFromCart} />
            {isAuthenticated() ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2"
                >
                  <img
                    src={
                      user?.avatar ||
                      "https://ui-avatars.com/api/?name=User&background=e50914&color=fff"
                    }
                    alt={user?.name || "Utilisateur"}
                    className="w-8 h-8 rounded cursor-pointer hover:ring-2 hover:ring-primary transition"
                  />
                  <span className="hidden md:block text-sm">{user?.name || "Utilisateur"}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/95 backdrop-blur-lg border border-gray-800 rounded-lg shadow-xl py-2">
                    <NavLink
                      to="/my-rentals"
                      className="block px-4 py-2 hover:bg-gray-800 transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Mes locations
                    </NavLink>
                    <hr className="border-gray-800 my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-800 transition text-red-400"
                    >
                      Deconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/login"
                className="px-4 py-2 bg-primary hover:bg-primary-dark rounded transition"
              >
                Connexion
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  cartItems: PropTypes.array,
  onRemoveFromCart: PropTypes.func,
};

export default Navbar;
