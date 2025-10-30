import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { getAddressFromStorage } from "@/lib/storage";
// import { toast } from "react-hot-toast"; // ✅ Uncomment if you use toast notifications

/**
 * Hook: useAlerts
 * Listens to backend alerts (price, volume, pair, portfolio, and global notifications)
 * and shows them via browser notifications (and optional in-app toasts).
 */
export const useAlerts = () => {
  useEffect(() => {
    const walletAddress = getAddressFromStorage();

    // Initialize socket connection
    const socket: Socket = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      console.log("🟢 Connected to alerts socket:", socket.id);
    });

    socket.on("disconnect", () => {
      console.warn("🔴 Disconnected from alerts socket");
    });

    /**
     * 🔔 Global Notifications (shown to all users)
     */
    socket.on("globalNotification", ({ title, message, link }) => {
      console.log("🌍 Global Notification:", title, message);
      showBrowserNotification(title, message, link);
      // toast.success(`${title}: ${message}`); // Optional UI toast
    });

    /**
     * 💬 Wallet-Based Alerts
     */
    const alertTypes = [
      "priceAlert",
      "pairAlert",
      "volumeAlert",
      "portfolioAlert",
    ];

    alertTypes.forEach((type) => {
      socket.on(type, ({ message, address }) => {
        // Only show if alert belongs to connected wallet
        if (
          !walletAddress ||
          address?.toLowerCase() !== walletAddress.toLowerCase()
        )
          return;

        const title = type.replace("Alert", " Alert");
        showBrowserNotification(title, message);
        // toast.success(`${title}: ${message}`); // Optional toast
      });
    });

    // Cleanup when unmounted
    return () => {
      socket.disconnect();
      console.log("⚪ Socket disconnected on unmount");
    };
  }, []);
};

/**
 * Utility: Browser Notification Helper
 */
function showBrowserNotification(
  title: string,
  message: string,
  link?: string
) {
  if (!("Notification" in window)) {
    console.warn("🚫 Browser does not support notifications.");
    return;
  }

  const showNotification = () => {
    const notification = new Notification(title, {
      body: message,
      icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    });

    notification.onclick = () => {
      if (link) {
        window.open(link, "_blank");
      }else {
        window.focus();
      }
    };
  };

  // If permission is already granted
  if (Notification.permission === "granted") {
    showNotification();
    return;
  }

  // If permission not yet asked, request it
  if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, {
          body: message,
          icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
        });
      }
    });
  }
}
