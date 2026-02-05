import React from 'react';
import { Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-16 bg-mineral-dark/95 backdrop-blur-sm text-white shadow-lg z-[2000] relative flex items-center px-6">
      <div className="flex items-center gap-4 flex-1">
        <h1 className="text-2xl font-bold text-mineral-gold">Mineral del Monte</h1>
        <span className="text-sm text-gray-400 hidden md:inline">Geoportal Turístico</span>
      </div>
    </header>
  );
};

export default Header;
