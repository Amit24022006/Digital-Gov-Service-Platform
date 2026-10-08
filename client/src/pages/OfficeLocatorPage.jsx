import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  Search, 
  Building2, 
  Compass, 
  ExternalLink,
  CheckCircle2,
  Filter,
  LocateFixed,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import api from '../api/client.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { INDIAN_STATES } from '../utils/constants.js';


// Custom SVG pins
const createCustomPin = (color = '#1e3a8a') => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="background-color:${color}; width:32px; height:32px; border-radius:50% 50% 50% 0; transform:rotate(-45deg); display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 3px 8px rgba(0,0,0,0.3);">
        <div style="width:10px; height:10px; background:white; border-radius:50%; transform:rotate(45deg);"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// User Live GPS Radar Pin
const userGpsPin = L.divIcon({
  className: 'user-gps-marker',
  html: `
    <div style="position:relative; width:24px; height:24px;">
      <div style="position:absolute; width:24px; height:24px; background:#2563eb; opacity:0.3; border-radius:50%; animation:ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position:absolute; top:3px; left:3px; width:18px; height:18px; background:#2563eb; border:3px solid white; border-radius:50%; box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const defaultPin = createCustomPin('#1e3a8a');
const selectedPin = createCustomPin('#ea580c');

// Map Controller for smooth fly-to
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// Haversine formula to calculate real distance in km
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(1);
}

export default function OfficeLocatorPage() {
  const { lang, t } = useLanguage();

  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Delhi fallback
  const [mapZoom, setMapZoom] = useState(12);

  // User Live Location State
  const [userLocation, setUserLocation] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState(null);
  const [sortByDistance, setSortByDistance] = useState(false);

  // Filters State
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);

  const [stateFilter, setStateFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOffices();
  }, [stateFilter, cityFilter, typeFilter]);

  const fetchOffices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (stateFilter !== 'all') params.state = stateFilter;
      if (cityFilter !== 'all') params.city = cityFilter;
      if (typeFilter !== 'all') params.type = typeFilter;

      const res = await api.get('/offices', { params });
      if (res.data.success) {
        setOffices(res.data.offices);
        if (res.data.available_states) setAvailableStates(res.data.available_states);
        if (res.data.available_cities) setAvailableCities(res.data.available_cities);
        if (res.data.available_types) setAvailableTypes(res.data.available_types);

        if (res.data.offices.length > 0 && !selectedOffice) {
          const first = res.data.offices[0];
          setSelectedOffice(first);
          if (!userLocation) {
            setMapCenter([first.lat, first.lng]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load offices:', err);
    } finally {
      setLoading(false);
    }
  };

  // Real GPS Geolocation Trigger
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setGpsLoading(true);
    setGpsStatus('Acquiring real satellite GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setMapCenter([latitude, longitude]);
        setMapZoom(13);
        setSortByDistance(true);
        setGpsLoading(false);
        setGpsStatus(`Located: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`);
      },
      (error) => {
        console.warn('GPS location error:', error.message);
        setGpsLoading(false);
        setGpsStatus('Using New Delhi reference location.');
        // Fallback reference location so user sees live distance demonstration
        setUserLocation([28.6139, 77.2090]);
        setMapCenter([28.6139, 77.2090]);
        setMapZoom(13);
        setSortByDistance(true);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSelectOffice = (office) => {
    setSelectedOffice(office);
    setMapCenter([office.lat, office.lng]);
    setMapZoom(15);
  };

  // Filter and sort offices
  let processedOffices = offices.map(o => {
    let dist = null;
    if (userLocation) {
      dist = calculateDistanceKm(userLocation[0], userLocation[1], o.lat, o.lng);
    }
    return { ...o, distanceKm: dist ? parseFloat(dist) : null };
  });

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    processedOffices = processedOffices.filter(o => 
      o.name.toLowerCase().includes(q) ||
      o.address.toLowerCase().includes(q) ||
      o.city.toLowerCase().includes(q) ||
      o.state.toLowerCase().includes(q) ||
      o.pincode.includes(q) ||
      (o.services_handled && o.services_handled.some(s => s.toLowerCase().includes(q)))
    );
  }

  if (sortByDistance && userLocation) {
    processedOffices.sort((a, b) => (a.distanceKm || 9999) - (b.distanceKm || 9999));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded bg-blue-100 text-blue-800">
              Step 6 · Physical Touchpoints
            </span>
            <span className="text-xs text-slate-500">
              CSC Centers, RTOs, Tehsil Counters & District Collectorates
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {t('officeLocator')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Locate your nearest authorized government office on a live map, see your real location, calculate distance, and get driving directions.
          </p>
        </div>

        {/* Real GPS Locate Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleLocateMe}
            disabled={gpsLoading}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-2 transition-all cursor-pointer"
          >
            <LocateFixed className={`w-4 h-4 ${gpsLoading ? 'animate-spin' : ''}`} />
            <span>{gpsLoading ? 'Locating...' : '📍 Use My Live GPS Location'}</span>
          </button>
        </div>
      </div>

      {/* GPS Status Banner if active */}
      {userLocation && (
        <div className="p-3.5 bg-blue-50 text-blue-900 rounded-2xl border border-blue-200 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
            <span className="font-bold">Live Location Active:</span>
            <span>{gpsStatus || 'Distance calculated from your GPS coordinates.'}</span>
          </div>
          <span className="px-2 py-0.5 bg-blue-100 rounded-md font-semibold text-blue-800 text-[11px]">
            Sorted by Nearest
          </span>
        </div>
      )}

      {/* Dynamic All States, Cities & Types Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs text-xs">
        
        {/* State Filter */}
        <div>
          <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
            Choose State:
          </label>
          <select
            value={stateFilter}
            onChange={(e) => { setStateFilter(e.target.value); setCityFilter('all'); }}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-semibold focus:outline-hidden"
          >
            <option value="all">All States of India (28 States & UTs)</option>
            {INDIAN_STATES.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
            Choose City / District:
          </label>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-semibold focus:outline-hidden"
          >
            <option value="all">All Cities</option>
            {availableCities.map(ct => (
              <option key={ct} value={ct}>{ct}</option>
            ))}
          </select>
        </div>

        {/* Office Type Filter */}
        <div>
          <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
            Office Department Type:
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-semibold focus:outline-hidden"
          >
            <option value="all">All Office Types</option>
            <option value="RTO">RTO (Driving License / Vehicle RC)</option>
            <option value="CSC">Common Service Center (CSC / Seva)</option>
            <option value="Tehsil">Tehsil & Revenue Office</option>
            <option value="Collectorate">District Collectorate / DM</option>
            <option value="Passport">Passport Seva Kendra (PSK)</option>
          </select>
        </div>

        {/* Keyword Search */}
        <div>
          <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
            Search Office or Pincode:
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Sarai Kale Khan, Andheri, 110001..."
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-xl focus:outline-hidden"
            />
          </div>
        </div>

      </div>

      {/* Main Grid: Split Directory & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left List of Offices */}
        <div className="lg:col-span-5 space-y-4 max-h-[750px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>{processedOffices.length} Government Offices Found</span>
            {userLocation && (
              <button
                onClick={() => setSortByDistance(!sortByDistance)}
                className="text-blue-700 hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <ArrowUpDown className="w-3 h-3" />
                <span>Sort by Distance</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : processedOffices.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-500 space-y-2">
              <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No government offices found matching your selected filters.</p>
              <button
                onClick={() => { setStateFilter('all'); setCityFilter('all'); setTypeFilter('all'); setSearchQuery(''); }}
                className="text-blue-700 font-bold hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            processedOffices.map(office => {
              const isSelected = selectedOffice?.id === office.id;
              return (
                <div
                  key={office.id}
                  onClick={() => handleSelectOffice(office)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-600 shadow-md ring-2 ring-blue-600/10'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700">
                          {office.type}
                        </span>
                        {office.distanceKm !== null && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">
                            ⚡ {office.distanceKm} km away
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 mt-1">
                        {office.name}
                      </h3>
                    </div>
                    {isSelected && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-slate-950 rounded-full shrink-0">
                        Map Active
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 flex items-start space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{office.address}, {office.city}, {office.state} - {office.pincode}</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{office.contact_hours}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{office.phone}</span>
                    </div>
                  </div>

                  {office.services_handled && (
                    <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100">
                      {office.services_handled.slice(0, 3).map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-[10px] bg-white border border-slate-200 text-slate-700 rounded-md font-medium">
                          ✓ {s}
                        </span>
                      ))}
                      {office.services_handled.length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{office.services_handled.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                    <span className="text-slate-400 text-[11px]">Walk-in / Token queue</span>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${office.lat},${office.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-bold text-blue-700 hover:text-blue-900 inline-flex items-center space-x-1"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Google Maps Directions</span>
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Interactive Map with User Real Location Marker */}
        <div className="lg:col-span-7 h-[380px] sm:h-[480px] lg:h-[750px] lg:sticky top-28 rounded-3xl overflow-hidden border border-slate-300 shadow-xl bg-slate-100">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController center={mapCenter} zoom={mapZoom} />

            {/* User Real GPS Location Marker */}
            {userLocation && (
              <>
                <Marker position={userLocation} icon={userGpsPin}>
                  <Popup>
                    <div className="p-1 text-xs">
                      <span className="font-bold text-blue-700 block">📍 You Are Here</span>
                      <span className="text-slate-600 text-[11px]">Your real GPS location</span>
                    </div>
                  </Popup>
                </Marker>
                <Circle 
                  center={userLocation} 
                  radius={1500} 
                  pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.15 }} 
                />
              </>
            )}

            {/* Government Office Markers */}
            {processedOffices.map(office => {
              const isSelected = selectedOffice?.id === office.id;
              return (
                <Marker
                  key={office.id}
                  position={[office.lat, office.lng]}
                  icon={isSelected ? selectedPin : defaultPin}
                  eventHandlers={{
                    click: () => setSelectedOffice(office)
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-1 text-xs max-w-xs">
                      <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-blue-100 text-blue-800">
                        {office.type}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm leading-tight">
                        {office.name}
                      </h4>
                      {office.distanceKm !== null && (
                        <p className="text-emerald-700 font-bold text-[11px]">
                          ⚡ {office.distanceKm} km from your location
                        </p>
                      )}
                      <p className="text-slate-600 text-[11px]">
                        {office.address}, {office.city}
                      </p>
                      <div className="pt-1 text-[11px] text-slate-700 space-y-0.5">
                        <p><strong>Hours:</strong> {office.contact_hours}</p>
                        <p><strong>Phone:</strong> {office.phone}</p>
                      </div>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${office.lat},${office.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-2 text-blue-700 font-bold hover:underline"
                      >
                        Navigate with GPS &rarr;
                      </a>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

      </div>

    </div>
  );
}
