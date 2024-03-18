import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import SignOutIcon from '../assets/sign-out-icon.png'; // Change this line

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
      <img src={SignOutIcon} alt="SignOut" className="h-6 w-6" />
    </button>
  );
};

export default SignOutButton;