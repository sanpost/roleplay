// src/components/Footer.tsx
import React from 'react';

export const Footer = () => {
  return (
    <footer className="p-4 bg-gray-800 text-white text-center">
      &copy; {new Date().getFullYear()} Katalog Roleplay. Wszelkie prawa zastrzeżone.
    </footer>
  );
};
