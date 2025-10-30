import React, { useEffect, useState } from "react";
import { GAMAdUnit } from "@/components/ads/GAMAdUnit";
const serverUrl = import.meta.env.VITE_BACKEND_URL;

interface EmailEntry {
  id: string;
  email: string;
  timestamp: string;
}

const EmailList = () => {
  const [emails, setEmails] = useState<EmailEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAccessGranted(true); // Will trigger the useEffect to load emails
  };

  useEffect(() => {
    if (!accessGranted) return;

    setLoading(true);
    fetch(`${serverUrl}/get-emails`, {
      headers: {
        "x-access-password": password,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setEmails(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch emails:", err);
        alert("Incorrect password or unable to fetch emails.");
        setLoading(false);
        setAccessGranted(false);
        setPassword(""); // Reset password
      });
  }, [accessGranted]);

  if (!accessGranted) {
    return (
      <div className="max-w-sm mx-auto mt-20 p-6 border rounded shadow">
        <h2 className="text-lg font-semibold mb-4">
          Enter Password to View Emails
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Ad Banner After Header */}
      <GAMAdUnit
        adUnitId="div-gpt-ad-1752654531765-0"
        size={[728, 90]}
        className="mb-6"
      />

      <h2 className="text-2xl font-bold mb-4 text-gray-800">📧 Saved Emails</h2>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : emails.length === 0 ? (
        <p className="text-gray-500">No emails found.</p>
      ) : (
        <div className="space-y-3">
          {emails.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition"
            >
              <p className="text-blue-600 font-medium text-lg">{item.email}</p>
              <p className="text-sm text-gray-500">
                Saved on: {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Ad Banner Before Footer */}
      <GAMAdUnit
        adUnitId="div-gpt-ad-1752654531765-1"
        size={[728, 90]}
        className="mt-6"
      />
    </div>
  );
};

export default EmailList;
