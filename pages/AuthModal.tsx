import React, { useState } from 'react';

const AuthModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(true); // State to toggle between Sign Up and Login
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);  // To handle loading state
  const [errorMessage, setErrorMessage] = useState(''); // To display error messages

  // Toggle between Sign Up and Login modals
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setErrorMessage(''); // Reset error message when toggling the modal
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    setLoading(true);  // Start loading

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Sign Up successful!');
        setIsModalOpen(false);  // Close the modal on success
      } else {
        setErrorMessage(data.error || 'Something went wrong');
      }
    } catch (error) {
      setErrorMessage('Internal server error');
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  const handleLogin = async () => {
    setLoading(true); // Set loading state
    setErrorMessage(''); // Reset any previous errors
  
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Store the token (e.g., in localStorage or cookies)
        localStorage.setItem('token', data.token);
  
        alert('Login successful');
        setIsModalOpen(false); // Close modal on success
      } else {
        setErrorMessage(data.error || 'Something went wrong');
      }
    } catch (error) {
      setErrorMessage('Internal server error');
    } finally {
      setLoading(false); // Reset loading state
    }
  };
  

  return (
    <>
      {/* Separate Buttons for Sign Up and Login */}
      <button className="bg-amber-200 m-2 rounded p-4" onClick={() => { setIsSignup(true); toggleModal(); }}>
        Sign Up
      </button>
      <button className="bg-amber-200 m-2 rounded p-4" onClick={() => { setIsSignup(false); toggleModal(); }}>
        Login
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">{isSignup ? 'Sign Up' : 'Login'}</h2>

            {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

            {isSignup ? (
              <>
                {/* Sign Up Form */}
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mb-2 p-2 border border-gray-300 rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mb-2 p-2 border border-gray-300 rounded"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mb-2 p-2 border border-gray-300 rounded"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mb-4 p-2 border border-gray-300 rounded"
                />
                <button
                  onClick={handleSignup}
                  className="w-full bg-amber-900 text-white py-2 rounded hover:bg-amber-100"
                  disabled={loading}
                >
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
              </>
            ) : (
              <>
                {/* Login Form */}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mb-2 p-2 border border-gray-300 rounded"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mb-4 p-2 border border-gray-300 rounded"
                />
                <button
                  onClick={handleLogin}
                  className="w-full bg-amber-900 text-white py-2 rounded hover:bg-amber-100"
                >
                  Login
                </button>
              </>
            )}

            <button
              onClick={toggleModal}
              className="w-full mt-2 text-gray-500 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthModal;
