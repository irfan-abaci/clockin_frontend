import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    over_view_details:{
        trip: {
            on_time_trip_count: 0,
            total_active_trip:0
        },
        employee: {
            total_employees_onboard: 0,
            total_active_employee: 0,
          
        },
        violation: {
            violations: 0
        },
        bus: {
            total_bus: 0,
            total_running_bus: 0
        }
    },
    trip_details:[],
    update_trip:0,
    update_violation_count_for_graph:0,
    update_active_inspection:0,
    update_trip_status:0,
    trip_cancelled:0


};

{/* eslint-disable no-nested-ternary */}

const DashboardSlice = createSlice({
    name: 'Dashboard',
    initialState,
    reducers: {
        setDashboardDetails(state, action) {
            state.over_view_details = {...state.over_view_details,...action.payload};
        },
        updateOverviewDetails(state, action) {
            if(action.payload.over_view_type==='bus'){
                state.over_view_details.bus = {...state.over_view_details.bus,
                                                total_bus:action.payload.method==="Created"?
                                                state.over_view_details.bus.total_bus+1:
                                                state.over_view_details.bus.total_bus-1
                                              };
            }else if(action.payload.over_view_type==='employee'){
                state.over_view_details.employee = {...state.over_view_details.employee,
                                                     total_active_employee:action.payload.method==="Created"?
                                                     state.over_view_details.employee.total_active_employee+1:
                                                     state.over_view_details.employee.total_active_employee-1
                                                   };
   
            }
        },

        setInitialDashboardDetails(state) {
            state.over_view_details ={
                trip: {
                    on_time_trip_count: 0,
                    total_active_trip:0
                },
                employee: {
                    total_employees_onboard: 0,
                    total_active_employee: 0,
                  
                },
                violation: {
                    violations: 0
                },
                bus: {
                    total_bus: 0,
                    total_running_bus: 0
                }
            };
        },
        
        setTripDetails(state, action) {

            const updatedTripDetails = action.payload.map((route) => {
                const RouteEmployeeCount= route.buses.reduce(
                  (sum , bus ) => sum + bus.employee_in_bus,
                  0
                );
                const TotalRouteEmployeeCount = route.buses.reduce(
                    (sum , bus ) => sum + bus.capacity,
                  0
                );
            
                const RouteBusCount = route.buses.reduce(
                    (count, bus) => (bus.is_running ? count + 1 : count),
                    0
                  );
                  const TotalRouteBusCount = route.buses.length;
                  
            
                return {
                  ...route,
                  route_employee_count:RouteEmployeeCount,
                  total_route_employee_count:TotalRouteEmployeeCount,
                  route_bus_count:RouteBusCount,
                  total_route_bus_count:TotalRouteBusCount,
                };
              });


              state.trip_details =updatedTripDetails
        },
        updateEmployeeCountInTripDetails(state, action) {

                state.over_view_details={...state.over_view_details,
                    employee: {
                        total_employees_onboard:action.payload.employee_status?state.over_view_details.employee.total_employees_onboard+1:state.over_view_details.employee.total_employees_onboard-1 ,
                        total_active_employee:state.over_view_details.employee.total_active_employee
                    },
                }
          
            state.trip_details = state.trip_details.map((route) =>  
                route.route_id === action.payload.route_id
                    ? {
                          ...route,
                          
                          buses: route.buses.map((bus) =>
                              bus.bus_id === action.payload.bus_id
                                  ? { ...bus, employee_in_bus: action.payload.employee_in_bus }
                                  : bus
                          ),

                          route_employee_count: route.buses.reduce(
                            (sum, bus) =>
                                bus.bus_id === action.payload.bus_id
                                    ? sum + action.payload.employee_in_bus
                                    : sum + bus.employee_in_bus,
                            0
                        ),
                      }
                    : route
            );
        },

        updateBusCountInTripDetails(state, action) {
            state.update_trip +=1 

            state.over_view_details={...state.over_view_details,
                bus: {
                    total_running_bus: action.payload.is_running?state.over_view_details.bus.total_running_bus+1:state.over_view_details.bus.total_running_bus-1 ,
                    total_bus: state.over_view_details.bus.total_bus

                },
                employee: {
                    total_employees_onboard:state.over_view_details.employee.total_employees_onboard-action.payload.employee_dropped_off,
                    total_active_employee:state.over_view_details.employee.total_active_employee
                },
                trip: {
                    on_time_trip_count:
                    action.payload.trip_status==="On time"?
                    state.over_view_details.trip.on_time_trip_count+1 :(action.payload.trip_status==="Completed" && action.payload.old_status==="On time")? state.over_view_details.trip.on_time_trip_count-1: state.over_view_details.trip.on_time_trip_count,
                    total_active_trip:action.payload.trip_status==="Completed"?state.over_view_details.trip.total_active_trip-1:state.over_view_details.trip.total_active_trip+1
                },
            }
      
          state.trip_details = state.trip_details.map((route) =>  
            route.route_id === action.payload.route_id
                ? {
                      ...route,
                      buses: route.buses.map((bus) =>
                          bus.bus_id === action.payload.bus_id
                      ? { ...bus, employee_in_bus: action.payload.employee_in_bus,is_running:action.payload.is_running ,status:action.payload.trip_status}
                      : bus
                      ),

                     route_employee_count: route.buses.reduce(
                            (sum, bus) =>
                                bus.bus_id === action.payload.bus_id
                                    ? sum + action.payload.employee_in_bus
                                    : sum + bus.employee_in_bus,
                            0
                        ),

                     route_bus_count : route.buses.reduce(
                            (count, bus) =>   bus.bus_id === action.payload.bus_id?(action.payload.is_running ? count + 1 : count):(bus.is_running ? count + 1 : count),
                            0
                          )
                  }
                : route
        );
       },
  
       updateTripDetails(state, action) {

        state.update_trip +=1 
        const busStatus=['On time','Delayed']

        state.over_view_details={...state.over_view_details,
            bus: {
                 ...state.over_view_details.bus,
                 total_running_bus:busStatus.includes (action.payload.buses[0].status)?
                    state.over_view_details.bus.total_running_bus+1:
                    state.over_view_details.bus.total_running_bus,

            },
            trip: {...state.over_view_details.trip,
                   on_time_trip_count:action.payload.buses[0].status==='On time'?
                    state.over_view_details.trip.on_time_trip_count+1:
                    state.over_view_details.trip.on_time_trip_count,
                 
            },
           
        }
  
        if( state.trip_details.find((item)=>item.route_id===action.payload.route_id)){
            state.trip_details = state.trip_details.map((route) =>  
                route.route_id === action.payload.route_id
                    ? {
                          ...route,
                          buses:[...route.buses,action.payload.buses[0]],
                         route_employee_count:route.route_employee_count+action.payload.buses[0].employee_in_bus,
                         route_bus_count :action.payload.buses[0].is_running?route.route_bus_count+1:route.route_bus_count,
                         total_route_employee_count:route.total_route_employee_count+action.payload.buses[0].capacity,
                         total_route_bus_count:route.total_route_bus_count+1,
                      }
                    : route
               );

        }else{

            const TripDetails=[action.payload,...state.trip_details]
            const updatedTripDetails = TripDetails.map((route) => {
                const RouteEmployeeCount= route.buses.reduce(
                  (sum , bus ) => sum + bus.employee_in_bus,
                  0
                );
                const TotalRouteEmployeeCount = route.buses.reduce(
                    (sum , bus ) => sum + bus.capacity,
                  0
                );
            
                const RouteBusCount = route.buses.reduce(
                    (count, bus) => (bus.is_running ? count + 1 : count),
                    0
                  );
                  const TotalRouteBusCount = route.buses.length;
                  
            
                return {
                  ...route,
                  route_employee_count:RouteEmployeeCount,
                  total_route_employee_count:TotalRouteEmployeeCount,
                  route_bus_count:RouteBusCount,
                  total_route_bus_count:TotalRouteBusCount,
                };
              });

              state.trip_details =updatedTripDetails

         
        }
    
    },

    updateViolationReportCount(state) {
        state.update_violation_count_for_graph+=1
        state.over_view_details={...state.over_view_details,violation:{violations:state.over_view_details.violation.violations+1}}
    },
    updateActiveInspection(state) {
        state.update_active_inspection+=1
    },
    updateTripStatus(state) {
        state.update_trip_status+=1
    },
    tripCancelled(state) {
        state.trip_cancelled+=1
    }  
    },


   
    
});

export const {    
                setDashboardDetails,
                setTripDetails ,
                updateEmployeeCountInTripDetails,
                updateBusCountInTripDetails,
                updateViolationReportCount,
                updateActiveInspection,
                setInitialDashboardDetails,
                updateTripStatus,
                updateTripDetails,
                updateOverviewDetails,
                tripCancelled
                } = DashboardSlice.actions;
export default DashboardSlice.reducer;
{/* eslint-enable no-nested-ternary */ }
