import { getAddressFromStorage } from "@/lib/storage";
import { useEffect } from "react";
import { io } from "socket.io-client";
export const useAlerts = () => {
  useEffect(() => {
    const walletAddress = getAddressFromStorage();
    if (!walletAddress) return;
    // Connect to backend socket
    const socket = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ["websocket"],
    });
    socket.on("connect", () => {
      console.log(":large_green_circle: Connected to alerts socket");
    });
    // Listen for price alerts
    socket.on("priceAlert", (data) => {
      const { message, address } = data;
      if (address !== walletAddress) return;
      showBrowserNotification("Price Alert", message);
    });
    // Listen for pair alerts
    socket.on("pairAlert", (data) => {
      const { message, address } = data;
      if (address !== walletAddress) return;
      showBrowserNotification(`Pair Alert`, message);
    });
    // Listen for pair alerts
    socket.on("volumeAlert", (data) => {
      const { message, address } = data;
      if (address !== walletAddress) return;
      showBrowserNotification(`Volume Alert`, message);
    });
    // Listen for portfolio alerts
    socket.on("portfolioAlert", (data) => {
      const { message, address } = data;
      if (address !== walletAddress) return;
      showBrowserNotification(`Portfolio Alert`, message);
    });
    socket.on("disconnect", () => {
      console.warn(":red_circle: Disconnected from alerts socket");
    });
    return () => {
      socket.disconnect();
    };
  }, []);
};
function showBrowserNotification(title: string, message: string) {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications.");
    return;
  }
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      new Notification(`${title} :rocket:`, {
        body: message,
        icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
      });
    } else {
      console.warn("Notification permission denied.");
    }
  });
}
