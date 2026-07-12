// services/kpiService.js

async function getDashboardKPIs(filters = {}) {
  const vehicles = await Vehicle.findAll(filters); // filters: type, status, region

  const activeVehicles = vehicles.filter(v => ['Available', 'On Trip'].includes(v.status)).length;
  const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
  const inMaintenance = vehicles.filter(v => v.status === 'In Shop').length;
  const onTrip = vehicles.filter(v => v.status === 'On Trip').length;

  const activeTrips = await Trip.count({ status: 'Dispatched' });
  const pendingTrips = await Trip.count({ status: 'Draft' });
  const driversOnDuty = await Driver.count({ status: 'On Trip' });

  const fleetUtilization = activeVehicles > 0
    ? ((onTrip / activeVehicles) * 100).toFixed(2)
    : 0;

  return {
    activeVehicles, availableVehicles, inMaintenance,
    activeTrips, pendingTrips, driversOnDuty,
    fleetUtilization
  };
}