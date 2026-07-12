async function logFuel(data){
    return FuelLog.create(data);
}

async function logExpense(data){
    return Expense.create(data);
}

async function getOperationalCost(vehicleId) {
    const fuelTotal = await fuelLog.sumCostByVehicle(vehicleId);
    const maintenanceTotal = await closeMaintenanceLog.sumCostByVehicle(vehicleId);
    const expenseTotal = await Expense.sumAmountByVehicle(vehicleId);
    return fuelTotal + maintenanceTotal + expenseTotal;
}
