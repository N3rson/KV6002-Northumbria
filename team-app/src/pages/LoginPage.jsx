import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 
import { useNavigate } from 'react-router-dom';

/**
 * Login Page
 * 
 * This page allows the user to get logged in and gain access to the system. 
 * 
 * @category Page
 * @author Navil Hassan
*/

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoginMessage('Login successful!');
      setTimeout(() => setLoginMessage(''), 3000); // Clear message after 3 seconds
      navigate('/');
      setTimeout(() => setLoginMessage('successful'), 3000);
      setTimeout(() => setLoginMessage(''), 3000);
    } catch (error) {
      setLoginMessage('Failed to log in. Please check your credentials.');
      setTimeout(() => setLoginMessage(''), 3000);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-primary">
      {loginMessage && (
        <div className="absolute top-0 right-0 m-4 bg-green-100 text-green-700 p-2 rounded">
          {loginMessage}
        </div>
      )}
      <div className="m-4 p-8 bg-white shadow-middle rounded-xlg max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center text-steelBlue mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-steelBlue block mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-colour1"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-steelBlue block mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-colour1"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-colour1 hover:bg-bookHover text-white py-2 rounded-lg font-medium"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
