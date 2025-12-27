import { createContext, useContext, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  saveAuthData,
  getUserData,
  clearAuthData,
  getAccessToken,
} from "@/utils/storage";
import { router } from "expo-router";
import { AuthContextType, User } from "@/types/type";

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export default AuthContext;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;

  // Cargar datos del usuario al iniciar la app (persistencia)
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const [userData, token] = await Promise.all([
        getUserData(),
        getAccessToken(),
      ]);

      if (userData && token) {
        setUser(userData);
        console.log("✅ Sesión restaurada:", userData);
      } else {
        console.log("ℹ️ No hay sesión guardada");
      }
    } catch (error) {
      console.error("❌ Error al cargar datos de usuario:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string, refreshToken: string, userData: User) => {
    try {
      // Guardar en almacenamiento seguro
      await saveAuthData(token, refreshToken, userData);

      // Actualizar estado
      setUser(userData);

      console.log("✅ Login exitoso:", userData);
    } catch (error) {
      console.error("❌ Error al hacer login:", error);
      throw error;
    }
  };

  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      // Limpiar almacenamiento
      await clearAuthData();

      // Limpiar estado
      setUser(null);

      // Limpiar caché de TanStack Query
      queryClient.clear();

      // Redirigir a login
      router.replace("/(auth)/login");

      console.log("✅ Logout exitoso");
    } catch (error) {
      console.error("❌ Error al hacer logout:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
};
