import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/AuthService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(email, password);
    if (res.error) {
      setError(res.error);
    } else {
      localStorage.setItem("token", res.token);
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Login</h2>
        {error && <div className="text-red-500">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-700 cursor-pointer"
          >
            Sign up here
          </span>
        </p>
      </div>
    </div>
  );
}
