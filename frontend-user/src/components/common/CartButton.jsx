import { useState } from "react";

function CartButton({ cartItems = [], onRemoveFromCart = () => {} }) {
  const [showCart, setShowCart] = useState(false);
  const cartCount = cartItems.length;

  const toggleShow = () => {
    setShowCart((previousShow) => !previousShow);
  };

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onClick={toggleShow}
        className="relative hover:text-gray-300 transition"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7
13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2
0 014 0z"
          />
        </svg>

        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {cartCount}
          </span>
        )}
      </button>

      {showCart && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 z-50">
          {cartItems.length === 0 ? (
            <p className="text-sm text-gray-400">Votre panier est vide.</p>
          ) : (
            <>
              <p className="text-xs text-gray-400 mb-3">
                Double-cliquez sur un film pour le retirer du panier.
              </p>
              <ul className="space-y-3">
                {cartItems.map((movie) => (
                  <li
                    key={movie.id}
                    onDoubleClick={() => onRemoveFromCart(movie.id)}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 rounded p-2 transition"
                  >
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-10 h-14 rounded object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{movie.title}</p>
                      <p className="text-xs text-gray-400 truncate">{movie.genre}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary whitespace-nowrap">
                      {movie.price}€
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CartButton;