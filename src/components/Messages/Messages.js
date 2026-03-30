import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

// Socket global (évite de recréer plusieurs connexions)
const socket = io("http://localhost:5000");

const Messages = ({ user }) => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Charger les messages reçus
  useEffect(() => {
    if (!user) return; // ne rien faire si pas connecté

    // Écoute des messages
    socket.on("receiveMessage", (data) => {
      setChat((prev) => [...prev, data]);
    });

    // Cleanup pour éviter les doublons
    return () => socket.off("receiveMessage");
  }, [user]); // Déclenché quand l'utilisateur change

  // Scroll automatique vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Envoyer un message
  const sendMessage = () => {
    if (!message.trim() || !user) return;

    const msgData = {
      id: Date.now(),
      user: user.name,
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    socket.emit("sendMessage", msgData);
    setChat((prev) => [...prev, msgData]);
    setMessage("");
  };

  // Si l'utilisateur n'est pas connecté
  if (!user) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px", fontSize: "18px" }}>
        Veuillez vous connecter pour accéder au chat.
      </p>
    );
  }

  return (
    <div className="messages-container">
      <h2>Messagerie</h2>

      <div className="messages-list">
        {chat.map((msg) => (
          <div
            key={msg.id}
            className={`message-bubble ${msg.user === user.name ? "my-message" : "other-message"}`}
          >
            {msg.user !== user.name && <span className="avatar">{msg.user[0].toUpperCase()}</span>}
            <div>
              <span><b>{msg.user}</b>: {msg.text}</span>
              <div className="timestamp">{msg.timestamp}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Écrire un message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Envoyer</button>
      </div>
    </div>
  );
};

export default Messages;