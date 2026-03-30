// src/context/SocketContext.js
import { createContext, useContext } from "react";

// Création du context
export const SocketContext = createContext(null);

// Hook pour récupérer le socket
export const useSocket = () => useContext(SocketContext);