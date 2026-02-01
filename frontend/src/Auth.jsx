import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL;

const LOGIN_URL = `${API_BASE}/api/auth/login`;
const REGISTER_URL = `${API_BASE}/api/auth/register`;

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const url = isLogin ? LOGIN_URL : REGISTER_URL;

    const payload = isLogin
      ? { email: form.email, password: form.password }
      : form;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Something went wrong");
      return;
    }

    if (isLogin) {
      localStorage.setItem("token", data.token);
      onAuthSuccess();
    } else {
  // Auto login after signup
  localStorage.setItem("token", data.token);
  onAuthSuccess();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-80 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}

        {!isLogin && (
          <input
            name="name"
            placeholder="Name"
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={handleChange}
            required
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button className="w-full bg-indigo-600 text-white py-2 rounded">
          {isLogin ? "Login" : "Create Account"}
        </button>

        <p className="text-sm text-center text-gray-600">
          {isLogin ? "New user?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}


