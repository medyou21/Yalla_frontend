// src/utils/auth.js
import {jwtDecode} from "jwt-decode";

export const setToken = (token) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const removeToken = () => localStorage.removeItem("token");

// ✅ Récupère l'utilisateur depuis le JWT
export const getUser = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    return {
      _id: decoded.id,
      roles: decoded.roles || [], // 🔥 IMPORTANT
    };
  } catch (err) {
    console.error("Erreur decode JWT:", err);
    return null;
  }
};

// ✅ Vérifie si l'utilisateur est connecté
export const isAuthenticated = () => !!getToken();