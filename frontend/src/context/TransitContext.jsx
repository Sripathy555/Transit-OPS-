import React, { createContext, useContext, useState, useEffect } from 'react';

const TransitContext = createContext();

const initialVehicles = [
  { id: 'v1', registrationNumber: 'TRK-001', nameModel: 'Volvo FH16 Semi', type: 'Semi-Truck', maxLoadCapacity: 15000, odometer: 85000, acquisitionCost: 120000, status: 'Available', region: 'North' },
  { id: 'v2', registrationNumber: 'VAN-002', nameModel: 'Ford Transit 350', type: 'Cargo Van', maxLoadCapacity: 1200, odometer: 34120, acquisitionCost: 35000, status: 'On Trip', region: 'East' },
  { id: 'v3', registrationNumber: 'TRK-003', nameModel: 'Isuzu NPR Box', type: 'Box Truck', maxLoadCapacity: 5000, odometer: 120000, acquisitionCost: 65000, status: 'In Shop', region: 'West' },
  { id: 'v4', registrationNumber: 'VAN-004', nameModel: 'Mercedes eSprinter', type: 'Cargo Van', maxLoadCapacity: 1000, odometer: 15400, acquisitionCost: 48000, status: 'Available', region: 'South' },
  { id: 'v5', registrationNumber: 'TRK-005', nameModel: 'Peterbilt 389 Flatbed', type: 'Flatbed Truck', maxLoadCapacity: 10000, odometer: 98000, acquisitionCost: 85000, status: 'Retired', region: 'North' }
];

const initialDrivers = [
  { id: 'd1', name: 'John Doe', licenseNumber: 'DL-98321-A', licenseCategory: 'Class A CDL', licenseExpiryDate: '2027-12-15', contactNumber: '+1-555-0192', safetyScore: 95, status: 'Available' },
  { id: 'd2', name: 'Sarah Smith', licenseNumber: 'DL-11028-B', licenseCategory: 'Class B CDL', licenseExpiryDate: '2026-11-20', contactNumber: '+1-555-0143', safetyScore: 88, status: 'On Trip' },
  { id: 'd3', name: 'Mike Jones', licenseNumber: 'DL-55419-C', licenseCategory: 'Class C', licenseExpiryDate: '2025-05-10', contactNumber: '+1-555-0177', safetyScore: 72, status: 'Off Duty' },
  { id: 'd4', name: 'David Lee', licenseNumber: 'DL-90901-A', licenseCategory: 'Class A CDL', licenseExpiryDate: '2028-01-10', contactNumber: '+1-555-0111', safetyScore: 99, status: 'Available' },
  { id: 'd5', name: 'Anna White', licenseNumber: 'DL-32454-B', licenseCategory: 'Class B CDL', licenseExpiryDate: '2026-08-18', contactNumber: '+1-555-0155', safetyScore: 55, status: 'Suspended' }
];

const initialTrips = [
  { id: 't1', source: 'Chicago Hub', destination: 'Detroit Depot', vehicleId: 'v2', driverId: 'd2', cargoWeight: 800, plannedDistance: 450, status: 'Dispatched', actualOdometerEnd: null, fuelConsumed: null, revenue: 1500 },
  { id: 't2', source: 'Houston Terminal', destination: 'Dallas Port', vehicleId: 'v1', driverId: 'd1', cargoWeight: 12000, plannedDistance: 380, status: 'Completed', actualOdometerEnd: 85000, fuelConsumed: 140, revenue: 3200 }
];

const initialMaintenance = [
  { id: 'm1', vehicleId: 'v3', description: 'Engine Transmission Overhaul', cost: 3500, date: '2026-07-10', status: 'Active' },
  { id: 'm2', vehicleId: 'v2', description: 'Brake Pad Replacement & Alignment', cost: 450, date: '2026-06-15', status: 'Closed' }
];

const initialFuelLogs = [
  { id: 'f1', vehicleId: 'v2', liters: 45, cost: 72, date: '2026-07-11' },
  { id: 'f2', vehicleId: 'v1', liters: 140, cost: 210, date: '2026-07-12' }
];

const initialExpenses = [
  { id: 'e1', vehicleId: 'v1', type: 'Toll', description: 'I-10 Expressway Tolls', cost: 65, date: '2026-07-12' },
  { id: 'e2', vehicleId: 'v2', type: 'Insurance', description: 'Monthly Commercial Vehicle Insurance Premium', cost: 250, date: '2026-07-01' }
];

export const TransitProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState(() => localStorage.getItem('role') || 'Fleet Manager');
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? saved === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [vehicles, setVehicles] = useState(() => JSON.parse(localStorage.getItem('vehicles')) || initialVehicles);
  const [drivers, setDrivers] = useState(() => JSON.parse(localStorage.getItem('drivers')) || initialDrivers);
  const [trips, setTrips] = useState(() => JSON.parse(localStorage.getItem('trips')) || initialTrips);
  const [maintenance, setMaintenance] = useState(() => JSON.parse(localStorage.getItem('maintenance')) || initialMaintenance);
  const [fuelLogs, setFuelLogs] = useState(() => JSON.parse(localStorage.getItem('fuelLogs')) || initialFuelLogs);
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem('expenses')) || initialExpenses);

  useEffect(() => {
    localStorage.setItem('role', activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('maintenance', JSON.stringify(maintenance));
  }, [maintenance]);

  useEffect(() => {
    localStorage.setItem('fuelLogs', JSON.stringify(fuelLogs));
  }, [fuelLogs]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const isLicenseExpired = (expiryDate) => {
    const today = new Date();
    const exp = new Date(expiryDate);
    return exp < today;
  };

  const addVehicle = (vehicle) => {
    const exists = vehicles.some(v => v.registrationNumber.toUpperCase() === vehicle.registrationNumber.toUpperCase());
    if (exists) {
      throw new Error(`Vehicle registration '${vehicle.registrationNumber}' already exists.`);
    }
    const newVehicle = {
      ...vehicle,
      id: 'v_' + Date.now(),
      status: vehicle.status || 'Available',
      odometer: Number(vehicle.odometer) || 0,
      maxLoadCapacity: Number(vehicle.maxLoadCapacity) || 0,
      acquisitionCost: Number(vehicle.acquisitionCost) || 0
    };
    setVehicles(prev => [...prev, newVehicle]);
    return newVehicle;
  };

  const updateVehicle = (updated) => {
    const exists = vehicles.some(v => v.id !== updated.id && v.registrationNumber.toUpperCase() === updated.registrationNumber.toUpperCase());
    if (exists) {
      throw new Error(`Vehicle registration '${updated.registrationNumber}' is already in use.`);
    }
    setVehicles(prev => prev.map(v => v.id === updated.id ? {
      ...v,
      ...updated,
      maxLoadCapacity: Number(updated.maxLoadCapacity),
      odometer: Number(updated.odometer),
      acquisitionCost: Number(updated.acquisitionCost)
    } : v));
  };

  const deleteVehicle = (id) => {
    const isLinked = trips.some(t => t.vehicleId === id && (t.status === 'Dispatched' || t.status === 'Draft'));
    if (isLinked) {
      throw new Error("Vehicle is linked to active or draft trips.");
    }
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  const addDriver = (driver) => {
    const newDriver = {
      ...driver,
      id: 'd_' + Date.now(),
      status: driver.status || 'Available',
      safetyScore: Number(driver.safetyScore) || 100
    };
    setDrivers(prev => [...prev, newDriver]);
    return newDriver;
  };

  const updateDriver = (updated) => {
    setDrivers(prev => prev.map(d => d.id === updated.id ? {
      ...d,
      ...updated,
      safetyScore: Number(updated.safetyScore)
    } : d));
  };

  const deleteDriver = (id) => {
    const isLinked = trips.some(t => t.driverId === id && (t.status === 'Dispatched' || t.status === 'Draft'));
    if (isLinked) {
      throw new Error("Driver is assigned to active or draft trips.");
    }
    setDrivers(prev => prev.filter(d => d.id !== id));
  };

  const createTrip = (tripData) => {
    const vehicle = vehicles.find(v => v.id === tripData.vehicleId);
    const driver = drivers.find(d => d.id === tripData.driverId);

    if (!vehicle) throw new Error("Please select a vehicle.");
    if (!driver) throw new Error("Please select a driver.");

    if (vehicle.status === 'Retired' || vehicle.status === 'In Shop') {
      throw new Error("Vehicle is retired or in the shop.");
    }
    if (vehicle.status === 'On Trip') {
      throw new Error("Vehicle is currently on a trip.");
    }
    if (driver.status === 'Suspended') {
      throw new Error("Driver is suspended.");
    }
    if (driver.status === 'On Trip') {
      throw new Error("Driver is currently on a trip.");
    }
    if (isLicenseExpired(driver.licenseExpiryDate)) {
      throw new Error("Driver license is expired.");
    }
    if (Number(tripData.cargoWeight) > vehicle.maxLoadCapacity) {
      throw new Error(`Cargo weight exceeds capacity limit (${vehicle.maxLoadCapacity} kg).`);
    }

    const newTrip = {
      id: 't_' + Date.now(),
      source: tripData.source,
      destination: tripData.destination,
      vehicleId: tripData.vehicleId,
      driverId: tripData.driverId,
      cargoWeight: Number(tripData.cargoWeight),
      plannedDistance: Number(tripData.plannedDistance),
      status: 'Draft',
      actualOdometerEnd: null,
      fuelConsumed: null,
      revenue: Number(tripData.revenue) || Math.round(Number(tripData.plannedDistance) * 3 + Number(tripData.cargoWeight) * 0.1)
    };

    setTrips(prev => [...prev, newTrip]);
    return newTrip;
  };

  const dispatchTrip = (tripId) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) throw new Error("Trip not found");

    const vehicle = vehicles.find(v => v.id === trip.vehicleId);
    const driver = drivers.find(d => d.id === trip.driverId);

    if (!vehicle || !driver) throw new Error("Vehicle or driver not found");
    if (isLicenseExpired(driver.licenseExpiryDate)) {
      throw new Error("Driver license has expired.");
    }
    if (driver.status === 'Suspended') {
      throw new Error("Driver is suspended.");
    }

    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'Dispatched' } : t));
    setVehicles(prev => prev.map(v => v.id === trip.vehicleId ? { ...v, status: 'On Trip' } : v));
    setDrivers(prev => prev.map(d => d.id === trip.driverId ? { ...d, status: 'On Trip' } : d));
  };

  const completeTrip = (tripId, finalOdometer, fuelConsumed, fuelCost = 0) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) throw new Error("Trip not found");

    const vehicle = vehicles.find(v => v.id === trip.vehicleId);
    if (!vehicle) throw new Error("Vehicle not found");

    const parsedOdometer = Number(finalOdometer);
    const parsedFuel = Number(fuelConsumed);
    const parsedFuelCost = Number(fuelCost) || Math.round(parsedFuel * 1.5);

    if (parsedOdometer < vehicle.odometer) {
      throw new Error(`Ending odometer cannot be less than current odometer (${vehicle.odometer} km).`);
    }
    if (parsedFuel <= 0) {
      throw new Error("Invalid fuel amount.");
    }

    setTrips(prev => prev.map(t => t.id === tripId ? {
      ...t,
      status: 'Completed',
      actualOdometerEnd: parsedOdometer,
      fuelConsumed: parsedFuel
    } : t));

    setVehicles(prev => prev.map(v => v.id === trip.vehicleId ? { ...v, odometer: parsedOdometer, status: 'Available' } : v));
    setDrivers(prev => prev.map(d => d.id === trip.driverId ? { ...d, status: 'Available' } : d));

    const newFuelLog = {
      id: 'f_' + Date.now(),
      vehicleId: trip.vehicleId,
      liters: parsedFuel,
      cost: parsedFuelCost,
      date: new Date().toISOString().split('T')[0]
    };
    setFuelLogs(prev => [...prev, newFuelLog]);
  };

  const cancelTrip = (tripId) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) throw new Error("Trip not found");

    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'Cancelled' } : t));

    if (trip.status === 'Dispatched') {
      setVehicles(prev => prev.map(v => v.id === trip.vehicleId ? { ...v, status: 'Available' } : v));
      setDrivers(prev => prev.map(d => d.id === trip.driverId ? { ...d, status: 'Available' } : d));
    }
  };

  const startMaintenance = (logData) => {
    const vehicle = vehicles.find(v => v.id === logData.vehicleId);
    if (!vehicle) throw new Error("Vehicle not found.");
    if (vehicle.status === 'On Trip') {
      throw new Error("Vehicle is on trip.");
    }

    const newLog = {
      id: 'm_' + Date.now(),
      vehicleId: logData.vehicleId,
      description: logData.description,
      cost: Number(logData.cost) || 0,
      date: logData.date || new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    setMaintenance(prev => [...prev, newLog]);
    setVehicles(prev => prev.map(v => v.id === logData.vehicleId ? { ...v, status: 'In Shop' } : v));

    const autoExpense = {
      id: 'e_' + Date.now(),
      vehicleId: logData.vehicleId,
      type: 'Repair',
      description: `Maint: ${logData.description}`,
      cost: Number(logData.cost) || 0,
      date: logData.date || new Date().toISOString().split('T')[0]
    };
    setExpenses(prev => [...prev, autoExpense]);
  };

  const closeMaintenance = (logId, restoreStatus = 'Available') => {
    const log = maintenance.find(m => m.id === logId);
    if (!log) throw new Error("Log not found");

    setMaintenance(prev => prev.map(m => m.id === logId ? { ...m, status: 'Closed' } : m));
    setVehicles(prev => prev.map(v => {
      if (v.id === log.vehicleId) {
        return { ...v, status: v.status === 'Retired' ? 'Retired' : restoreStatus };
      }
      return v;
    }));
  };

  const addFuelLogRecord = (log) => {
    const newLog = {
      ...log,
      id: 'f_' + Date.now(),
      liters: Number(log.liters) || 0,
      cost: Number(log.cost) || 0,
      date: log.date || new Date().toISOString().split('T')[0]
    };
    setFuelLogs(prev => [...prev, newLog]);
  };

  const addExpenseRecord = (exp) => {
    const newExp = {
      ...exp,
      id: 'e_' + Date.now(),
      cost: Number(exp.cost) || 0,
      date: exp.date || new Date().toISOString().split('T')[0]
    };
    setExpenses(prev => [...prev, newExp]);
  };

  return (
    <TransitContext.Provider value={{
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
    }}>
      {children}
    </TransitContext.Provider>
  );
};

export const useTransit = () => {
  const context = useContext(TransitContext);
  if (!context) {
    throw new Error('useTransit must be used within TransitProvider');
  }
  return context;
};
