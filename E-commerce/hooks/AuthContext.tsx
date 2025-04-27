// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

type User = {
  id: number;
  name: string;
  email: string;
  role_id: number;
};

type AuthContextProps = {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await SecureStore.getItemAsync("token");
      const storedUser = await SecureStore.getItemAsync("user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    };

    loadToken();
  }, []);

  const login = async (token: string, user: User) => {
    setToken(token);
    setUser(user);

    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("user", JSON.stringify(user));
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
    Alert.alert("Sesión cerrada");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return context;
};
