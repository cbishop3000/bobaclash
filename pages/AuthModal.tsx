"use client"
import { useState } from "react";
import { useModal } from "../app/context/ModalContext";

const AuthModal = () => {
  const { isOpen, closeModal } = useModal();

  const [isLogin, setIsLogin] = useState(true); // This is where we declare setIsLogin
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<any>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage("");

    const { email, password } = form;

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        closeModal();
      } else {
        setErrorMessage(data.error || "Something went wrong");
      }
    } catch {
      setErrorMessage("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setErrorMessage("");

    const { name, email, password, confirmPassword } = form;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Sign Up successful!");
        closeModal();
      } else {
        setErrorMessage(data.error || "Something went wrong");
      }
    } catch {
      setErrorMessage("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">{isLogin ? "Login" : "Sign Up"}</h2>

        {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full mb-2 p-2 border border-gray-300 rounded"
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-2 p-2 border border-gray-300 rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-2 p-2 border border-gray-300 rounded"
        />

        {!isLogin && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full mb-4 p-2 border border-gray-300 rounded"
          />
        )}

        <button
          onClick={isLogin ? handleLogin : handleSignup}
          className="w-full bg-amber-900 text-white py-2 rounded hover:bg-amber-100 mt-2"
          disabled={loading}
        >
          {loading ? (isLogin ? "Logging In..." : "Signing Up...") : isLogin ? "Login" : "Sign Up"}
        </button>

        <button
          onClick={closeModal}
          className="w-full mt-2 text-gray-500 text-sm"
        >
          Close
        </button>

        <div className="mt-2 text-center text-sm">
          <span>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)} // Now this works because setIsLogin is defined!
              className="text-blue-500 underline"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
