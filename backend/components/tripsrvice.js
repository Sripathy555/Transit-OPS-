async function dispatchTrip(tripId){
    const trip = await Trip.findById(tripId);
    if (trip.status !== 'Draft') throw new Error ('Only Draft trips can be dispatched');

    const vehicle = await Vehicle.findById(trip.vehicle_id);
    const driver =  await Driver.findById(trip.driver_id);
    if (vehicles.status !== 'Available') throw new Error ('Vehicle not available');
    if (driver.status !== 'Available') throw new Error ('Driver not available');

    await Vehicle.update(vehicle.id, {status : 'On Trip'});
    await Driver.update(driver.id, {status : 'On Trip'});
     await Trip.update(tripId, { status: 'Dispatched', dispatched_at: new Date() });
}

async function completeTrip(tripId, actualDistance) {
  const trip = await Trip.findById(tripId);
  if (trip.status !== 'Dispatched') throw new Error('Only Dispatched trips can be completed');

  await Vehicle.update(trip.vehicle_id, { status: 'Available' });
  await Driver.update(trip.driver_id, { status: 'Available' });
  await Vehicle.incrementOdometer(trip.vehicle_id, actualDistance);
  await Trip.update(tripId, { status: 'Completed', completed_at: new Date() });
}

async function cancelTrip(tripId) {
  const trip = await Trip.findById(tripId);
  if (!['Draft', 'Dispatched'].includes(trip.status)) {
    throw new Error('Only Draft or Dispatched trips can be cancelled');
  }
  if (trip.status === 'Dispatched') {
    await Vehicle.update(trip.vehicle_id, { status: 'Available' });
    await Driver.update(trip.driver_id, { status: 'Available' });
  }
  await Trip.update(tripId, { status: 'Cancelled' });
}
