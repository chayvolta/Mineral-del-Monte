import React, { useState, useEffect } from 'react';
import SiteCard from './components/SiteCard';
import Sidebar from './components/Sidebar';
import { loadSites } from './utils/dataLoader';
import { Menu, X } from 'lucide-react';

// Lazy load the map component
const MapComponent = React.lazy(() => import('./components/Map'));

function App() {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const data = await loadSites();
      setSites(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSelectSite = (site) => {
    setSelectedSite(site);
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-[#1a202c] text-white shadow-lg flex items-center px-4 gap-3">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label={sidebarOpen ? 'Cerrar lista de sitios' : 'Abrir lista de sitios'}
          className="p-2 rounded-lg hover:bg-[#2d3748] transition-colors focus:outline-none focus:ring-2 focus:ring-[#d69e2e]"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <h1 className="text-2xl font-bold text-[#d69e2e]">Mineral del Monte</h1>
        <span className="text-sm text-gray-400 ml-1 hidden md:inline">Geoportal Turístico</span>
      </header>
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <Sidebar
            sites={sites}
            selectedSite={selectedSite}
            onSelectSite={handleSelectSite}
          />
        )}

        {/* Map Area */}
        <div className="flex-1 relative overflow-hidden bg-gray-200">
          {loading ? (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a202c] mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando mapa...</p>
              </div>
            </div>
          ) : (
            <React.Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <p>Cargando mapa...</p>
              </div>
            }>
              <MapComponent 
                sites={sites} 
                selectedSite={selectedSite}
                onSelectSite={handleSelectSite}
              />
            </React.Suspense>
          )}
          
          {/* Floating Card Overlay */}
          {selectedSite && (
            <SiteCard 
              site={selectedSite} 
              onClose={() => setSelectedSite(null)} 
            />
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="h-10 bg-[#1a202c] text-white flex items-center justify-center text-xs text-gray-400">
        <p>© 2026 Mineral del Monte - Geoportal Turístico</p>
      </footer>
    </div>
  );
}

export default App;
