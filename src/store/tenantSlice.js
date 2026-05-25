import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	tenant_details: null,
	tenantPoints: null,
	tenant_details_trip: null,
};

const TenantSlice = createSlice({
	name: 'Tenant',
	initialState,
	reducers: {
		setTenantDetails(state, action) {
			state.tenant_details = action.payload;
		},
		// setTenantDetailsOfTrip(state, action) {
		// 	state.tenant_details_trip = action.payload;
		// },
		// updateTenantDetailsOfTrip(state, action) {
		// 	state.tenant_details_trip = {...state.tenant_details_trip,...action.payload}
		// },
		// setTenantPointsList(state, action) {
		// 	state.tenantPoints = action.payload;
		// },
	},
});

export const { setTenantDetails,  } = TenantSlice.actions;
export default TenantSlice.reducer;
