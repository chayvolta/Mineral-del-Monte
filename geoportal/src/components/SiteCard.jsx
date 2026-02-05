import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Facebook, Instagram, Globe, MapPin, Navigation, ExternalLink, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

// Placeholder images for carousel
const placeholderImages = [
  '/images/sites/site_1.svg', // Fallback defaults if site-specific not found
  '/images/sites/site_2.svg',
  '/images/sites/site_3.svg'
];

const SiteCard = ({ site, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  // Use site-specific images (should be 3), fallback to empty to avoid crashing if data missing
  const images = site?.images || [];

  // Reset index if images change (e.g. switching sites)
  React.useEffect(() => {
    setCurrentImageIndex(0);
  }, [site?.id]);

  if (!site) return null;

  // Helper to check if value is valid (not "ND" or empty)
  const isValidLink = (value) => {
    return value && value.trim() !== '' && value.toUpperCase() !== 'ND';
  };

  const nextImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 300,
            duration: 0.4 
          }}
          className="absolute bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-[380px] bg-white border border-gray-200 rounded-xl shadow-2xl z-[1000] overflow-hidden"
        >
          {/* Close button - Custom addition to the design */}
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-all backdrop-blur-sm"
          >
            <X size={16} />
          </button>

          {/* Image Section (Carousel) */}
          <div className="relative h-56 bg-gray-100 overflow-hidden group">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={site.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
            
            {/* Carousel Controls (Only if multiple images) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            
            {/* Expand button */}
            <button
              onClick={() => setIsImageExpanded(true)}
              className="absolute bottom-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
            >
              <Maximize2 size={16} />
            </button>
          </div>

          {/* Content Section */}
          <div className="p-6 text-center">
            {/* Badge */}
            <span className="inline-flex items-center bg-[#d69e2e]/10 border border-[#d69e2e]/20 text-[#8a6a1c] text-xs font-semibold px-2 py-1 rounded-md mb-3">
              <MapPin className="w-3 h-3 mr-1" />
              Destino Turístico
            </span>

            {/* Title */}
            <h2 className="text-2xl font-bold tracking-tight text-[#1a202c] mb-1 leading-tight">
              {site.name}
            </h2>
            <p className="text-xs text-gray-400 mb-6 uppercase tracking-wider">Mineral del Monte, Hgo.</p>

            {/* Actions Container */}
            <div className="space-y-3">
              {/* Primary: Directions */}
              {isValidLink(site.locationUrl) && (
                <a 
                  href={site.locationUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full text-white bg-[#1a202c] hover:bg-[#2d3748] border border-transparent shadow-md hover:shadow-lg font-medium rounded-lg text-sm px-5 py-2.5 transition-all focus:outline-none focus:ring-4 focus:ring-gray-300"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Cómo llegar
                </a>
              )}

              {/* Secondary: Socials */}
              <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-100">
                {isValidLink(site.facebook) && (
                  <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-[#1877F2] hover:bg-blue-50 rounded-full transition-colors" title="Facebook">
                    <Facebook size={20} />
                  </a>
                )}
                {isValidLink(site.instagram) && (
                  <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-[#E4405F] hover:bg-pink-50 rounded-full transition-colors" title="Instagram">
                    <Instagram size={20} />
                  </a>
                )}
                {isValidLink(site.web) && (
                  <a href={site.web} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors" title="Web">
                    <Globe size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Expanded Image Modal - Kept separate for z-index/portal reasons */}
      <AnimatePresence>
        {isImageExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[2000] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setIsImageExpanded(false)}
          >
            <button
              onClick={() => setIsImageExpanded(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all backdrop-blur-sm"
            >
              <X size={24} />
            </button>
            <motion.img
              src={images[currentImageIndex]}
              alt={site.name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SiteCard;
