import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/AuthService";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await registerUser(username, email, password);
    if (res.error) {
      setError(res.error);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Sign Up</h2>
        {error && <div className="text-red-500">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border rounded-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 rounded-md hover:bg-blue-800 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-700 cursor-pointer"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
