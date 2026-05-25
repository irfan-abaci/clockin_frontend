import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    vehicles:null,
    vehicle_details:null
};

const VehicleSlice = createSlice({
    name: 'vehicles',
    initialState,
    reducers: {
        setVehicles(state, action) {
            state.vehicles = action.payload;
        },
        setVehicleDetails(state, action) {
            state.vehicle_details = action.payload;
        },
        addNewVehicles(state, action) {
            state.vehicles = [...state.vehicles, action.payload];
          },
    },
});

export const { setVehicles,addNewVehicles,setVehicleDetails  } = VehicleSlice.actions;
export default VehicleSlice.reducer;
