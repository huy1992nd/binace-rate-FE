import { io, Socket } from "socket.io-client";

interface RateData {
  symbol: string;
  price: string; // Binance API may return this as a string
}

const SOCKET_URL = "http://localhost:3001"; // Ensure backend is running

const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"], // Ensure WebSocket is used
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
});

socket.on("connect", () => console.log("🔌 Connected to WebSocket server"));
socket.on("disconnect", () => console.log("🔌 Disconnected from WebSocket server"));
socket.on("connect_error", (error) => console.error("❌ Connection error:", error));
socket.on("reconnect_attempt", () => console.log("🔄 Reconnecting..."));

export const subscribeToRates = (callback: (data: RateData) => void) => {
  socket.emit("subscribeToRate", { topPairs: [] }); // Empty array to get all pairs

  const handleRateUpdate = (data: RateData) => {
    callback(data);
  };

  socket.on("rateUpdate", handleRateUpdate);

  return () => {
    socket.off("rateUpdate", handleRateUpdate); // Ensure correct cleanup
  };
};

export default socket;
