import { useState, useRef, useEffect, useContext } from 'react';
import { io } from "socket.io-client";
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import AuthContext from '../contexts/authContext';
import { wsUrl } from '../helpers/baseURL';
import { tripCancelled,
	    updateActiveInspection, 
		updateBusCountInTripDetails,
	    updateEmployeeCountInTripDetails,
	    updateOverviewDetails,
	    updateTripDetails, 
		updateViolationReportCount
	   } from '../store/dashboard';

const WebsocketProvider = ({ children }) => {
	const { user } = useContext(AuthContext);
	const dispatch = useDispatch();
	const clientRef = useRef(null);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (user) {
			const token = Cookies.get("socketIOToken");
			const room = 'message'
			const url = `${wsUrl}/socket_connections`;
			const socket = io(url, {
				query: { room }, // Add room parameter to the connection
				extraHeaders: {
					token
				},
			});
			clientRef.current = socket

			const handleSocketMessages = (message) => {
				try {
					const parsedMessage = typeof message === 'string' ? JSON.parse(message) : message;
					switch (parsedMessage?.type) {
						case "employee_card_tap_dashboard":
							dispatch(updateEmployeeCountInTripDetails(parsedMessage?.data))
							break;
						case "driver_card_tap_dashboard":
							dispatch(updateBusCountInTripDetails(parsedMessage?.data))
							break;
						case "trip_created":
								dispatch(updateTripDetails(parsedMessage?.data))
								break;
						case "trip_cancelled":
								dispatch(tripCancelled())
								break;	
						case "instance_created":
								dispatch(updateOverviewDetails({over_view_type:parsedMessage?.data,method:'Created'}))
								break;
						case "instance_activated":
								dispatch(updateOverviewDetails({over_view_type:"employee",method:'Created'}))
								break;
						case "instance_disabled":
								dispatch(updateOverviewDetails({over_view_type:"employee",method:'Deleted'}))
								break;
						case "instance_deleted":
								dispatch(updateOverviewDetails({over_view_type:parsedMessage?.data,method:'Deleted'}))
								break;		
						case "violation_reported":
							dispatch(updateViolationReportCount())
							break;
						case "inspection":
								dispatch(updateActiveInspection())
								break;
						default:
							console.warn('Unhandled message type:', parsedMessage.type);
					}

				} catch (err) {
					console.error('Error handling socket message:', err);
				}
			};

			// Handle connection events
			socket.on('connect', () => {
				setIsOpen(true);
			});

			socket.on('disconnect', () => {
				setIsOpen(false);
			});

			socket.on(room, (message) => {
				handleSocketMessages(message);
			});

			// Clean up on unmount
			return () => {
				//   setWebsocketState('cleanup');
				socket.disconnect();
			};
		}
		console.log(isOpen)
		  // Explicitly return undefined when `user` is falsy
		  return undefined;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);


	return children;
};

export default WebsocketProvider;