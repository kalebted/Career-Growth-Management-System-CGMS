import React from 'react';

const GoogleSignInButton = ({ text, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center justify-center w-full py-3 text-gray-700 transition border border-gray-300 rounded-lg hover:bg-gray-100"
  >
    <img
      src="https://www.google.com/favicon.ico"
      alt="Google"
      className="w-5 mr-2"
    />
    {text}
  </button>
);

export default GoogleSignInButton;
