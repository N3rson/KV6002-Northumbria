import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as SignOutIcon } from '../assets/sign-out-icon.png'; // Path to your icon

const SignOutButton = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to login page after signing out
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <button onClick={handleSignOut}>
      <SignOutIcon />
      <span>Sign Out</span>
    </button>
  );
};

export default SignOutButton;
