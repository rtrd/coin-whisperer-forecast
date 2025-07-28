import React, { useEffect, useState } from "react";
const serverUrl = import.meta.env.VITE_SERVER_URL;
interface EmailEntry {
  id: string;
  email: string;
  timestamp: string;
}

const EmailList = () => {
  const [emails, setEmails] = useState<EmailEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${serverUrl}/get-emails`)
      .then((res) => res.json())
      .then((data) => {
        setEmails(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch emails:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
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
    </div>
  );
};

export default EmailList;
