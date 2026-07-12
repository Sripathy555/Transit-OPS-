import React, { useState } from 'react';
import './App.css';
import { TransitProvider, useTransit } from './context/TransitContext';
import * as Icons from './Icons';

function AppContent() {
  const {
    activeRole,
    setActiveRole,
    currentTab,
    setCurrentTab,
    darkMode,
    setDarkMode,
    vehicles,
    drivers,
    trips,
    maintenance,
    fuelLogs,
    expenses,
    isLicenseExpired,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addDriver,
    updateDriver,
    deleteDriver,
    createTrip,
    dispatchTrip,
    completeTrip,
    cancelTrip,
    startMaintenance,
    closeMaintenance,
    addFuelLogRecord,
    addExpenseRecord
  } = useTransit();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [vehicleModal, setVehicleModal] = useState({ open: false, mode: 'create', data: null });
  const [driverModal, setDriverModal] = useState({ open: false, mode: 'create', data: null });
  const [tripModal, setTripModal] = useState({ open: false });
  const [completeTripModal, setCompleteTripModal] = useState({ open: false, tripId: null });
  const [maintenanceModal, setMaintenanceModal] = useState({ open: false });
  const [fuelModal, setFuelModal] = useState({ open: false });
  const [expenseModal, setExpenseModal] = useState({ open: false });

  const [vehicleSearch, setVehicleSearch] = useState('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('All');
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState('All');

  const [driverSearch, setDriverSearch] = useState('');
  const [driverStatusFilter, setDriverStatusFilter] = useState('All');

  const [tripStatusFilter, setTripStatusFilter] = useState('All');

  const [formError, setFormError] = useState('');
  const [vehicleForm, setVehicleForm] = useState({ registrationNumber: '', nameModel: '', type: 'Cargo Van', maxLoadCapacity: '', odometer: '', acquisitionCost: '', status: 'Available', region: 'North' });
  const [driverForm, setDriverForm] = useState({ name: '', licenseNumber: '', licenseCategory: 'Class A CDL', licenseExpiryDate: '', contactNumber: '', safetyScore: '100', status: 'Available' });
  const [tripForm, setTripForm] = useState({ source: '', destination: '', vehicleId: '', driverId: '', cargoWeight: '', plannedDistance: '', revenue: '' });
  const [completeTripForm, setCompleteTripForm] = useState({ finalOdometer: '', fuelConsumed: '', fuelCost: '' });
  const [maintenanceForm, setMaintenanceForm] = useState({ vehicleId: '', description: '', cost: '', date: '' });
  const [fuelForm, setFuelForm] = useState({ vehicleId: '', liters: '', cost: '', date: '' });
  const [expForm, setExpForm] = useState({ vehicleId: '', type: 'Toll', description: '', cost: '', date: '' });

  const canEditFleet = activeRole === 'Fleet Manager';
  const canEditDrivers = activeRole === 'Fleet Manager' || activeRole === 'Safety Officer';
  const canDispatchTrips = activeRole === 'Fleet Manager' || activeRole === 'Driver';
  const canEditExpenses = activeRole === 'Fleet Manager' || activeRole === 'Financial Analyst';

  const handleLogin = (e) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      setAuthError('Please enter email and password.');
      return;
    }
    
    if (authEmail.includes('manager')) {
      setActiveRole('Fleet Manager');
    } else if (authEmail.includes('driver')) {
      setActiveRole('Driver');
    } else if (authEmail.includes('safety')) {
      setActiveRole('Safety Officer');
    } else if (authEmail.includes('finance')) {
      setActiveRole('Financial Analyst');
    } else {
      setActiveRole('Fleet Manager');
    }
    
    setIsAuthenticated(true);
    setAuthError('');
  };

  const handleQuickLogin = (email) => {
    setAuthEmail(email);
    setAuthPassword('password123');
    if (email.includes('manager')) setActiveRole('Fleet Manager');
    if (email.includes('driver')) setActiveRole('Driver');
    if (email.includes('safety')) setActiveRole('Safety Officer');
    if (email.includes('finance')) setActiveRole('Financial Analyst');
    setIsAuthenticated(true);
  };

  const openVehicleCreate = () => {
    setFormError('');
    setVehicleForm({ registrationNumber: '', nameModel: '', type: 'Cargo Van', maxLoadCapacity: '', odometer: '', acquisitionCost: '', status: 'Available', region: 'North' });
    setVehicleModal({ open: true, mode: 'create', data: null });
  };

  const openVehicleEdit = (vehicle) => {
    setFormError('');
    setVehicleForm({ ...vehicle });
    setVehicleModal({ open: true, mode: 'edit', data: vehicle });
  };

  const handleVehicleSubmit = (e) => {
    e.preventDefault();
    try {
      if (vehicleModal.mode === 'create') {
        addVehicle(vehicleForm);
      } else {
        updateVehicle(vehicleForm);
      }
      setVehicleModal({ open: false, mode: 'create', data: null });
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleRetireVehicle = (vehicle) => {
    try {
      updateVehicle({ ...vehicle, status: 'Retired' });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteVehicle = (id) => {
    if (window.confirm("Delete vehicle?")) {
      try {
        deleteVehicle(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const openDriverCreate = () => {
    setFormError('');
    setDriverForm({ name: '', licenseNumber: '', licenseCategory: 'Class A CDL', licenseExpiryDate: '', contactNumber: '', safetyScore: '100', status: 'Available' });
    setDriverModal({ open: true, mode: 'create', data: null });
  };

  const openDriverEdit = (driver) => {
    setFormError('');
    setDriverForm({ ...driver });
    setDriverModal({ open: true, mode: 'edit', data: driver });
  };

  const handleDriverSubmit = (e) => {
    e.preventDefault();
    try {
      if (driverModal.mode === 'create') {
        addDriver(driverForm);
      } else {
        updateDriver(driverForm);
      }
      setDriverModal({ open: false, mode: 'create', data: null });
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDeleteDriver = (id) => {
    if (window.confirm("Delete driver?")) {
      try {
        deleteDriver(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const openTripCreate = () => {
    setFormError('');
    const firstAvailVehicle = vehicles.find(v => v.status === 'Available');
    const firstAvailDriver = drivers.find(d => d.status === 'Available' && !isLicenseExpired(d.licenseExpiryDate));
    
    setTripForm({
      source: '',
      destination: '',
      vehicleId: firstAvailVehicle ? firstAvailVehicle.id : '',
      driverId: firstAvailDriver ? firstAvailDriver.id : '',
      cargoWeight: '',
      plannedDistance: '',
      revenue: ''
    });
    setTripModal({ open: true });
  };

  const handleTripSubmit = (e) => {
    e.preventDefault();
    try {
      createTrip(tripForm);
      setTripModal({ open: false });
    } catch (err) {
      setFormError(err.message);
    }
  };

  const openCompleteTrip = (tripId) => {
    setFormError('');
    const trip = trips.find(t => t.id === tripId);
    const vehicle = vehicles.find(v => v.id === trip.vehicleId);
    
    setCompleteTripForm({
      finalOdometer: vehicle ? vehicle.odometer + trip.plannedDistance : '',
      fuelConsumed: Math.round(trip.plannedDistance / 6),
      fuelCost: ''
    });
    setCompleteTripModal({ open: true, tripId });
  };

  const handleCompleteTripSubmit = (e) => {
    e.preventDefault();
    try {
      completeTrip(
        completeTripModal.tripId,
        completeTripForm.finalOdometer,
        completeTripForm.fuelConsumed,
        completeTripForm.fuelCost
      );
      setCompleteTripModal({ open: false, tripId: null });
    } catch (err) {
      setFormError(err.message);
    }
  };

  const openMaintenanceCreate = () => {
    setFormError('');
    const firstAvailVehicle = vehicles.find(v => v.status !== 'Retired' && v.status !== 'On Trip');
    setMaintenanceForm({
      vehicleId: firstAvailVehicle ? firstAvailVehicle.id : '',
      description: '',
      cost: '',
      date: new Date().toISOString().split('T')[0]
    });
    setMaintenanceModal({ open: true });
  };

  const handleMaintenanceSubmit = (e) => {
    e.preventDefault();
    try {
      startMaintenance(maintenanceForm);
      setMaintenanceModal({ open: false });
    } catch (err) {
      setFormError(err.message);
    }
  };

  const openFuelCreate = () => {
    setFormError('');
    setFuelForm({
      vehicleId: vehicles[0]?.id || '',
      liters: '',
      cost: '',
      date: new Date().toISOString().split('T')[0]
    });
    setFuelModal({ open: true });
  };

  const handleFuelSubmit = (e) => {
    e.preventDefault();
    try {
      addFuelLogRecord(fuelForm);
      setFuelModal({ open: false });
    } catch (err) {
      setFormError(err.message);
    }
  };

  const openExpenseCreate = () => {
    setFormError('');
    setExpForm({
      vehicleId: vehicles[0]?.id || '',
      type: 'Toll',
      description: '',
      cost: '',
      date: new Date().toISOString().split('T')[0]
    });
    setExpenseModal({ open: true });
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    try {
      addExpenseRecord(expForm);
      setExpenseModal({ open: false });
    } catch (err) {
      setFormError(err.message);
    }
  };

  const exportToCSV = () => {
    const headers = ['Vehicle Registration', 'Model', 'Type', 'Total Trips', 'Distance (km)', 'Fuel Consumed (L)', 'Efficiency (km/L)', 'Fuel Cost ($)', 'Maintenance Cost ($)', 'Revenue ($)', 'ROI (%)'];
    const rows = vehicles.map(v => {
      const vTrips = trips.filter(t => t.vehicleId === v.id && t.status === 'Completed');
      const totalDist = vTrips.reduce((sum, t) => sum + t.plannedDistance, 0);
      const totalFuel = vTrips.reduce((sum, t) => sum + (t.fuelConsumed || 0), 0);
      const avgEff = totalFuel > 0 ? (totalDist / totalFuel).toFixed(2) : '0';
      const fuelCost = fuelLogs.filter(f => f.vehicleId === v.id).reduce((sum, f) => sum + f.cost, 0);
      const maintCost = maintenance.filter(m => m.vehicleId === v.id).reduce((sum, m) => sum + m.cost, 0);
      const revenue = vTrips.reduce((sum, t) => sum + t.revenue, 0);
      const roi = v.acquisitionCost > 0 
        ? (((revenue - (maintCost + fuelCost)) / v.acquisitionCost) * 100).toFixed(2)
        : '0.00';
        
      return [v.registrationNumber, v.nameModel, v.type, vTrips.length, totalDist, totalFuel, avgEff, fuelCost, maintCost, revenue, roi];
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fleet_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-container animate-fade">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">T</div>
            <h2 className="auth-title">TransitOps</h2>
            <p className="auth-subtitle">Smart Transport Operations Platform</p>
          </div>
          
          {authError && (
            <div className="form-error-banner">
              <Icons.AlertIcon size={18} />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="manager@transitops.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
              />
            </div>
            
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
              <Icons.ShieldIcon size={18} />
              Sign In Securely
            </button>
          </form>

          <div style={{ margin: '24px 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ flexGrow: 1, height: '1px', backgroundColor: 'var(--card-border)' }}></div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Quick Demo Logins</span>
            <div style={{ flexGrow: 1, height: '1px', backgroundColor: 'var(--card-border)' }}></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '8px' }} onClick={() => handleQuickLogin('manager@transitops.com')}>
              Fleet Manager
            </button>
            <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '8px' }} onClick={() => handleQuickLogin('driver@transitops.com')}>
              Driver View
            </button>
            <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '8px' }} onClick={() => handleQuickLogin('safety@transitops.com')}>
              Safety Officer
            </button>
            <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '8px' }} onClick={() => handleQuickLogin('finance@transitops.com')}>
              Financial Analyst
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.registrationNumber.toLowerCase().includes(vehicleSearch.toLowerCase()) || 
                          v.nameModel.toLowerCase().includes(vehicleSearch.toLowerCase());
    const matchesType = vehicleTypeFilter === 'All' || v.type === vehicleTypeFilter;
    const matchesStatus = vehicleStatusFilter === 'All' || v.status === vehicleStatusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(driverSearch.toLowerCase()) || 
                          d.licenseNumber.toLowerCase().includes(driverSearch.toLowerCase());
    const matchesStatus = driverStatusFilter === 'All' || d.status === driverStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTrips = trips.filter(t => {
    return tripStatusFilter === 'All' || t.status === tripStatusFilter;
  });

  return (
    <div className="app-container animate-fade">
      <aside className="app-sidebar">
        <div className="logo-section">
          <div className="logo-icon">T</div>
          <span className="logo-text">TransitOps</span>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentTab('dashboard')}>
            <Icons.DashboardIcon size={20} /> Dashboard
          </button>
          
          <button className={`nav-item ${currentTab === 'vehicles' ? 'active' : ''}`} onClick={() => setCurrentTab('vehicles')}>
            <Icons.VehicleIcon size={20} /> Vehicles Registry
          </button>

          <button className={`nav-item ${currentTab === 'drivers' ? 'active' : ''}`} onClick={() => setCurrentTab('drivers')}>
            <Icons.DriverIcon size={20} /> Drivers Profile
          </button>

          <button className={`nav-item ${currentTab === 'trips' ? 'active' : ''}`} onClick={() => setCurrentTab('trips')}>
            <Icons.TripIcon size={20} /> Trip Management
          </button>

          <button className={`nav-item ${currentTab === 'maintenance' ? 'active' : ''}`} onClick={() => setCurrentTab('maintenance')}>
            <Icons.MaintenanceIcon size={20} /> Maintenance
          </button>

          <button className={`nav-item ${currentTab === 'expenses' ? 'active' : ''}`} onClick={() => setCurrentTab('expenses')}>
            <Icons.ExpenseIcon size={20} /> Expenses & Fuel
          </button>

          <button className={`nav-item ${currentTab === 'reports' ? 'active' : ''}`} onClick={() => setCurrentTab('reports')}>
            <Icons.ReportIcon size={20} /> Reports & Analytics
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={() => setIsAuthenticated(false)}>
            <Icons.DownloadIcon size={20} style={{ transform: 'rotate(90deg)' }} /> Log Out
          </button>
        </div>
      </aside>

      <main className="app-main">
        <header className="app-header">
          <div className="header-title-sec">
            <h1>{currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}</h1>
            <p>Access level: <strong>{activeRole}</strong></p>
          </div>

          <div className="header-controls">
            <button className="theme-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle Theme">
              {darkMode ? <Icons.SunIcon size={20} /> : <Icons.MoonIcon size={20} />}
            </button>

            <div className="role-picker">
              <span className="role-picker-label">Role:</span>
              <select className="role-select" value={activeRole} onChange={(e) => setActiveRole(e.target.value)}>
                <option value="Fleet Manager">Fleet Manager</option>
                <option value="Driver">Driver</option>
                <option value="Safety Officer">Safety Officer</option>
                <option value="Financial Analyst">Financial Analyst</option>
              </select>
            </div>
          </div>
        </header>

        <div className="app-content animate-fade">
          
          {currentTab === 'dashboard' && (
            <div className="animate-fade">
              <div className="kpi-grid">
                <div className="kpi-card kpi-active">
                  <div className="kpi-header">
                    <span className="kpi-title">Active Vehicles</span>
                    <div className="kpi-icon-wrapper"><Icons.VehicleIcon size={18} /></div>
                  </div>
                  <div className="kpi-value">{vehicles.filter(v => v.status === 'On Trip').length}</div>
                  <div className="kpi-trend neutral">Vehicles on the road</div>
                </div>

                <div className="kpi-card kpi-available">
                  <div className="kpi-header">
                    <span className="kpi-title">Available Fleet</span>
                    <div className="kpi-icon-wrapper"><Icons.CheckIcon size={18} /></div>
                  </div>
                  <div className="kpi-value">{vehicles.filter(v => v.status === 'Available').length}</div>
                  <div className="kpi-trend up">Ready to dispatch</div>
                </div>

                <div className="kpi-card kpi-maintenance">
                  <div className="kpi-header">
                    <span className="kpi-title">In Maintenance</span>
                    <div className="kpi-icon-wrapper"><Icons.MaintenanceIcon size={18} /></div>
                  </div>
                  <div className="kpi-value">{vehicles.filter(v => v.status === 'In Shop').length}</div>
                  <div className="kpi-trend down">Awaiting service</div>
                </div>

                <div className="kpi-card kpi-utilization">
                  <div className="kpi-header">
                    <span className="kpi-title">Fleet Utilization</span>
                    <div className="kpi-icon-wrapper"><Icons.ReportIcon size={18} /></div>
                  </div>
                  <div className="kpi-value">
                    {(() => {
                      const active = vehicles.filter(v => v.status === 'On Trip').length;
                      const activeTotal = vehicles.filter(v => v.status !== 'Retired').length;
                      return activeTotal > 0 ? Math.round((active / activeTotal) * 100) : 0;
                    })()}%
                  </div>
                  <div className="kpi-trend up">Of active assets</div>
                </div>
              </div>

              <div className="charts-grid">
                <div className="chart-card">
                  <div className="chart-card-header">
                    <div>
                      <h3 className="chart-title">Fuel Efficiency</h3>
                      <p className="chart-subtitle">Average efficiency (Distance / Fuel) by vehicle</p>
                    </div>
                  </div>
                  
                  <div className="svg-chart-container">
                    <svg width="100%" height="100%" viewBox="0 0 500 220" preserveAspectRatio="none">
                      <line x1="50" y1="20" x2="480" y2="20" className="svg-chart-grid" />
                      <line x1="50" y1="70" x2="480" y2="70" className="svg-chart-grid" />
                      <line x1="50" y1="120" x2="480" y2="120" className="svg-chart-grid" />
                      <line x1="50" y1="170" x2="480" y2="170" className="svg-chart-grid" />
                      <line x1="50" y1="10" x2="50" y2="170" className="svg-chart-axis" />
                      <line x1="50" y1="170" x2="480" y2="170" className="svg-chart-axis" />
                      <text x="15" y="25" className="svg-chart-text">9 km/L</text>
                      <text x="15" y="75" className="svg-chart-text">6 km/L</text>
                      <text x="15" y="125" className="svg-chart-text">3 km/L</text>
                      <text x="15" y="175" className="svg-chart-text">0 km/L</text>

                      {vehicles.slice(0, 5).map((v, idx) => {
                        const vTrips = trips.filter(t => t.vehicleId === v.id && t.status === 'Completed');
                        const totalDist = vTrips.reduce((sum, t) => sum + t.plannedDistance, 0);
                        const totalFuel = vTrips.reduce((sum, t) => sum + (t.fuelConsumed || 0), 0);
                        const efficiency = totalFuel > 0 ? (totalDist / totalFuel) : 0;
                        const maxVal = 9;
                        const barHeight = efficiency > 0 ? Math.min(150, (efficiency / maxVal) * 150) : 10;
                        const xOffset = 80 + idx * 80;
                        
                        return (
                          <g key={v.id}>
                            <rect x={xOffset} y={170 - barHeight} width="32" height={barHeight} fill="url(#primaryGrad)" rx="4" className="svg-chart-bar" />
                            <text x={xOffset + 16} y={160 - barHeight} textAnchor="middle" style={{ fill: 'var(--text-header)', fontSize: '10px', fontWeight: 'bold' }}>
                              {efficiency > 0 ? efficiency.toFixed(1) : 'N/A'}
                            </text>
                            <text x={xOffset + 16} y="188" textAnchor="middle" className="svg-chart-text">{v.registrationNumber}</text>
                          </g>
                        );
                      })}
                      
                      <defs>
                        <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" />
                          <stop offset="100%" stopColor="var(--primary-glow)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-card-header">
                    <div>
                      <h3 className="chart-title">Fleet Operating Costs</h3>
                      <p className="chart-subtitle">Stacked cost breakdown (Fuel + Repairs) per vehicle</p>
                    </div>
                  </div>

                  <div className="svg-chart-container">
                    <svg width="100%" height="100%" viewBox="0 0 500 220" preserveAspectRatio="none">
                      <line x1="50" y1="20" x2="480" y2="20" className="svg-chart-grid" />
                      <line x1="50" y1="70" x2="480" y2="70" className="svg-chart-grid" />
                      <line x1="50" y1="120" x2="480" y2="120" className="svg-chart-grid" />
                      <line x1="50" y1="170" x2="480" y2="170" className="svg-chart-grid" />
                      <line x1="50" y1="10" x2="50" y2="170" className="svg-chart-axis" />
                      <line x1="50" y1="170" x2="480" y2="170" className="svg-chart-axis" />
                      <text x="10" y="25" className="svg-chart-text">$4,000</text>
                      <text x="10" y="75" className="svg-chart-text">$2,500</text>
                      <text x="10" y="125" className="svg-chart-text">$1,000</text>
                      <text x="15" y="175" className="svg-chart-text">$0</text>

                      {vehicles.slice(0, 5).map((v, idx) => {
                        const totalFuelCost = fuelLogs.filter(f => f.vehicleId === v.id).reduce((sum, f) => sum + f.cost, 0);
                        const totalMaintCost = maintenance.filter(m => m.vehicleId === v.id).reduce((sum, m) => sum + m.cost, 0);
                        const maxVal = 4000;
                        const fuelHeight = Math.min(150, (totalFuelCost / maxVal) * 150);
                        const maintHeight = Math.min(150, (totalMaintCost / maxVal) * 150);
                        const totalHeight = fuelHeight + maintHeight;
                        const xOffset = 80 + idx * 80;

                        return (
                          <g key={v.id}>
                            <rect x={xOffset} y={170 - fuelHeight} width="32" height={fuelHeight} fill="var(--info)" className="svg-chart-bar" />
                            <rect x={xOffset} y={170 - totalHeight} width="32" height={maintHeight} fill="var(--warning)" className="svg-chart-bar" />
                            <text x={xOffset + 16} y={162 - totalHeight} textAnchor="middle" style={{ fill: 'var(--text-header)', fontSize: '10px', fontWeight: 'bold' }}>
                              ${totalFuelCost + totalMaintCost}
                            </text>
                            <text x={xOffset + 16} y="188" textAnchor="middle" className="svg-chart-text">{v.registrationNumber}</text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                  
                  <div className="svg-chart-legend">
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: 'var(--info)' }}></div>
                      <span>Fuel</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: 'var(--warning)' }}></div>
                      <span>Maintenance</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="section-header" style={{ marginTop: '40px' }}>
                <h3 className="section-title" style={{ fontSize: '20px' }}>Operational Activity</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {canDispatchTrips && (
                    <button className="btn btn-primary" onClick={openTripCreate}>
                      <Icons.PlusIcon size={16} /> Plan Trip
                    </button>
                  )}
                  {canEditFleet && (
                    <button className="btn btn-secondary" onClick={openMaintenanceCreate}>
                      <Icons.PlusIcon size={16} /> Log Repair
                    </button>
                  )}
                </div>
              </div>

              <div className="table-container">
                <table className="responsive-table">
                  <thead>
                    <tr>
                      <th>Trip ID</th>
                      <th>Route</th>
                      <th>Vehicle</th>
                      <th>Driver Assigned</th>
                      <th>Cargo Weight</th>
                      <th>Distance</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trips.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No active dispatches.</td>
                      </tr>
                    ) : (
                      trips.slice(0, 5).map(t => {
                        const vehicle = vehicles.find(v => v.id === t.vehicleId);
                        const driver = drivers.find(d => d.id === t.driverId);
                        return (
                          <tr key={t.id}>
                            <td className="cell-bold">{t.id.toUpperCase()}</td>
                            <td>
                              <div className="cell-bold">{t.source}</div>
                              <div className="cell-sub">to {t.destination}</div>
                            </td>
                            <td>
                              <div className="cell-bold">{vehicle ? vehicle.registrationNumber : ''}</div>
                              <div className="cell-sub">{vehicle ? vehicle.nameModel : ''}</div>
                            </td>
                            <td>
                              <div className="cell-bold">{driver ? driver.name : ''}</div>
                              <div className="cell-sub">{driver ? driver.licenseCategory : ''}</div>
                            </td>
                            <td>{t.cargoWeight} kg</td>
                            <td>{t.plannedDistance} km</td>
                            <td>
                              <span className={`badge badge-${t.status.toLowerCase()}`}>
                                <span className="badge-dot"></span> {t.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentTab === 'vehicles' && (
            <div className="animate-fade">
              <div className="section-header">
                <h2 className="section-title">Fleet Vehicles Registry</h2>
                <div className="filter-bar">
                  <div className="search-box">
                    <Icons.SearchIcon size={18} />
                    <input 
                      type="text" 
                      className="search-input" 
                      placeholder="Search Vehicle..."
                      value={vehicleSearch}
                      onChange={(e) => setVehicleSearch(e.target.value)}
                    />
                  </div>

                  <select className="filter-select" value={vehicleTypeFilter} onChange={(e) => setVehicleTypeFilter(e.target.value)}>
                    <option value="All">All Types</option>
                    <option value="Cargo Van">Cargo Van</option>
                    <option value="Box Truck">Box Truck</option>
                    <option value="Semi-Truck">Semi-Truck</option>
                    <option value="Flatbed Truck">Flatbed Truck</option>
                  </select>

                  <select className="filter-select" value={vehicleStatusFilter} onChange={(e) => setVehicleStatusFilter(e.target.value)}>
                    <option value="All">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="On Trip">On Trip</option>
                    <option value="In Shop">In Shop</option>
                    <option value="Retired">Retired</option>
                  </select>

                  {canEditFleet ? (
                    <button className="btn btn-primary" onClick={openVehicleCreate}>
                      <Icons.PlusIcon size={18} /> Add Vehicle
                    </button>
                  ) : (
                    <button className="btn btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                      <Icons.PlusIcon size={18} /> Add Vehicle
                    </button>
                  )}
                </div>
              </div>

              <div className="table-container">
                <table className="responsive-table">
                  <thead>
                    <tr>
                      <th>Reg. Number</th>
                      <th>Model & Category</th>
                      <th>Capacity (kg)</th>
                      <th>Odometer (km)</th>
                      <th>Acquisition Cost</th>
                      <th>Region</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVehicles.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>No vehicles found.</td>
                      </tr>
                    ) : (
                      filteredVehicles.map(v => (
                        <tr key={v.id}>
                          <td className="cell-bold">{v.registrationNumber}</td>
                          <td>
                            <div className="cell-bold">{v.nameModel}</div>
                            <div className="cell-sub">{v.type}</div>
                          </td>
                          <td>{v.maxLoadCapacity.toLocaleString()} kg</td>
                          <td>{v.odometer.toLocaleString()} km</td>
                          <td>${v.acquisitionCost.toLocaleString()}</td>
                          <td>{v.region}</td>
                          <td>
                            <span className={`badge badge-${v.status.toLowerCase().replace(' ', '')}`}>
                              <span className="badge-dot"></span> {v.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-btns-group">
                              {canEditFleet ? (
                                <>
                                  <button className="icon-btn" onClick={() => openVehicleEdit(v)} title="Edit">
                                    <Icons.EditIcon size={16} />
                                  </button>
                                  {v.status !== 'Retired' && (
                                    <button className="icon-btn icon-btn-danger" onClick={() => handleRetireVehicle(v)} title="Retire">
                                      <Icons.AlertIcon size={16} />
                                    </button>
                                  )}
                                  <button className="icon-btn icon-btn-danger" onClick={() => handleDeleteVehicle(v.id)} title="Delete">
                                    <Icons.TrashIcon size={16} />
                                  </button>
                                </>
                              ) : (
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Read-Only</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentTab === 'drivers' && (
            <div className="animate-fade">
              <div className="section-header">
                <h2 className="section-title">Driver Registry</h2>
                <div className="filter-bar">
                  <div className="search-box">
                    <Icons.SearchIcon size={18} />
                    <input 
                      type="text" 
                      className="search-input" 
                      placeholder="Search Driver Name..."
                      value={driverSearch}
                      onChange={(e) => setDriverSearch(e.target.value)}
                    />
                  </div>

                  <select className="filter-select" value={driverStatusFilter} onChange={(e) => setDriverStatusFilter(e.target.value)}>
                    <option value="All">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="On Trip">On Trip</option>
                    <option value="Off Duty">Off Duty</option>
                    <option value="Suspended">Suspended</option>
                  </select>

                  {canEditDrivers ? (
                    <button className="btn btn-primary" onClick={openDriverCreate}>
                      <Icons.PlusIcon size={18} /> Add Driver
                    </button>
                  ) : (
                    <button className="btn btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                      <Icons.PlusIcon size={18} /> Add Driver
                    </button>
                  )}
                </div>
              </div>

              <div className="table-container">
                <table className="responsive-table">
                  <thead>
                    <tr>
                      <th>Driver</th>
                      <th>License Number</th>
                      <th>Category</th>
                      <th>Expiry Date</th>
                      <th>Contact Info</th>
                      <th>Safety Score</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDrivers.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>No drivers found.</td>
                      </tr>
                    ) : (
                      filteredDrivers.map(d => {
                        const expired = isLicenseExpired(d.licenseExpiryDate);
                        return (
                          <tr key={d.id}>
                            <td>
                              <div className="driver-avatar-cell">
                                <div className="driver-avatar">{d.name.split(' ').map(n=>n[0]).join('')}</div>
                                <div className="cell-bold">{d.name}</div>
                              </div>
                            </td>
                            <td>{d.licenseNumber}</td>
                            <td>{d.licenseCategory}</td>
                            <td>
                              <span style={{ 
                                color: expired ? 'var(--danger)' : 'inherit', 
                                fontWeight: expired ? 'bold' : 'normal',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                {expired && <Icons.AlertIcon size={14} />}
                                {d.licenseExpiryDate}
                                {expired && <span style={{ fontSize: '10px' }}>(Expired)</span>}
                              </span>
                            </td>
                            <td>{d.contactNumber}</td>
                            <td>
                              <span style={{ 
                                fontWeight: 'bold',
                                color: d.safetyScore >= 90 ? 'var(--success)' : d.safetyScore >= 70 ? 'var(--warning)' : 'var(--danger)'
                              }}>
                                {d.safetyScore}/100
                              </span>
                            </td>
                            <td>
                              <span className={`badge badge-${d.status.toLowerCase().replace(' ', '')}`}>
                                <span className="badge-dot"></span> {d.status}
                              </span>
                            </td>
                            <td>
                              <div className="action-btns-group">
                                {canEditDrivers ? (
                                  <>
                                    <button className="icon-btn" onClick={() => openDriverEdit(d)} title="Edit">
                                      <Icons.EditIcon size={16} />
                                    </button>
                                    {d.status !== 'Suspended' && (
                                      <button className="icon-btn icon-btn-danger" onClick={() => updateDriver({ ...d, status: 'Suspended' })} title="Suspend">
                                        <Icons.AlertIcon size={16} />
                                      </button>
                                    )}
                                    {d.status === 'Suspended' && (
                                      <button className="icon-btn" style={{ color: 'var(--success)', borderColor: 'var(--success)' }} onClick={() => updateDriver({ ...d, status: 'Available' })} title="Activate">
                                        <Icons.CheckIcon size={16} />
                                      </button>
                                    )}
                                    <button className="icon-btn icon-btn-danger" onClick={() => handleDeleteDriver(d.id)} title="Delete">
                                      <Icons.TrashIcon size={16} />
                                    </button>
                                  </>
                                ) : (
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Read-Only</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentTab === 'trips' && (
            <div className="animate-fade">
              <div className="section-header">
                <h2 className="section-title">Trip Management</h2>
                <div className="filter-bar">
                  <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
                    {['All', 'Draft', 'Dispatched', 'Completed', 'Cancelled'].map(st => (
                      <button 
                        key={st}
                        className={`btn ${tripStatusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '6px 12px', fontSize: '12px', border: 'none' }}
                        onClick={() => setTripStatusFilter(st)}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {canDispatchTrips ? (
                    <button className="btn btn-primary" onClick={openTripCreate}>
                      <Icons.PlusIcon size={18} /> Plan Trip
                    </button>
                  ) : (
                    <button className="btn btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                      <Icons.PlusIcon size={18} /> Plan Trip
                    </button>
                  )}
                </div>
              </div>

              <div className="table-container">
                <table className="responsive-table">
                  <thead>
                    <tr>
                      <th>Trip ID</th>
                      <th>Origin / Dest</th>
                      <th>Vehicle</th>
                      <th>Driver</th>
                      <th>Load (Weight)</th>
                      <th>Distance</th>
                      <th>Revenue</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrips.length === 0 ? (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>No trips found.</td>
                      </tr>
                    ) : (
                      filteredTrips.map(t => {
                        const vehicle = vehicles.find(v => v.id === t.vehicleId);
                        const driver = drivers.find(d => d.id === t.driverId);
                        return (
                          <tr key={t.id}>
                            <td className="cell-bold">{t.id.toUpperCase()}</td>
                            <td>
                              <div className="cell-bold">{t.source}</div>
                              <div className="cell-sub">➔ {t.destination}</div>
                            </td>
                            <td>
                              <div className="cell-bold">{vehicle ? vehicle.registrationNumber : ''}</div>
                              <div className="cell-sub">{vehicle ? vehicle.nameModel : ''}</div>
                            </td>
                            <td>
                              <div className="cell-bold">{driver ? driver.name : ''}</div>
                              <div className="cell-sub">Score: {driver ? driver.safetyScore : '0'}</div>
                            </td>
                            <td>{t.cargoWeight.toLocaleString()} kg</td>
                            <td>{t.plannedDistance.toLocaleString()} km</td>
                            <td>${t.revenue.toLocaleString()}</td>
                            <td>
                              <span className={`badge badge-${t.status.toLowerCase()}`}>
                                <span className="badge-dot"></span> {t.status}
                              </span>
                            </td>
                            <td>
                              <div className="action-btns-group">
                                {canDispatchTrips ? (
                                  <>
                                    {t.status === 'Draft' && (
                                      <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => dispatchTrip(t.id)}>
                                        <Icons.TripIcon size={12} /> Dispatch
                                      </button>
                                    )}
                                    {t.status === 'Dispatched' && (
                                      <>
                                        <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '11px', backgroundColor: 'var(--success)' }} onClick={() => openCompleteTrip(t.id)}>
                                          <Icons.CheckIcon size={12} /> Complete
                                        </button>
                                        <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => cancelTrip(t.id)}>
                                          <Icons.CrossIcon size={12} /> Cancel
                                        </button>
                                      </>
                                    )}
                                  </>
                                ) : (
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Read-Only</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentTab === 'maintenance' && (
            <div className="animate-fade">
              <div className="section-header">
                <h2 className="section-title">Fleet Maintenance Logs</h2>
                <div className="filter-bar">
                  {canEditFleet ? (
                    <button className="btn btn-primary" onClick={openMaintenanceCreate}>
                      <Icons.PlusIcon size={18} /> Log Ticket
                    </button>
                  ) : (
                    <button className="btn btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                      <Icons.PlusIcon size={18} /> Log Ticket
                    </button>
                  )}
                </div>
              </div>

              <div className="table-container">
                <table className="responsive-table">
                  <thead>
                    <tr>
                      <th>Record ID</th>
                      <th>Vehicle</th>
                      <th>Repairs Description</th>
                      <th>Expense Cost</th>
                      <th>Log Date</th>
                      <th>Ticket Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenance.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>No maintenance records found.</td>
                      </tr>
                    ) : (
                      [...maintenance].reverse().map(m => {
                        const vehicle = vehicles.find(v => v.id === m.vehicleId);
                        return (
                          <tr key={m.id}>
                            <td className="cell-bold">{m.id.toUpperCase()}</td>
                            <td>
                              <div className="cell-bold">{vehicle ? vehicle.registrationNumber : ''}</div>
                              <div className="cell-sub">{vehicle ? vehicle.nameModel : ''}</div>
                            </td>
                            <td>{m.description}</td>
                            <td className="cell-bold" style={{ color: 'var(--danger)' }}>${m.cost.toLocaleString()}</td>
                            <td>{m.date}</td>
                            <td>
                              <span className={`badge ${m.status === 'Active' ? 'badge-inshop' : 'badge-available'}`}>
                                <span className="badge-dot"></span> {m.status === 'Active' ? 'In Shop' : 'Completed'}
                              </span>
                            </td>
                            <td>
                              {canEditFleet && m.status === 'Active' ? (
                                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => closeMaintenance(m.id)}>
                                  <Icons.CheckIcon size={12} /> Release
                                </button>
                              ) : (
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ticket Closed</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentTab === 'expenses' && (
            <div className="animate-fade">
              <div className="section-header">
                <h2 className="section-title">Expenses & Fuel Logs</h2>
                <div className="filter-bar">
                  {canEditExpenses ? (
                    <>
                      <button className="btn btn-secondary" onClick={openFuelCreate}>
                        <Icons.PlusIcon size={18} /> Log Fuel
                      </button>
                      <button className="btn btn-primary" onClick={openExpenseCreate}>
                        <Icons.PlusIcon size={18} /> Record Expense
                      </button>
                    </>
                  ) : (
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Financial Analyst view required to add entries</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
                <div>
                  <h3 className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>Fuel Logging History</h3>
                  <div className="table-container">
                    <table className="responsive-table">
                      <thead>
                        <tr>
                          <th>Vehicle</th>
                          <th>Liters</th>
                          <th>Total Cost</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...fuelLogs].reverse().map(f => {
                          const vehicle = vehicles.find(v => v.id === f.vehicleId);
                          return (
                            <tr key={f.id}>
                              <td className="cell-bold">{vehicle ? vehicle.registrationNumber : ''}</td>
                              <td>{f.liters} L</td>
                              <td className="cell-bold">${f.cost}</td>
                              <td>{f.date}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>Administrative Expenses</h3>
                  <div className="table-container">
                    <table className="responsive-table">
                      <thead>
                        <tr>
                          <th>Vehicle</th>
                          <th>Type</th>
                          <th>Description</th>
                          <th>Cost</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...expenses].reverse().map(e => {
                          const vehicle = vehicles.find(v => v.id === e.vehicleId);
                          return (
                            <tr key={e.id}>
                              <td className="cell-bold">{vehicle ? vehicle.registrationNumber : ''}</td>
                              <td>
                                <span className={`badge ${e.type === 'Repair' ? 'badge-inshop' : e.type === 'Toll' ? 'badge-ontrip' : 'badge-draft'}`}>
                                  {e.type}
                                </span>
                              </td>
                              <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={e.description}>
                                {e.description}
                              </td>
                              <td className="cell-bold" style={{ color: 'var(--danger)' }}>${e.cost}</td>
                              <td>{e.date}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'reports' && (
            <div className="animate-fade">
              <div className="section-header">
                <h2 className="section-title">Reports & ROI Analytics</h2>
                <div className="filter-bar">
                  <button className="btn btn-secondary" onClick={exportToCSV}>
                    <Icons.DownloadIcon size={18} /> Export CSV
                  </button>
                </div>
              </div>

              <div className="metrics-summary-grid">
                <div className="metric-panel">
                  <span className="metric-panel-title">Total Operations Cost</span>
                  <div className="metric-panel-value" style={{ color: 'var(--danger)' }}>
                    ${(
                      fuelLogs.reduce((sum, f) => sum + f.cost, 0) + 
                      expenses.reduce((sum, e) => sum + e.cost, 0)
                    ).toLocaleString()}
                  </div>
                  <span className="metric-panel-sub">Fuel + Maintenance + Tolls</span>
                </div>

                <div className="metric-panel">
                  <span className="metric-panel-title">Total Fleet Revenue</span>
                  <div className="metric-panel-value" style={{ color: 'var(--success)' }}>
                    ${trips.filter(t => t.status === 'Completed').reduce((sum, t) => sum + t.revenue, 0).toLocaleString()}
                  </div>
                  <span className="metric-panel-sub">Completed dispatches</span>
                </div>

                <div className="metric-panel">
                  <span className="metric-panel-title">Net Profitability</span>
                  {(() => {
                    const rev = trips.filter(t => t.status === 'Completed').reduce((sum, t) => sum + t.revenue, 0);
                    const cost = fuelLogs.reduce((sum, f) => sum + f.cost, 0) + expenses.reduce((sum, e) => sum + e.cost, 0);
                    const net = rev - cost;
                    return (
                      <>
                        <div className="metric-panel-value" style={{ color: net >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                          ${net.toLocaleString()}
                        </div>
                        <span className="metric-panel-sub">Margin: {rev > 0 ? ((net / rev) * 100).toFixed(1) : 0}%</span>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="table-container">
                <table className="responsive-table">
                  <thead>
                    <tr>
                      <th>Vehicle Reg.</th>
                      <th>Category</th>
                      <th>Trips (Qty)</th>
                      <th>Dist. (km)</th>
                      <th>Fuel (L)</th>
                      <th>Efficiency (km/L)</th>
                      <th>Fuel Cost</th>
                      <th>Maint. Cost</th>
                      <th>Revenue</th>
                      <th>ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map(v => {
                      const vTrips = trips.filter(t => t.vehicleId === v.id && t.status === 'Completed');
                      const totalDist = vTrips.reduce((sum, t) => sum + t.plannedDistance, 0);
                      const totalFuel = vTrips.reduce((sum, t) => sum + (t.fuelConsumed || 0), 0);
                      const avgEff = totalFuel > 0 ? (totalDist / totalFuel).toFixed(2) : '0';
                      const fuelCost = fuelLogs.filter(f => f.vehicleId === v.id).reduce((sum, f) => sum + f.cost, 0);
                      const maintCost = maintenance.filter(m => m.vehicleId === v.id).reduce((sum, m) => sum + m.cost, 0);
                      const revenue = vTrips.reduce((sum, t) => sum + t.revenue, 0);
                      const roi = v.acquisitionCost > 0 
                        ? (((revenue - (maintCost + fuelCost)) / v.acquisitionCost) * 100)
                        : 0;

                      return (
                        <tr key={v.id}>
                          <td className="cell-bold">{v.registrationNumber}</td>
                          <td>{v.type}</td>
                          <td>{vTrips.length}</td>
                          <td>{totalDist.toLocaleString()} km</td>
                          <td>{totalFuel} L</td>
                          <td className="cell-bold">{avgEff} km/L</td>
                          <td>${fuelCost}</td>
                          <td>${maintCost}</td>
                          <td className="cell-bold" style={{ color: 'var(--success)' }}>${revenue.toLocaleString()}</td>
                          <td>
                            <span style={{ fontWeight: 'bold', color: roi >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                              {roi >= 0 ? '+' : ''}{roi.toFixed(2)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {vehicleModal.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {vehicleModal.mode === 'create' ? 'Add Fleet Vehicle' : 'Edit Fleet Vehicle'}
              </h3>
              <button className="modal-close-btn" onClick={() => setVehicleModal({ open: false, mode: 'create', data: null })}>
                <Icons.CrossIcon size={20} />
              </button>
            </div>
            
            <form onSubmit={handleVehicleSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="form-error-banner">
                    <Icons.AlertIcon size={18} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Registration Number</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. TRK-990" 
                      required
                      value={vehicleForm.registrationNumber}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, registrationNumber: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vehicle Type</label>
                    <select 
                      className="form-control"
                      value={vehicleForm.type}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, type: e.target.value })}
                    >
                      <option value="Cargo Van">Cargo Van</option>
                      <option value="Box Truck">Box Truck</option>
                      <option value="Semi-Truck">Semi-Truck</option>
                      <option value="Flatbed Truck">Flatbed Truck</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Vehicle Name & Model</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Volvo FH16" 
                    required
                    value={vehicleForm.nameModel}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, nameModel: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Max Load Capacity (kg)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="e.g. 10000" 
                      required
                      value={vehicleForm.maxLoadCapacity}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, maxLoadCapacity: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Odometer (km)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="e.g. 45000" 
                      required
                      value={vehicleForm.odometer}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, odometer: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Acquisition Cost ($)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="e.g. 85000" 
                      required
                      value={vehicleForm.acquisitionCost}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, acquisitionCost: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assigned Region</label>
                    <select 
                      className="form-control"
                      value={vehicleForm.region}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, region: e.target.value })}
                    >
                      <option value="North">North</option>
                      <option value="East">East</option>
                      <option value="South">South</option>
                      <option value="West">West</option>
                    </select>
                  </div>
                </div>

                {vehicleModal.mode === 'edit' && (
                  <div className="form-group">
                    <label className="form-label">Vehicle Status</label>
                    <select 
                      className="form-control"
                      value={vehicleForm.status}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, status: e.target.value })}
                    >
                      <option value="Available">Available</option>
                      <option value="On Trip">On Trip</option>
                      <option value="In Shop">In Shop</option>
                      <option value="Retired">Retired</option>
                    </select>
                  </div>
                )}
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setVehicleModal({ open: false, mode: 'create', data: null })}>Cancel</button>
                <button type="submit" className="btn btn-primary">{vehicleModal.mode === 'create' ? 'Create' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {driverModal.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {driverModal.mode === 'create' ? 'Add Driver' : 'Edit Driver'}
              </h3>
              <button className="modal-close-btn" onClick={() => setDriverModal({ open: false, mode: 'create', data: null })}>
                <Icons.CrossIcon size={20} />
              </button>
            </div>
            
            <form onSubmit={handleDriverSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="form-error-banner">
                    <Icons.AlertIcon size={18} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. John Smith" 
                    required
                    value={driverForm.name}
                    onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">License Number</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. DL-19283" 
                      required
                      value={driverForm.licenseNumber}
                      onChange={(e) => setDriverForm({ ...driverForm, licenseNumber: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">License Category</label>
                    <select 
                      className="form-control"
                      value={driverForm.licenseCategory}
                      onChange={(e) => setDriverForm({ ...driverForm, licenseCategory: e.target.value })}
                    >
                      <option value="Class A CDL">Class A CDL</option>
                      <option value="Class B CDL">Class B CDL</option>
                      <option value="Class C">Class C</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">License Expiry Date</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      required
                      value={driverForm.licenseExpiryDate}
                      onChange={(e) => setDriverForm({ ...driverForm, licenseExpiryDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Number</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. +1-555-0100" 
                      required
                      value={driverForm.contactNumber}
                      onChange={(e) => setDriverForm({ ...driverForm, contactNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Safety score (0-100)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="100" 
                      min="0"
                      max="100"
                      required
                      value={driverForm.safetyScore}
                      onChange={(e) => setDriverForm({ ...driverForm, safetyScore: e.target.value })}
                    />
                  </div>
                  {driverModal.mode === 'edit' && (
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select 
                        className="form-control"
                        value={driverForm.status}
                        onChange={(e) => setDriverForm({ ...driverForm, status: e.target.value })}
                      >
                        <option value="Available">Available</option>
                        <option value="On Trip">On Trip</option>
                        <option value="Off Duty">Off Duty</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setDriverModal({ open: false, mode: 'create', data: null })}>Cancel</button>
                <button type="submit" className="btn btn-primary">{driverModal.mode === 'create' ? 'Create' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {tripModal.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Plan Cargo Trip</h3>
              <button className="modal-close-btn" onClick={() => setTripModal({ open: false })}>
                <Icons.CrossIcon size={20} />
              </button>
            </div>
            
            <form onSubmit={handleTripSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="form-error-banner">
                    <Icons.AlertIcon size={18} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Origin</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Phoenix" 
                      required
                      value={tripForm.source}
                      onChange={(e) => setTripForm({ ...tripForm, source: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Destination</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Seattle" 
                      required
                      value={tripForm.destination}
                      onChange={(e) => setTripForm({ ...tripForm, destination: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Vehicle</label>
                  <select 
                    className="form-control"
                    required
                    value={tripForm.vehicleId}
                    onChange={(e) => setTripForm({ ...tripForm, vehicleId: e.target.value })}
                  >
                    <option value="" disabled>-- Select Vehicle --</option>
                    {vehicles.filter(v => v.status === 'Available').map(v => (
                      <option key={v.id} value={v.id}>
                        {v.registrationNumber} - {v.nameModel} (Limit: {v.maxLoadCapacity} kg)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Driver</label>
                  <select 
                    className="form-control"
                    required
                    value={tripForm.driverId}
                    onChange={(e) => setTripForm({ ...tripForm, driverId: e.target.value })}
                  >
                    <option value="" disabled>-- Select Driver --</option>
                    {drivers.filter(d => d.status === 'Available' && !isLicenseExpired(d.licenseExpiryDate)).map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} (Cat: {d.licenseCategory}, Expiry: {d.licenseExpiryDate})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Cargo weight (kg)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="e.g. 500" 
                      required
                      value={tripForm.cargoWeight}
                      onChange={(e) => setTripForm({ ...tripForm, cargoWeight: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Planned Distance (km)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="e.g. 200" 
                      required
                      value={tripForm.plannedDistance}
                      onChange={(e) => setTripForm({ ...tripForm, plannedDistance: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Revenue ($) (Optional)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Auto-calculated if empty"
                    value={tripForm.revenue}
                    onChange={(e) => setTripForm({ ...tripForm, revenue: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setTripModal({ open: false })}>Cancel</button>
                <button type="submit" className="btn btn-primary">Draft Trip</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {completeTripModal.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Complete Trip</h3>
              <button className="modal-close-btn" onClick={() => setCompleteTripModal({ open: false, tripId: null })}>
                <Icons.CrossIcon size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCompleteTripSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="form-error-banner">
                    <Icons.AlertIcon size={18} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Final Odometer Reading (km)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    required
                    value={completeTripForm.finalOdometer}
                    onChange={(e) => setCompleteTripForm({ ...completeTripForm, finalOdometer: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Fuel Consumed (Liters)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    required
                    value={completeTripForm.fuelConsumed}
                    onChange={(e) => setCompleteTripForm({ ...completeTripForm, fuelConsumed: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Fuel Expense Cost ($) (Optional)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Estimate generated if empty"
                    value={completeTripForm.fuelCost}
                    onChange={(e) => setCompleteTripForm({ ...completeTripForm, fuelCost: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setCompleteTripModal({ open: false, tripId: null })}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--success)' }}>Complete Trip</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {maintenanceModal.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Open Maintenance log ticket</h3>
              <button className="modal-close-btn" onClick={() => setMaintenanceModal({ open: false })}>
                <Icons.CrossIcon size={20} />
              </button>
            </div>
            
            <form onSubmit={handleMaintenanceSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="form-error-banner">
                    <Icons.AlertIcon size={18} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Select Vehicle</label>
                  <select 
                    className="form-control"
                    required
                    value={maintenanceForm.vehicleId}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, vehicleId: e.target.value })}
                  >
                    <option value="" disabled>-- Select Vehicle --</option>
                    {vehicles.filter(v => v.status !== 'Retired' && v.status !== 'On Trip').map(v => (
                      <option key={v.id} value={v.id}>
                        {v.registrationNumber} - {v.nameModel} ({v.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Repairs Description</label>
                  <textarea 
                    rows="3"
                    className="form-control" 
                    placeholder="e.g. Brake pad replacement" 
                    required
                    value={maintenanceForm.description}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Maintenance Cost ($)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="e.g. 750" 
                      required
                      value={maintenanceForm.cost}
                      onChange={(e) => setMaintenanceForm({ ...maintenanceForm, cost: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Log Date</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      required
                      value={maintenanceForm.date}
                      onChange={(e) => setMaintenanceForm({ ...maintenanceForm, date: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setMaintenanceModal({ open: false })}>Cancel</button>
                <button type="submit" className="btn btn-primary">Open Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {fuelModal.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Record Fuel Refill</h3>
              <button className="modal-close-btn" onClick={() => setFuelModal({ open: false })}>
                <Icons.CrossIcon size={20} />
              </button>
            </div>
            
            <form onSubmit={handleFuelSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Vehicle</label>
                  <select 
                    className="form-control"
                    required
                    value={fuelForm.vehicleId}
                    onChange={(e) => setFuelForm({ ...fuelForm, vehicleId: e.target.value })}
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.registrationNumber} - {v.nameModel}</option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Fuel Filled (Liters)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      required
                      value={fuelForm.liters}
                      onChange={(e) => setFuelForm({ ...fuelForm, liters: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Cost ($)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      required
                      value={fuelForm.cost}
                      onChange={(e) => setFuelForm({ ...fuelForm, cost: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Log Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    required
                    value={fuelForm.date}
                    onChange={(e) => setFuelForm({ ...fuelForm, date: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setFuelModal({ open: false })}>Cancel</button>
                <button type="submit" className="btn btn-primary">Log Fuel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {expenseModal.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Record Fleet Expense</h3>
              <button className="modal-close-btn" onClick={() => setExpenseModal({ open: false })}>
                <Icons.CrossIcon size={20} />
              </button>
            </div>
            
            <form onSubmit={handleExpenseSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Select Vehicle</label>
                    <select 
                      className="form-control"
                      required
                      value={expForm.vehicleId}
                      onChange={(e) => setExpForm({ ...expForm, vehicleId: e.target.value })}
                    >
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.registrationNumber} - {v.nameModel}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select 
                      className="form-control"
                      value={expForm.type}
                      onChange={(e) => setExpForm({ ...expForm, type: e.target.value })}
                    >
                      <option value="Toll">Toll Fee</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Repair">Repair / Spare Part</option>
                      <option value="Other">Other Miscellaneous</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Transaction Description</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required
                    value={expForm.description}
                    onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Transaction Cost ($)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      required
                      value={expForm.cost}
                      onChange={(e) => setExpForm({ ...expForm, cost: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Log Date</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      required
                      value={expForm.date}
                      onChange={(e) => setExpForm({ ...expForm, date: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setExpenseModal({ open: false })}>Cancel</button>
                <button type="submit" className="btn btn-primary">Log Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function App() {
  return (
    <TransitProvider>
      <AppContent />
    </TransitProvider>
  );
}

export default App;
