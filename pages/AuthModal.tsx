"use client";
import { useState, useEffect } from "react";
import { useModal } from "../app/context/ModalContext";

type AuthModalProps = {
  defaultMode?: "login" | "signup";
};

const AuthModal = ({ defaultMode = "login" }: AuthModalProps) => {
  const { isOpen, closeModal, modalType, setModalType } = useModal();

  // Sync defaultMode with modalType when the modal opens
  useEffect(() => {
    if (defaultMode) {
      setModalType(defaultMode);
    }
  }, [defaultMode, setModalType]);

  const isLogin = modalType === "login";

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    address: "",  // New field for address
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Reset form on modal close
  useEffect(() => {
    if (!isOpen) {
      setForm({
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
        address: "", // Reset address field
      });
      setErrorMessage(""); // Clear error message when modal is closed
    }
  }, [isOpen]);

  // Handle login action
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
        closeModal();
        window.location.reload();  // Refresh the page and redirect to home page
      } else {
        setErrorMessage(data.error || "Something went wrong");
      }
    } catch {
      setErrorMessage("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  // Handle signup action
  const handleSignup = async () => {
    setLoading(true);
    setErrorMessage("");
    const { name, email, password, confirmPassword, address } = form;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, email, password, address }),  // Include address in the request body
      });

      const data = await response.json();

      if (response.ok) {
        closeModal();
        window.location.reload();  // Refresh the page and redirect to home page
      } else {
        setErrorMessage(data.error || "Something went wrong");
      }
    } catch {
      setErrorMessage("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  // Don't render modal if it's not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {/* Error message */}
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}

        {/* Name input (only shown during sign up) */}
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

        {/* Email input */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-2 p-2 border border-gray-300 rounded"
        />

        {/* Password input */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-2 p-2 border border-gray-300 rounded"
        />

        {/* Confirm password (only shown during sign up) */}
        {!isLogin && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full mb-2 p-2 border border-gray-300 rounded"
          />
        )}

        {/* Address input (only shown during sign up) */}
        {!isLogin && (
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full mb-4 p-2 border border-gray-300 rounded"
          />
        )}

        {/* Submit button */}
        <button
          onClick={isLogin ? handleLogin : handleSignup}
          className="w-full bg-amber-900 text-white py-2 rounded hover:bg-amber-100 mt-2"
          disabled={loading}
        >
          {loading
            ? isLogin
              ? "Logging In..."
              : "Signing Up..."
            : isLogin
            ? "Login"
            : "Sign Up"}
        </button>

        {/* Close button */}
        <button
          onClick={closeModal}
          className="w-full mt-2 text-gray-500 text-sm"
        >
          Close
        </button>

        {/* Toggle between Login/Signup */}
        <div className="mt-2 text-center text-sm">
          <span>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setModalType(isLogin ? "signup" : "login")}
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
