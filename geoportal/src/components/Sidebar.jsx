import React from 'react';
import { Facebook, Instagram, Globe, MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const isValidLink = (value) => value && value.trim() !== '' && value.toUpperCase() !== 'ND';

const Sidebar = ({ sites, onSelectSite, selectedSite }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full md:w-80 bg-white/95 backdrop-blur-sm h-full overflow-hidden flex flex-col shadow-2xl z-[1000] border-r border-gray-200">
      <div className="p-4 bg-[#1a202c] text-white shadow-md z-10">
        <p className="text-xs text-gray-400 mb-3">{sites.length} sitios turísticos</p>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar sitio..."
            aria-label="Buscar sitio turístico"
            className="w-full bg-[#2d3748] text-white pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d69e2e] text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredSites.map((site) => (
          <motion.div
            key={site.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`cursor-pointer rounded-lg p-3 border transition-all duration-200 hover:shadow-md ${
              selectedSite?.id === site.id 
                ? 'bg-[#d69e2e]/10 border-[#d69e2e] ring-1 ring-[#d69e2e]' 
                : 'bg-white border-gray-100 hover:border-gray-300'
            }`}
            onClick={() => onSelectSite(site)}
          >
            <h3 className="font-semibold text-gray-800 text-sm">{site.name}</h3>
            
            <div className="flex gap-3 mt-2">
              {isValidLink(site.facebook) && (
                <a href={site.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-blue-600 hover:text-blue-800" onClick={e => e.stopPropagation()}>
                  <Facebook size={15} />
                </a>
              )}
              {isValidLink(site.instagram) && (
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-pink-600 hover:text-pink-800" onClick={e => e.stopPropagation()}>
                  <Instagram size={15} />
                </a>
              )}
              {isValidLink(site.web) && (
                <a href={site.web} target="_blank" rel="noopener noreferrer" aria-label="Sitio web" className="text-teal-600 hover:text-teal-800" onClick={e => e.stopPropagation()}>
                  <Globe size={15} />
                </a>
              )}
              {isValidLink(site.locationUrl) && (
                <a href={site.locationUrl} target="_blank" rel="noopener noreferrer" aria-label="Cómo llegar" className="text-red-500 hover:text-red-700" onClick={e => e.stopPropagation()}>
                  <MapPin size={15} />
                </a>
              )}
            </div>
          </motion.div>
        ))}
        {filteredSites.length === 0 && (
          <div className="text-center text-gray-400 py-10 text-sm">
            No se encontraron sitios
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
