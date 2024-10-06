// src/components/Footer.tsx
import React from 'react';

export const Footer = () => {
  return (
    <footer className="p-4 text-neutral-800 font-semibold text-center w-full">
      &copy; {new Date().getFullYear()} Roleplay. All rights reserved.
    </footer>
  );
};
