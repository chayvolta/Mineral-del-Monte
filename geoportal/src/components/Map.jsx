import React, { useRef, useEffect, useState, useMemo } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapComponent = ({ sites, selectedSite, onSelectSite }) => {
  const mapRef = useRef();
  const [showPopup, setShowPopup] = useState(null);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [viewport, setViewport] = useState({
    longitude: -98.672,
    latitude: 20.140,
    zoom: 15
  });

  // Simple clustering logic based on zoom level
  const clusteredMarkers = useMemo(() => {
    const zoom = viewport.zoom;
    const validSites = sites.filter(s => s.hasCoords);
    
    // If zoomed in enough, show all markers
    if (zoom >= 16) {
      return validSites.map(site => ({
        ...site,
        isCluster: false,
        count: 1
      }));
    }
    
    // Simple grid-based clustering for lower zoom levels
    const gridSize = 0.005 / Math.pow(2, zoom - 14);
    const clusters = new Map();
    
    validSites.forEach(site => {
      const gridX = Math.floor(site.position[1] / gridSize);
      const gridY = Math.floor(site.position[0] / gridSize);
      const key = `${gridX},${gridY}`;
      
      if (!clusters.has(key)) {
        clusters.set(key, {
          ...site,
          isCluster: false,
          count: 1,
          sites: [site]
        });
      } else {
        const cluster = clusters.get(key);
        cluster.count++;
        cluster.sites.push(site);
        cluster.isCluster = true;
        const avgLat = cluster.sites.reduce((sum, s) => sum + s.position[0], 0) / cluster.sites.length;
        const avgLng = cluster.sites.reduce((sum, s) => sum + s.position[1], 0) / cluster.sites.length;
        cluster.position = [avgLat, avgLng];
      }
    });
    
    return Array.from(clusters.values());
  }, [sites, viewport.zoom]);

  // Fly to selected site
  useEffect(() => {
    if (selectedSite && selectedSite.position && mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedSite.position[1], selectedSite.position[0]],
        zoom: 17,
        duration: 2500,
        essential: true
      });
    }
  }, [selectedSite]);

  const handleClusterClick = (cluster) => {
    if (cluster.isCluster) {
      mapRef.current.flyTo({
        center: [cluster.position[1], cluster.position[0]],
        zoom: Math.min(viewport.zoom + 2, 18),
        duration: 1500
      });
    } else {
      onSelectSite(cluster);
      setShowPopup(cluster);
    }
  };

  return (
    <div className="h-full w-full">
      <ReactMapGL
        ref={mapRef}
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle={{
          version: 8,
          sources: {
            'satellite': {
              type: 'raster',
              tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              ],
              tileSize: 256
            },
            'labels': {
              type: 'raster',
              tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
              ],
              tileSize: 256
            }
          },
          layers: [
            {
              id: 'satellite',
              type: 'raster',
              source: 'satellite',
              minzoom: 0,
              maxzoom: 19 // Limited to prevent over-zooming on satellite imagery
            },
            {
              id: 'labels',
              type: 'raster',
              source: 'labels',
              minzoom: 0,
              maxzoom: 19
            }
          ]
        }}
      >
        {clusteredMarkers.map((marker, idx) => {
          const isHovered = hoveredMarker === marker.id;
          const isSelected = selectedSite?.id === marker.id;
          const isCluster = marker.isCluster;
          
          return (
            <Marker
              key={marker.id || `cluster-${idx}`}
              longitude={marker.position[1]}
              latitude={marker.position[0]}
              anchor="center" // Changed to center for circular markers to align correctly
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleClusterClick(marker);
              }}
            >
              <div 
                className="flex flex-col items-center cursor-pointer transition-transform duration-200"
                style={{
                  transform: isHovered || isSelected ? 'scale(1.1)' : 'scale(1)',
                  zIndex: isSelected ? 1000 : isHovered ? 100 : 1
                }}
                onMouseEnter={() => !isCluster && setHoveredMarker(marker.id)}
                onMouseLeave={() => setHoveredMarker(null)}
              >
                {isCluster ? (
                  <div 
                    className="w-10 h-10 rounded-full bg-[#d69e2e] border-4 border-white shadow-lg flex items-center justify-center font-bold text-white text-sm"
                  >
                    {marker.count}
                  </div>
                ) : (
                  <>
                    <div 
                      className={`w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-200 ${
                        isSelected ? 'bg-[#d69e2e]' : 'bg-red-500'
                      }`}
                      style={{
                        boxShadow: isHovered || isSelected 
                          ? '0 4px 12px rgba(0,0,0,0.4)' 
                          : '0 2px 8px rgba(0,0,0,0.3)'
                      }}
                    ></div>
                    
                    {viewport.zoom >= 15 && (
                      <div 
                        className={`mt-1 px-2 py-1 rounded-md font-bold text-xs whitespace-nowrap transition-all duration-200 max-w-[150px] truncate ${
                          isSelected 
                            ? 'bg-[#d69e2e] text-white shadow-lg' 
                            : 'bg-white text-gray-900 shadow-md'
                        }`}
                        style={{
                          boxShadow: isHovered || isSelected 
                            ? '0 4px 12px rgba(0,0,0,0.3)' 
                            : '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                      >
                        {marker.name}
                      </div>
                    )}
                  </>
                )}
              </div>
            </Marker>
          );
        })}

        {showPopup && showPopup.hasCoords && !showPopup.isCluster && (
          <Popup
            longitude={showPopup.position[1]}
            latitude={showPopup.position[0]}
            anchor="bottom"
            onClose={() => setShowPopup(null)}
            closeButton={false}
            offset={25}
          >
            <div className="p-3">
              <h3 className="font-bold text-sm">{showPopup.name}</h3>
              <p className="text-xs text-gray-600 mt-1">Clic para ver detalles</p>
            </div>
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
};

export default MapComponent;
