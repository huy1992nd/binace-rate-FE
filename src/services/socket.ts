import { io, Socket } from "socket.io-client";
const SOCKET_URL = process.env.REACT_APP_BACKEND_URL;

interface RateData {
  symbol: string;
  price: string; // Binance API may return this as a string
}

// const SOCKET_URL = "http://3.107.84.195:3000/"; // Ensure backend is running
// const SOCKET_URL = "http://localhost:3001/"; // Ensure backend is running

const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"], // Ensure WebSocket is used
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
});

// Handle WebSocket connection and errors
socket.on("connect", () => console.log("✅ WebSocket Connected"));
socket.on("connect_error", (error: Error) => console.error("❌ WebSocket Error:", error));
socket.on("disconnect", (reason: Socket.DisconnectReason) => 
  console.warn("⚠️ WebSocket Disconnected:", reason)
);
socket.on("reconnect_attempt", () => console.log("🔄 Reconnecting..."));

export const subscribeToRates = (callback: (data: RateData) => void) => {
  socket.emit("subscribeToRate", {"topPairs": ['BTCUSD']}); // Subscribe to Binance rate updates

  const handleRateUpdate = (data: RateData) => {
    callback(data);
  };

  socket.on("rateUpdate", handleRateUpdate);

  return () => {
    socket.off("rateUpdate", handleRateUpdate); // Ensure correct cleanup
  };
};

export default socket;
