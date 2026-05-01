/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Charge et initialise le panier et les locations
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [rentals, setRentals] = useState(() => {
    const storedRentals = localStorage.getItem("rentals");
    return storedRentals ? JSON.parse(storedRentals) : [];
  });

  // Sauvegarde le panier et les locations a chaque modif
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("rentals", JSON.stringify(rentals));
  }, [rentals]);


  // Ajouter au panier
  const addToCart = useCallback((movie) => {
    setCart((prevCart) => {
      if (prevCart.some((item) => item.id === movie.id)) return prevCart;
      return [...prevCart, movie];
    });
  }, []);

  // Retirer du panier
  const removeFromCart = useCallback((movieId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== movieId));
  }, []);

  // Vider le panier
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Calculer le total
  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price || 0), 0);
  }, [cart]);

  // Nombre d'items
  const getCartCount = useCallback(() => {
    return cart.length;
  }, [cart]);

  // Louer un film
  const rentMovie = useCallback((movie) => {
    const rentalDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // 7 jours
    const rental = {
      id: Date.now(),
      movieId: movie.id,
      title: movie.title,
      poster: movie.poster,
      price: movie.price,
      rentalDate: rentalDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
    };
    // Mettre a jour la liste des films loues
    setRentals((prevRentals) => {
      if (prevRentals.some((r) => r.movieId === movie.id)) return prevRentals;
      return [...prevRentals, rental];
    });
    //Supprimer le film du panier
    setCart((prevCart) => prevCart.filter((item) => item.id !== movie.id));
    return { success: true, rental };
  }, []);

  // Louer tous les films du panier
  const rentAllInCart = useCallback(() => {
    const rentalDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    // Cree les nouvelles locations pour les films non encore loues
    const newRentals = cart
      .filter((movie) => !rentals.some((r) => r.movieId === movie.id))
      .map((movie) => ({
        id: Date.now() + movie.id,
        movieId: movie.id,
        title: movie.title,
        poster: movie.poster,
        price: movie.price,
        rentalDate: rentalDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
      }));

    setRentals((prevRentals) => [...prevRentals, ...newRentals]);
    // Vide le panier
    setCart([]);
    return { success: true, count: newRentals.length };
  }, [cart, rentals]);

  // Vérifier si un film est loué
  const isRented = useCallback((movieId) => {
    return rentals.some((rental) => rental.movieId === movieId);
  }, [rentals]);

  // Obtenir la location d'un film
  const getRentalByMovieId = useCallback((movieId) => {
    return rentals.find((rental) => rental.movieId === movieId) || null;
  }, [rentals]);

  // Vérifier si un film est dans le panier
  const isInCart = useCallback((movieId) => {
    return cart.some((item) => item.id === movieId);
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      rentals,
      addToCart,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartCount,
      rentMovie,
      rentAllInCart,
      isRented,
      getRentalByMovieId,
      isInCart,
    }),
    [
      cart,
      rentals,
      addToCart,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartCount,
      rentMovie,
      rentAllInCart,
      isRented,
      getRentalByMovieId,
      isInCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
