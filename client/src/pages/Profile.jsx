import React, { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const baseUrl =
    import.meta.env.MODE === "development" ? "http://localhost:5003" : "";

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/user/verifytoken`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to verify token.");
        }

        setUser(data.data);
      } catch (err) {
        console.error("Verify token failed:", err);
        setError(err.message);
      }
    };

    fetchUserData();
  }, []);

  if (error) {
    return (
      <div className="text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-white p-4">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <section className="pt-32 pb-16 px-6 md:px-24 bg-gray-900 text-white space-y-16">
      <div className="p-6 max-w-xl mx-auto bg-white text-gray-900 rounded-lg shadow-lg border border-gray-300">
        <h1 className="text-2xl font-bold mb-4">👤 Profile</h1>
        <p>
          <strong>First Name:</strong> {user.firstName}
        </p>
        <p>
          <strong>Last Name:</strong> {user.lastName}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phoneNumber || "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {user.address || "N/A"}
        </p>
      </div>
    </section>
  );
}
