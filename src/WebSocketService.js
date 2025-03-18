import { io } from "socket.io-client";

const SOCKET_URL = "http://3.107.84.195:3000/"; // Ensure this matches your backend port

const socket = io(SOCKET_URL, {
  transports: ["websocket"], // Force WebSocket only
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
});

socket.on("connect", () => {
  console.log("✅ WebSocket Connected!");
});

socket.on("connect_error", (error) => {
  console.error("❌ WebSocket Connection Error:", error);
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ WebSocket Disconnected:", reason);
});

export const subscribeToRates = (callback) => {
  socket.emit("subscribeToRate"); // Ensure this event matches the NestJS event

  socket.on("rateUpdate", (data) => {
    callback(data);
  });

  // Cleanup event listener on unmount
  return () => {
    socket.off("rateUpdate");
  };
};

export default socket;
