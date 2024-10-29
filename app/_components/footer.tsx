// src/components/Footer.tsx
import React from 'react';

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 p-2 text-neutral-900 font-semibold text-center text-sm w-full bg-transparent">
      &copy; {new Date().getFullYear()} Roleplay. All rights reserved.
    </footer>
  );
};
