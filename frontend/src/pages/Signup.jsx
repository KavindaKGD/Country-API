import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/AuthService";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const res = await registerUser(username, email, password);
    setLoading(false);
    
    if (res.error) {
      setError(res.error);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-3">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">
          🌍 Country Explorer
        </h2>
        <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center">
          Create your account
        </h3>
        
        {error && <div className="text-red-500 text-center mb-4 p-2 bg-red-50 rounded-md">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-blue-400' : 'bg-blue-700 hover:bg-blue-800'} text-white py-3 rounded-md transition flex justify-center`}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-5 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-700 cursor-pointer font-medium hover:underline"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
