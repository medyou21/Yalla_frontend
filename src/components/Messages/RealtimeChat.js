import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../context/SocketContext"; // hook direct socket
import API from "../../api/api";

const RealtimeChat = ({ user, tripId, receiverId, receiverName }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const messagesEndRef = useRef(null);

  const socket = useSocket(); // socket direct depuis le contexte

  // 🔹 Charger historique des messages
  useEffect(() => {
    if (!tripId || !user?._id || !receiverId) return;

    const fetchHistory = async () => {
      try {
        const res = await API.get(
          `/messages?tripId=${tripId}&user1=${user._id}&user2=${receiverId}`
        );
        setChat(res.data || []);
      } catch (err) {
        console.error("Erreur récupération historique:", err);
      }
    };

    fetchHistory();
  }, [tripId, user?._id, receiverId]);

  // 🔹 Rejoindre la room via socket
  useEffect(() => {
    if (!socket || !tripId) return;

    socket.emit("joinRoom", tripId);
    console.log("📡 Rejoint room :", tripId);
  }, [tripId, socket]);

  // 🔹 Réception messages temps réel
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data) => {
      // ❌ Ignorer mon propre message pour éviter le doublon
      if (data.senderId === user._id) return;

      setChat((prev) => [...prev, data]);
    };

    socket.on("receiveMessage", handleMessage);

    return () => socket.off("receiveMessage", handleMessage);
  }, [socket, user._id]);

  // 🔹 Scroll automatique vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // 🔹 Envoyer message
  const sendMessage = () => {
    if (!message.trim() || !socket) return;

    const msgData = {
      senderId: user._id,
      senderName: user.name,
      receiverId,
      receiverName,
      tripId,
      message,
    };

    // Émettre sur le socket
    socket.emit("sendMessage", msgData);

    // Ajouter localement pour affichage immédiat
    setChat((prev) => [
      ...prev,
      { ...msgData, _id: Date.now(), createdAt: new Date() },
    ]);

    setMessage("");
  };

  if (!user)
    return (
      <p style={{ textAlign: "center", marginTop: "40px" }}>
        Connectez-vous pour utiliser le chat
      </p>
    );

  return (
    <div className="chat-container">
      <div className="messages">
        {chat.map((msg) => {
          const senderId =
            typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;
          const senderName = msg.senderName || "Utilisateur";
          const isMine = senderId === user._id;

          return (
            <div
              key={msg._id}
              className={`message-bubble ${isMine ? "my-message" : "other-message"}`}
            >
              <div className="avatar">{(senderName[0] || "U").toUpperCase()}</div>
              <div>
                <b>{isMine ? "Vous" : senderName}</b> : {msg.message}
                <div className="timestamp">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="chat-input-container">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tapez votre message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Envoyer</button>
      </div>
    </div>
  );
};

export default RealtimeChat;