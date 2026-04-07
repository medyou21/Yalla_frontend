import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import API from "../../api/api";
import "./chat.css";

const RealtimeChat = ({ user, tripId, receiverId, receiverName }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const socket = useSocket();

  // 🔹 Historique
  useEffect(() => {
    if (!tripId || !user?._id || !receiverId) return;

    const fetch = async () => {
      try {
        const res = await API.get(
          `/messages?tripId=${tripId}&user1=${user._id}&user2=${receiverId}`
        );
        setChat(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetch();
  }, [tripId, user?._id, receiverId]);

  // 🔹 JOIN ROOM
  useEffect(() => {
    if (!socket || !tripId) return;
    socket.emit("joinRoom", tripId.toString());
  }, [socket, tripId]);

  // 🔹 RECEIVE MESSAGE (UNIQUE SOURCE)
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data) => {
      setChat((prev) => {
        const exists = prev.some((msg) => msg._id === data._id);
        if (exists) return prev;
        return [...prev, data];
      });
    };

    socket.on("receiveMessage", handleMessage);

    return () => socket.off("receiveMessage", handleMessage);
  }, [socket]);

  // 🔹 TYPING
  useEffect(() => {
    if (!socket) return;

    socket.on("userTyping", ({ userId }) => {
      if (userId !== user._id) setTypingUser(userId);
    });

    socket.on("userStopTyping", () => setTypingUser(null));

    return () => {
      socket.off("userTyping");
      socket.off("userStopTyping");
    };
  }, [socket, user._id]);

  // 🔹 ONLINE USERS
  useEffect(() => {
    if (!socket) return;

    socket.on("onlineUsers", setOnlineUsers);

    return () => socket.off("onlineUsers");
  }, [socket]);

  // 🔹 SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // 🔹 TYPING HANDLER
  const handleTyping = (e) => {
    setMessage(e.target.value);

    socket.emit("typing", { tripId });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { tripId });
    }, 1000);
  };

  // 🔹 SEND MESSAGE (SANS DOUBLON)
  const sendMessage = () => {
    if (!message.trim()) return;

    const msg = {
      senderId: user._id,
      senderName: user.name,
      receiverId,
      tripId,
      message,
    };

    socket.emit("sendMessage", msg);

    // ❌ PAS de setChat ici !
    setMessage("");
  };

  if (!user) return <p>Connectez-vous</p>;

  return (
    <div className="chatContainer">

      {/* HEADER */}
      <div className="chatHeader">
        {receiverName} {onlineUsers.includes(receiverId) ? "🟢" : "⚫"}
      </div>

      {/* MESSAGES */}
      <div className="messagesContainer">
        {chat.map((msg) => {
          const senderId =
            typeof msg.senderId === "object"
              ? msg.senderId._id
              : msg.senderId;

          const isMine = senderId === user._id;

          return (
            <div
              key={msg._id}
              className={`messageRow ${isMine ? "mine" : "other"}`}
            >
              <div className="messageBubble">
                {msg.message}
              </div>
            </div>
          );
        })}

        {typingUser && (
          <div className="typingText">{receiverName} écrit...</div>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      {/* INPUT */}
      <div className="inputContainer">
        <input
          value={message}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Message..."
        />
        <button onClick={sendMessage}>Envoyer</button>
      </div>

    </div>
  );
};

export default RealtimeChat;