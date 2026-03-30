// src/context/SocketProvider.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getToken } from "../utils/auth";
import { SocketContext } from "./SocketContext";

export const SocketProvider = ({ user, children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;

    const newSocket = io("http://localhost:5000", {
      auth: { token: getToken() },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => console.log("🟢 Socket connecté:", newSocket.id));
    newSocket.on("disconnect", (reason) => console.log("🔴 Socket déconnecté:", reason));
    newSocket.on("connect_error", (err) => console.error("❌ Socket error:", err.message));

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [user]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};