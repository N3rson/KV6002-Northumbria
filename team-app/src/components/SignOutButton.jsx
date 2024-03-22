import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import SignOutIcon from '../assets/sign-out-icon.png';

/**
 * Sign Out feature
 * 
 * This component allows the user to get logged out of the system. 
 * 
 * @category Component
 * @author Navil Hassan
*/


const SignOutButton = () => {
  const navigate = useNavigate();
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setFeedbackMessage('Successfully signed out.'); // Set a message
      setShowFeedback(true); // Show message
      setTimeout(() => {
        setShowFeedback(false); // Hide message after 2 seconds
        navigate('/login'); // Redirect to login page after showing message
      }, 2000);
    } catch (error) {
      console.error('Error signing out: ', error);
      setFeedbackMessage('Error signing out. Please try again.'); // Set error message
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false); // Hide message after 2 seconds
      }, 2000);
    }
  };

  return (
    <div>
      {showFeedback && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white p-2 rounded-md">
          {feedbackMessage}
        </div>
      )}
      <button onClick={handleSignOut}>
        <img src={SignOutIcon} alt="Sign Out" className="h-6 w-6" />
      </button>
    </div>
  );
};

export default SignOutButton;
