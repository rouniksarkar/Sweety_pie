import React from 'react';
import wellnessBg from '../assets/wellness_bg.jpg';

const AuthBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-50">
      {/* Low opacity background image surrounding the card */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
        style={{ backgroundImage: `url(${wellnessBg})` }}
      />
      {/* Decorative premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/30 via-transparent to-green-100/30 pointer-events-none" />
      
      {/* Centered content wrapper */}
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

export default AuthBackground;
