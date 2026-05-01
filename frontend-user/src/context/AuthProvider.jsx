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

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction de connexion
  const login = useCallback(async (email, password) => {
    try {
      // Simulation en attendant l'integration API.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!password) {
        throw new Error("Mot de passe requis");
      }

      const mockUser = {
        id: Date.now(),
        email,
        name: email.split("@")[0],
        avatar: `https://ui-avatars.com/api/?name=${email}&background=e50914&color=fff`,
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Fonction d'inscription
  const register = useCallback(async (name, email, password) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!password || password.length < 6) {
        throw new Error("Le mot de passe doit contenir au moins 6 caracteres");
      }

      const mockUser = {
        id: Date.now(),
        email,
        name,
        avatar: `https://ui-avatars.com/api/?name=${name}&background=e50914&color=fff`,
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Fonction de déconnexion
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = useCallback(() => {
    return !!user;
  }, [user]);

  // Mettre à jour le profil
  const updateProfile = useCallback((updates) => {
    const updatedUser = { ...user, ...updates }; //ça ne vous rappelle rien ?
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }, [user]);

  //On met à disposition les éléments pour être utilisés dans les composants
  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated,
      updateProfile,
    }),
    [
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated,
      updateProfile,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
// Hook personnalisé
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
