import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    return res.data;
  } catch (err) {
    return { error: err.response?.data?.msg || "Login failed" };
  }
};

export const registerUser = async (username, email, password) => {
  try {
    const res = await axios.post(`${API_URL}/register`, { username, email, password });
    return res.data;
  } catch (err) {
    return { error: err.response?.data?.msg || "Registration failed" };
  }
};
