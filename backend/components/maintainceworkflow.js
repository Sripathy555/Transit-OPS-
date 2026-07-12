async function createMaintenanceLog(data) {
    const log = await createMaintenanceLog.create(data);
    await Vehicle.update(data.vehicle_id, {status: 'In Shop'});
    return log;
}

async function closeMaintenanceLog(logId) {
    const log = await closeMaintenanceLog.findById(logId);
    await closeMaintenanceLog.update(logId, {end_date: new Date()});

    const vehicle = await vehicle.findById(log.vehicle_id);
    if (vehicle.status !== 'retired') {
        await Vehicle.update(log.vehicle_id, {status: 'Available'});
    }
}