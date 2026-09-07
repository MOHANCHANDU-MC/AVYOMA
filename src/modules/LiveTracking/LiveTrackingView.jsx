import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin,
  Navigation,
  Radio,
  LocateFixed,
  Zap,
  Play,
  Square,
  RefreshCw,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Battery,
  Shield,
  Layers,
  Search,
  Filter,
  Send,
  UserCheck,
  Building,
  Phone,
  FileSpreadsheet,
  Compass,
  Sparkles,
  ChevronRight,
  Eye,
  Info
} from 'lucide-react';

// Mock initial employee fleet list for Manager View
const INITIAL_FLEET = [
  {
    id: 'EMP-101',
    name: 'Mohan Chandu (You)',
    role: 'Senior Field Executive',
    department: 'Enterprise Sales',
    avatar: 'MC',
    isSelf: true,
    isTracking: false,
    status: 'In Transit', // Active, In Transit, Idle, Offline
    lat: 17.3850,
    lng: 78.4867,
    accuracy: 8.5,
    speed: 24.5, // km/h
    heading: 140,
    battery: 88,
    lastUpdate: 'Just now',
    address: 'Banjara Hills, Road No. 12, Hyderabad',
    distanceToday: 18.4,
    routeHistory: [
      { lat: 17.3750, lng: 78.4767, time: '10:00 AM' },
      { lat: 17.3800, lng: 78.4800, time: '10:30 AM' },
      { lat: 17.3850, lng: 78.4867, time: '11:15 AM' }
    ]
  },
  {
    id: 'EMP-102',
    name: 'Sarah Jenkins',
    role: 'Account Manager',
    department: 'Client Relations',
    avatar: 'SJ',
    isSelf: false,
    isTracking: true,
    status: 'On Site',
    lat: 17.4401,
    lng: 78.3489,
    accuracy: 5.2,
    speed: 0.0,
    heading: 45,
    battery: 92,
    lastUpdate: '2 mins ago',
    address: 'HITECH City, Mindspace IT Park, Hyderabad',
    distanceToday: 32.1,
    routeHistory: [
      { lat: 17.4300, lng: 78.3400, time: '09:15 AM' },
      { lat: 17.4401, lng: 78.3489, time: '09:45 AM' }
    ]
  },
  {
    id: 'EMP-103',
    name: 'Vikram Malhotra',
    role: 'Solutions Engineer',
    department: 'Pre-Sales',
    avatar: 'VM',
    isSelf: false,
    isTracking: true,
    status: 'In Transit',
    lat: 17.4239,
    lng: 78.4482,
    accuracy: 12.0,
    speed: 42.0,
    heading: 270,
    battery: 64,
    lastUpdate: '1 min ago',
    address: 'Jubilee Hills Checkpost, Hyderabad',
    distanceToday: 45.8,
    routeHistory: [
      { lat: 17.4100, lng: 78.4300, time: '08:30 AM' },
      { lat: 17.4239, lng: 78.4482, time: '11:10 AM' }
    ]
  },
  {
    id: 'EMP-104',
    name: 'Ananya Roy',
    role: 'Field Auditor',
    department: 'Quality Assurance',
    avatar: 'AR',
    isSelf: false,
    isTracking: false,
    status: 'Offline',
    lat: 17.3616,
    lng: 78.4747,
    accuracy: 25.0,
    speed: 0.0,
    heading: 0,
    battery: 41,
    lastUpdate: '45 mins ago',
    address: 'Charminar Area, Old City, Hyderabad',
    distanceToday: 12.0,
    routeHistory: []
  }
];

// Pre-calculated waypoints for smooth drive simulation
const SIMULATION_WAYPOINTS = [
  { lat: 17.3850, lng: 78.4867, name: 'Starting Point - HQ' },
  { lat: 17.3890, lng: 78.4910, name: 'En Route to Financial District' },
  { lat: 17.3950, lng: 78.4980, name: 'Passing Jubilee Hills Hub' },
  { lat: 17.4050, lng: 78.5080, name: 'Approaching Tech Corridor' },
  { lat: 17.4180, lng: 78.5190, name: 'Client Premises Site A' },
  { lat: 17.4290, lng: 78.5300, name: 'Destination - Enterprise Campus' }
];

export function LiveTrackingView() {
  const [viewMode, setViewMode] = useState('employee'); // 'employee' | 'manager'
  const [fleet, setFleet] = useState(INITIAL_FLEET);

  // Self tracking state
  const [isTracking, setIsTracking] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [logs, setLogs] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Simulation mode for testing on desktops/laptops without moving
  const [isSimulating, setIsSimulating] = useState(false);
  const simStepRef = useRef(0);
  const simTimerRef = useRef(null);

  // Manager map selection
  const [selectedEmpId, setSelectedEmpId] = useState('EMP-101');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Watch position ref
  const watchId = useRef(null);
  const lastSentTime = useRef(0);

  // Stop tracking callback
  const stopTracking = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    if (simTimerRef.current) {
      clearInterval(simTimerRef.current);
      simTimerRef.current = null;
    }
    setIsTracking(false);
    setIsSimulating(false);

    // Update fleet list for manager dashboard
    setFleet(prev =>
      prev.map(emp => (emp.isSelf ? { ...emp, isTracking: false, status: 'Idle' } : emp))
    );

    addLog('SYSTEM', 'Allow Tracking disabled by employee. Live transmission stopped.');
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
      if (simTimerRef.current) {
        clearInterval(simTimerRef.current);
      }
    };
  }, []);

  // Add event to live audit log
  const addLog = (type, message, payload = null) => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      payload
    };
    setLogs(prev => [newEntry, ...prev.slice(0, 19)]);
  };

  // Transmit location update to API
  const sendLocationToBackend = useCallback(async (locationData) => {
    const now = Date.now();
    // Throttle backend updates to once every 3 seconds for demo smoothness
    if (now - lastSentTime.current < 3000) {
      return;
    }
    lastSentTime.current = now;

    setIsSending(true);

    // Simulate backend network round-trip
    setTimeout(() => {
      setIsSending(false);
      addLog('TRANSMIT_SUCCESS', `POST 200 OK -> /api/geotag (${locationData.latitude.toFixed(4)}, ${locationData.longitude.toFixed(4)})`, locationData);

      // Sync with fleet manager state
      setFleet(prev =>
        prev.map(emp => {
          if (emp.isSelf) {
            return {
              ...emp,
              isTracking: true,
              status: 'In Transit',
              lat: locationData.latitude,
              lng: locationData.longitude,
              accuracy: locationData.accuracy,
              speed: locationData.speed || 18.2,
              heading: locationData.heading || 120,
              lastUpdate: 'Just now',
              routeHistory: [...emp.routeHistory, { lat: locationData.latitude, lng: locationData.longitude, time: new Date().toLocaleTimeString() }]
            };
          }
          return emp;
        })
      );
    }, 400);
  }, []);

  // Primary function requested by user: Allow Tracking / Start Live Tracking
  const allowTracking = () => {
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your device browser.');
      addLog('ERROR', 'Geolocation API unavailable on this browser.');
      return;
    }

    if (watchId.current !== null) {
      return; // Already tracking
    }

    setIsTracking(true);
    addLog('PERMISSION', 'Employee toggled "Allow Tracking". Requesting device GPS permissions...');

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const locationData = {
          employeeId: 'EMP-101',
          employeeName: 'Mohan Chandu',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed ? (position.coords.speed * 3.6).toFixed(1) : 15.4,
          heading: position.coords.heading || 90,
          altitude: position.coords.altitude || 50,
          timestamp: new Date(position.timestamp).toISOString(),
          batteryLevel: 88,
          networkType: '4G LTE'
        };

        setLocation(locationData);
        sendLocationToBackend(locationData);
      },
      (err) => {
        stopTracking();

        let errorMsg = '';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMsg = 'Location permission denied by user/browser. Please allow location access in browser settings.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMsg = 'GPS signal unavailable. Try moving closer to a window or enabling high accuracy location.';
            break;
          case err.TIMEOUT:
            errorMsg = 'Geolocation request timed out.';
            break;
          default:
            errorMsg = 'Unable to get device location.';
        }

        setError(errorMsg);
        addLog('GPS_ERROR', errorMsg);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000
      }
    );
  };

  // Drive route simulator (ideal for testing desktop PCs without physical GPS movement)
  const startDriveSimulation = () => {
    if (isSimulating) {
      stopTracking();
      return;
    }

    setError('');
    setIsTracking(true);
    setIsSimulating(true);
    simStepRef.current = 0;
    addLog('SIMULATOR', 'Started Live Field Drive Route Simulator for testing.');

    const runStep = () => {
      const wp = SIMULATION_WAYPOINTS[simStepRef.current % SIMULATION_WAYPOINTS.length];
      // Add slight random offset to simulate actual GPS jitter
      const jitterLat = wp.lat + (Math.random() - 0.5) * 0.001;
      const jitterLng = wp.lng + (Math.random() - 0.5) * 0.001;

      const mockData = {
        employeeId: 'EMP-101',
        employeeName: 'Mohan Chandu',
        latitude: parseFloat(jitterLat.toFixed(6)),
        longitude: parseFloat(jitterLng.toFixed(6)),
        accuracy: parseFloat((4 + Math.random() * 3).toFixed(1)),
        speed: parseFloat((25 + Math.random() * 15).toFixed(1)),
        heading: (simStepRef.current * 30) % 360,
        altitude: 45,
        timestamp: new Date().toISOString(),
        batteryLevel: 87,
        networkType: '5G'
      };

      setLocation(mockData);
      sendLocationToBackend(mockData);

      simStepRef.current += 1;
    };

    runStep();
    simTimerRef.current = setInterval(runStep, 3500);
  };

  // Copy JSON payload to clipboard
  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Manual Check-in Geotag event
  const triggerManualCheckIn = () => {
    if (!location) {
      setError('Please start tracking first to get your active location.');
      return;
    }
    addLog('CHECK_IN', `📍 Manual Client Site Check-in logged at (${location.latitude}, ${location.longitude})`);
    alert(`✅ Check-in Success!\nGeotagged position (${location.latitude}, ${location.longitude}) logged to CRM Audit Trail.`);
  };

  // Filtered employees for Manager View
  const filteredFleet = fleet.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.role.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'TRACKING') return matchesSearch && emp.isTracking;
    if (statusFilter === 'IDLE') return matchesSearch && emp.status === 'Idle';
    if (statusFilter === 'OFFLINE') return matchesSearch && emp.status === 'Offline';
    return matchesSearch;
  });

  const activeEmployeeCount = fleet.filter(e => e.isTracking).length;
  const totalDistance = fleet.reduce((acc, curr) => acc + curr.distanceToday, 0).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header & View Mode Selector */}
      <div className="page-header" style={{ marginBottom: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title">Employee Live Geolocation Tracking</h1>
            <span className="badge badge-purple" style={{ padding: '4px 10px', fontSize: '12px' }}>
              <Radio size={14} className="animate-pulse" /> LIVE GPS CORE
            </span>
          </div>
          <p className="page-subtitle">
            Real-time field force tracking, GPS permission management, and live manager dashboard.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: '#E2E8F0',
          padding: '4px',
          borderRadius: 'var(--radius-lg)',
          gap: '4px'
        }}>
          <button
            onClick={() => setViewMode('employee')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              backgroundColor: viewMode === 'employee' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'employee' ? 'var(--primary-blue)' : 'var(--text-secondary)',
              boxShadow: viewMode === 'employee' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <UserCheck size={16} /> Employee App View (Allow Tracking)
          </button>

          <button
            onClick={() => setViewMode('manager')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              backgroundColor: viewMode === 'manager' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'manager' ? 'var(--primary-blue)' : 'var(--text-secondary)',
              boxShadow: viewMode === 'manager' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Compass size={16} /> Manager Live Fleet Dashboard ({activeEmployeeCount} Active)
          </button>
        </div>
      </div>

      {/* ---------------- EMPLOYEE VIEW MODE ---------------- */}
      {viewMode === 'employee' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
          
          {/* Main Controls & Live Monitor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Primary Allow Tracking Card */}
            <div className="prec-card" style={{
              background: isTracking
                ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)'
                : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
              color: isTracking ? '#F8FAFC' : 'var(--text-dark)',
              border: isTracking ? '1px solid #334155' : '1px solid var(--border-color)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Background ambient accent */}
              {isTracking && (
                <div style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  filter: 'blur(30px)',
                  pointerEvents: 'none'
                }} />
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: isTracking ? 'rgba(16, 185, 129, 0.2)' : 'var(--primary-blue-light)',
                    color: isTracking ? '#10B981' : 'var(--primary-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Navigation size={24} style={{ transform: isTracking ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s ease' }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
                      Employee Location Tracking Switch
                    </h2>
                    <p style={{ fontSize: '13px', color: isTracking ? '#94A3B8' : 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                      Grant location access to broadcast your live position to the manager dispatch board.
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: isTracking ? '#10B981' : '#94A3B8',
                    boxShadow: isTracking ? '0 0 12px #10B981' : 'none'
                  }} />
                  <span style={{
                    fontWeight: 700,
                    fontSize: '13px',
                    color: isTracking ? '#10B981' : 'var(--text-muted)'
                  }}>
                    {isTracking ? 'LIVE TRACKING ACTIVE' : 'TRACKING OFF'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                {!isTracking ? (
                  <button
                    onClick={allowTracking}
                    className="btn btn-primary btn-lg"
                    style={{
                      backgroundColor: '#10B981',
                      borderColor: '#10B981',
                      padding: '12px 24px',
                      fontSize: '15px',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <Play size={18} /> ALLOW TRACKING & START
                  </button>
                ) : (
                  <button
                    onClick={stopTracking}
                    className="btn btn-danger btn-lg"
                    style={{
                      padding: '12px 24px',
                      fontSize: '15px',
                      boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    <Square size={18} /> STOP TRACKING
                  </button>
                )}

                {/* Simulator Toggle for Desktop Testing */}
                <button
                  onClick={startDriveSimulation}
                  className="btn btn-secondary"
                  style={{
                    backgroundColor: isSimulating ? '#FEF3C7' : (isTracking ? '#334155' : '#FFFFFF'),
                    color: isSimulating ? '#B45309' : (isTracking ? '#F8FAFC' : 'var(--text-dark)'),
                    borderColor: isSimulating ? '#F59E0B' : (isTracking ? '#475569' : 'var(--border-color)')
                  }}
                >
                  <Zap size={16} style={{ color: isSimulating ? '#D97706' : undefined }} />
                  {isSimulating ? 'Stop Drive Simulator' : 'Test Drive Route Simulator (Desktop)'}
                </button>

                {isTracking && location && (
                  <button
                    onClick={triggerManualCheckIn}
                    className="btn btn-secondary"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', borderColor: '#475569' }}
                  >
                    <MapPin size={16} /> Log Client Site Check-in
                  </button>
                )}
              </div>

              {/* Error Alert inside Card */}
              {error && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  color: '#B91C1C',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '13px'
                }}>
                  <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Live Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div className="prec-card">
                <div style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                  LATITUDE / LONGITUDE
                </div>
                <div className="num-tabular" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', marginTop: '6px' }}>
                  {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Waiting for GPS...'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {location ? 'High Precision WGS84' : 'Click "Allow Tracking" above'}
                </div>
              </div>

              <div className="prec-card">
                <div style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                  ACCURACY RADIUS
                </div>
                <div className="num-tabular" style={{ fontSize: '18px', fontWeight: 700, color: '#2563EB', marginTop: '6px' }}>
                  {location ? `± ${location.accuracy.toFixed(1)} m` : '--'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {location && location.accuracy < 10 ? '🎯 Exceptional Signal' : 'Standard Cell/Wi-Fi'}
                </div>
              </div>

              <div className="prec-card">
                <div style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                  CURRENT SPEED
                </div>
                <div className="num-tabular" style={{ fontSize: '18px', fontWeight: 700, color: '#10B981', marginTop: '6px' }}>
                  {location ? `${location.speed} km/h` : '0 km/h'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Heading: {location ? `${location.heading}°` : '0°'}
                </div>
              </div>

              <div className="prec-card">
                <div style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                  API SYNC STATUS
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: isSending ? '#D97706' : '#10B981', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isSending ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Transmitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} /> Synchronized
                    </>
                  )}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Endpoint: <code style={{ fontSize: '10px' }}>/api/geotag</code>
                </div>
              </div>
            </div>

            {/* Visual Vector Map Representation for Employee View */}
            <div className="prec-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{
                padding: '12px 20px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#F8FAFC'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Compass size={18} style={{ color: 'var(--primary-blue)' }} />
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>Device GPS Field Map Radar</span>
                </div>
                {location && (
                  <span className="badge badge-green">
                    <Radio size={12} /> Ping Time: {new Date(location.timestamp).toLocaleTimeString()}
                  </span>
                )}
              </div>

              {/* Vector SVG Map Container */}
              <div style={{
                height: '320px',
                backgroundColor: '#0F172A',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'radial-gradient(#1E293B 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}>
                {/* Roads / Grid Vector lines */}
                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                  <line x1="0" y1="160" x2="100%" y2="160" stroke="#334155" strokeWidth="2" strokeDasharray="6 6" />
                  <line x1="250" y1="0" x2="250" y2="100%" stroke="#334155" strokeWidth="2" strokeDasharray="6 6" />
                  <path d="M 50 50 Q 200 150 450 100 T 800 280" fill="none" stroke="#1E293B" strokeWidth="4" />
                </svg>

                {!isTracking && (
                  <div style={{
                    zIndex: 10,
                    textAlign: 'center',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    padding: '24px 32px',
                    borderRadius: '12px',
                    border: '1px solid #334155',
                    backdropFilter: 'blur(4px)'
                  }}>
                    <LocateFixed size={40} style={{ color: '#64748B', marginBottom: '12px' }} />
                    <h3 style={{ color: '#F8FAFC', fontSize: '16px', fontWeight: 600 }}>Tracking is Inactive</h3>
                    <p style={{ color: '#94A3B8', fontSize: '13px', maxWidth: '280px', marginTop: '4px' }}>
                      Click <strong>"Allow Tracking"</strong> above to project your live location radar marker.
                    </p>
                  </div>
                )}

                {isTracking && (
                  <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Animated Pulse Ring */}
                    <div style={{
                      position: 'absolute',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(16, 185, 129, 0.25)',
                      border: '2px solid #10B981',
                      animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
                    }} />

                    {/* Central Marker Pin */}
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: '#2563EB',
                      border: '3px solid #FFFFFF',
                      boxShadow: '0 0 20px rgba(37, 99, 235, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '14px',
                      zIndex: 2
                    }}>
                      MC
                    </div>

                    {/* Marker Tooltip */}
                    <div style={{
                      marginTop: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                      textAlign: 'center',
                      color: '#F8FAFC'
                    }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#60A5FA' }}>
                        Mohan Chandu (You)
                      </div>
                      <div className="font-mono" style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                        {location ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}` : ''}
                      </div>
                    </div>
                  </div>
                )}

                {/* Map HUD Overlay Controls */}
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: '1px solid #334155',
                  color: '#F8FAFC',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span>🌐 Map Projection: EPSG:4326</span>
                  <span>🛰️ Active Satellites: 9</span>
                  <span>⚡ Signal: Excellent</span>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar: Live Telemetry Payload & Event Audit Log */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Live HTTP Payload Inspector */}
            <div className="prec-card">
              <div className="card-header" style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={16} style={{ color: 'var(--primary-blue)' }} />
                  <span className="card-title">Live API Payload Inspector</span>
                </div>
                <span className="badge badge-blue">POST /api/geotag</span>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                JSON object serialized and dispatched to backend server:
              </p>

              <div style={{
                backgroundColor: '#0F172A',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                position: 'relative'
              }}>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(location || {}, null, 2), -1)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    color: '#94A3B8',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Copy size={12} /> {copiedIndex === -1 ? 'Copied!' : 'Copy JSON'}
                </button>

                <pre className="font-mono" style={{
                  color: '#38BDF8',
                  fontSize: '11px',
                  margin: 0,
                  overflowX: 'auto',
                  lineHeight: '1.6'
                }}>
                  {location ? JSON.stringify(location, null, 2) : '// Click "Allow Tracking" to capture live payload'}
                </pre>
              </div>
            </div>

            {/* Real-time Event Logger */}
            <div className="prec-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="card-header" style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} style={{ color: 'var(--status-amber)' }} />
                  <span className="card-title">Tracking Session Audit Log</span>
                </div>
                <span className="badge badge-gray">{logs.length} Events</span>
              </div>

              <div style={{
                flex: 1,
                maxHeight: '380px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                {logs.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                    No tracking events logged yet. Toggle Allow Tracking to begin.
                  </div>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: log.type === 'ERROR' || log.type === 'GPS_ERROR' ? '#FEF2F2' : '#F8FAFC',
                        borderLeft: log.type === 'ERROR' || log.type === 'GPS_ERROR'
                          ? '3px solid #EF4444'
                          : log.type === 'TRANSMIT_SUCCESS'
                          ? '3px solid #10B981'
                          : '3px solid #2563EB'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        <span className="font-mono" style={{ fontWeight: 600, color: 'var(--text-dark)' }}>[{log.type}]</span>
                        <span className="font-mono">{log.timestamp}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-dark)' }}>
                        {log.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ---------------- MANAGER FLEET DASHBOARD VIEW ---------------- */}
      {viewMode === 'manager' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Manager Overview KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div className="prec-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL FIELD TEAM</span>
                <UsersIcon size={18} style={{ color: 'var(--primary-blue)' }} />
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-dark)', marginTop: '8px' }}>
                {fleet.length} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>Agents</span>
              </div>
            </div>

            <div className="prec-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>ACTIVELY TRANSMITTING</span>
                <Radio size={18} style={{ color: '#10B981' }} />
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#10B981', marginTop: '8px' }}>
                {activeEmployeeCount} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>Online</span>
              </div>
            </div>

            <div className="prec-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>FLEET DISTANCE TODAY</span>
                <Navigation size={18} style={{ color: '#F59E0B' }} />
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-dark)', marginTop: '8px' }}>
                {totalDistance} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>km</span>
              </div>
            </div>

            <div className="prec-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>GEOFENCE ALERTS</span>
                <Shield size={18} style={{ color: '#8B5CF6' }} />
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#8B5CF6', marginTop: '8px' }}>
                2 <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>Client Site En-route</span>
              </div>
            </div>
          </div>

          {/* Interactive Map + Fleet List Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '20px' }}>
            
            {/* Left Column: Employee List Sidebar */}
            <div className="prec-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Field Personnel</h3>
                <span className="badge badge-gray">{filteredFleet.length} items</span>
              </div>

              {/* Search input */}
              <div className="input-search-wrapper">
                <Search size={16} className="input-search-icon" />
                <input
                  type="text"
                  className="input-field input-search"
                  placeholder="Search agent by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Filter buttons */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {['ALL', 'TRACKING', 'IDLE', 'OFFLINE'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    style={{
                      flex: 1,
                      padding: '4px 0',
                      fontSize: '11px',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: statusFilter === status ? 'var(--primary-blue)' : '#FFFFFF',
                      color: statusFilter === status ? '#FFFFFF' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Employee cards list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '480px', overflowY: 'auto' }}>
                {filteredFleet.map((emp) => {
                  const isSelected = emp.id === selectedEmpId;
                  return (
                    <div
                      key={emp.id}
                      onClick={() => setSelectedEmpId(emp.id)}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--primary-blue)' : '1px solid var(--border-color)',
                        backgroundColor: isSelected ? 'var(--primary-blue-light)' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--navy-primary)',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {emp.avatar}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-dark)' }}>
                              {emp.name} {emp.isSelf && <small style={{ color: 'var(--primary-blue)' }}>(You)</small>}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                              {emp.role}
                            </div>
                          </div>
                        </div>

                        <span className={`badge ${emp.isTracking ? 'badge-green' : emp.status === 'Idle' ? 'badge-amber' : 'badge-gray'}`}>
                          {emp.isTracking ? 'ACTIVE' : emp.status.toUpperCase()}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                        <span>📍 {emp.address.split(',')[0]}</span>
                        <span>⚡ {emp.speed} km/h</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Live Interactive Fleet Canvas Map */}
            <div className="prec-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{
                padding: '14px 20px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#F8FAFC'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={18} style={{ color: 'var(--primary-blue)' }} />
                  <span style={{ fontWeight: 700, fontSize: '15px' }}>Live Dispatch Fleet Map</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => alert('Exporting live GPS log report as CSV...')}>
                    <FileSpreadsheet size={14} /> Export GPS Audit CSV
                  </button>
                </div>
              </div>

              {/* Map Canvas Visualizer */}
              <div style={{
                flex: 1,
                minHeight: '480px',
                backgroundColor: '#0B1220',
                position: 'relative',
                overflow: 'hidden',
                backgroundImage: 'radial-gradient(#1E293B 1px, transparent 1px)',
                backgroundSize: '30px 30px'
              }}>
                {/* SVG Road Layout & Connections */}
                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                  <path d="M 100 100 L 300 220 L 550 180 L 700 350" stroke="#1E293B" strokeWidth="6" fill="none" />
                  <path d="M 200 400 L 300 220 L 450 80" stroke="#1E293B" strokeWidth="6" fill="none" />
                  
                  {/* Trail connector lines for active employees */}
                  {fleet.map((emp) => (
                    <circle
                      key={`circle-${emp.id}`}
                      cx={150 + (emp.lng - 78.3) * 2000}
                      cy={120 + (17.45 - emp.lat) * 2000}
                      r={emp.accuracy * 2}
                      fill="rgba(37, 99, 235, 0.1)"
                      stroke="rgba(37, 99, 235, 0.3)"
                      strokeWidth="1"
                    />
                  ))}
                </svg>

                {/* Render All Employee Pins on Map */}
                {fleet.map((emp) => {
                  const isSelected = emp.id === selectedEmpId;
                  // Map mock lat/lng coordinates to CSS percentage offsets for visual demo layout
                  const posX = Math.max(10, Math.min(85, ((emp.lng - 78.30) / 0.25) * 100));
                  const posY = Math.max(10, Math.min(85, ((17.48 - emp.lat) / 0.15) * 100));

                  return (
                    <div
                      key={`pin-${emp.id}`}
                      onClick={() => setSelectedEmpId(emp.id)}
                      style={{
                        position: 'absolute',
                        left: `${posX}%`,
                        top: `${posY}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: isSelected ? 30 : 10,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}
                    >
                      {/* Pulse Ring if active tracking */}
                      {emp.isTracking && (
                        <div style={{
                          position: 'absolute',
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(16, 185, 129, 0.25)',
                          border: '1.5px solid #10B981',
                          animation: 'ping 2.5s infinite'
                        }} />
                      )}

                      {/* Pin Circle Avatar */}
                      <div style={{
                        width: isSelected ? '40px' : '32px',
                        height: isSelected ? '40px' : '32px',
                        borderRadius: '50%',
                        backgroundColor: emp.isTracking ? '#10B981' : emp.status === 'Idle' ? '#F59E0B' : '#64748B',
                        color: '#FFFFFF',
                        border: '3px solid #FFFFFF',
                        boxShadow: isSelected ? '0 0 16px #3B82F6' : '0 4px 8px rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '12px',
                        transition: 'all 0.2s ease'
                      }}>
                        {emp.avatar}
                      </div>

                      {/* Label Tag */}
                      <div style={{
                        marginTop: '4px',
                        backgroundColor: '#1E293B',
                        color: '#F8FAFC',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                        border: isSelected ? '1px solid #3B82F6' : '1px solid #334155'
                      }}>
                        {emp.name.split(' ')[0]} ({emp.speed} km/h)
                      </div>
                    </div>
                  );
                })}

                {/* Selected Employee Floating Detail Panel */}
                {selectedEmpId && (() => {
                  const emp = fleet.find(e => e.id === selectedEmpId);
                  if (!emp) return null;
                  return (
                    <div style={{
                      position: 'absolute',
                      bottom: '20px',
                      right: '20px',
                      width: '320px',
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      padding: '16px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                      color: '#F8FAFC',
                      backdropFilter: 'blur(8px)',
                      zIndex: 40
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ fontWeight: 700, fontSize: '15px' }}>{emp.name}</div>
                        <span className={`badge ${emp.isTracking ? 'badge-green' : 'badge-gray'}`}>
                          {emp.isTracking ? 'LIVE GPS ACTIVE' : emp.status}
                        </span>
                      </div>

                      <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '12px' }}>
                        📍 {emp.address}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px', fontSize: '11px' }}>
                        <div style={{ backgroundColor: '#1E293B', padding: '8px', borderRadius: '6px' }}>
                          <span style={{ color: '#64748B' }}>SPEED</span>
                          <div className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: '#38BDF8', marginTop: '2px' }}>
                            {emp.speed} km/h
                          </div>
                        </div>
                        <div style={{ backgroundColor: '#1E293B', padding: '8px', borderRadius: '6px' }}>
                          <span style={{ color: '#64748B' }}>BATTERY</span>
                          <div className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: emp.battery > 50 ? '#10B981' : '#EF4444', marginTop: '2px' }}>
                            {emp.battery}%
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1 }}
                          onClick={() => alert(`Initiating direct voice call to ${emp.name}...`)}
                        >
                          <Phone size={14} /> Call Agent
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ flex: 1, backgroundColor: '#1E293B', color: '#F8FAFC', borderColor: '#475569' }}
                          onClick={() => alert(`Sending location ping alert to ${emp.id}...`)}
                        >
                          <Send size={14} /> Ping GPS
                        </button>
                      </div>
                    </div>
                  );
                })()}

              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

// Helper Users Icon component
function UsersIcon({ size = 18, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default LiveTrackingView;
