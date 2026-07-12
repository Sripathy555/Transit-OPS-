async function createTrip(data){
    const vehicle = await Vehicle.findById(data.vehicle_id);
    if (vehicle.status !== 'Available') throw new Error('Vehicle not available');
    if (data.cargo_weight > vehicle.max_load_capacity) {
        throw new Error('Cargo weight exceeds vehicle capacity');
    }
    return createTrip.create({...data,status: 'Draft'});
}