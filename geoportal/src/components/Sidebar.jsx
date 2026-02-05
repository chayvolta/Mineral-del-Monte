import React from 'react';
import { Facebook, Instagram, Globe, MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ sites, onSelectSite, selectedSite }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full md:w-96 bg-white/95 backdrop-blur-sm h-[30vh] md:h-full overflow-hidden flex flex-col shadow-2xl z-[1000] border-r border-gray-200">
      <div className="p-4 bg-mineral-dark text-white shadow-md z-10">
        <h1 className="text-2xl font-bold mb-2 text-mineral-gold">Mineral del Monte</h1>
        <p className="text-xs text-gray-400 mb-4">Geoportal Turístico - Satelital</p>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar sitio..."
            className="w-full bg-mineral-light text-white pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-mineral-gold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredSites.map((site) => (
          <motion.div
            key={site.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`cursor-pointer rounded-lg p-3 border transition-all duration-200 hover:shadow-md ${
              selectedSite?.id === site.id 
                ? 'bg-mineral-gold/10 border-mineral-gold ring-1 ring-mineral-gold' 
                : 'bg-white border-gray-100 hover:border-gray-300'
            }`}
            onClick={() => onSelectSite(site)}
          >
            <h3 className="font-semibold text-gray-800">{site.name}</h3>
            
            <div className="flex gap-3 mt-3">
              {site.facebook && (
                <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800" onClick={e => e.stopPropagation()}>
                  <Facebook size={16} />
                </a>
              )}
              {site.instagram && (
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800" onClick={e => e.stopPropagation()}>
                  <Instagram size={16} />
                </a>
              )}
              {site.web && (
                <a href={site.web} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-800" onClick={e => e.stopPropagation()}>
                  <Globe size={16} />
                </a>
              )}
              {site.locationUrl && (
                <a href={site.locationUrl} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-700" onClick={e => e.stopPropagation()}>
                  <MapPin size={16} />
                </a>
              )}
            </div>
          </motion.div>
        ))}
        {filteredSites.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            No se encontraron sitios
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
