import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'reactstrap';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import { authAxios } from '../../axiosInstance';
import Error from '../../helpers/Error';
import Moments from '../../helpers/Moment';
import moment from 'moment';

const VehicleListComponent: FC<any> = ({ VehicleList }) => {
    const navigate = useNavigate();
    const SuperAdmin = ["Plate Number", "Vehicle Type", "Color", "Time", "Days"];
    const vehicleDetailskey = {
        'Plate Number': 'plate_number',
        'Vehicle Type': 'vehicle_type',
        'Color': 'vehicle_color',
        'Time': 'last_activity_time',
        'Days': 'last_activity_time',
    }
    const getElapsedDays = (lastActivityTime: string) => {
        if (!lastActivityTime) return '----';
        const activityMoment = moment.parseZone(lastActivityTime);
        if (!activityMoment.isValid()) return '----';
        const days = moment().diff(activityMoment, 'days');
        return `${Math.max(days, 0)} day${Math.max(days, 0) === 1 ? '' : 's'}`;
    };


    const allKeys = Array.from(
        new Set([...SuperAdmin])
    );

    return (
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Arial, sans-serif" }}>
            <tbody>
                {VehicleList.map((data: any, index: number) => (
                    <tr key={index}>
                        {allKeys.map((key) => (
                            <td key={key} style={{
                                backgroundColor: index % 2 === 0 ? "#F9F9F9" : "#FFFFFF",
                                padding: "10px",
                                color: "#787878",
                                fontSize: "15px",
                                cursor: "pointer",
                            }}
                                // onClick={() => navigate(`/vehicles-details/${data.id}`)}
                            >
                                <div style={{ fontSize: "12px" }}>
                                    {key}
                                </div>
                                <div style={{ fontWeight: 600, fontSize: "13px" }}>
                                    {key === "Time"
                                        ? Moments(data.last_activity_time, "datetime")
                                        : key === "Days"
                                            ? getElapsedDays(data.last_activity_time)
                                            : data[vehicleDetailskey[key]] || "----"}
                                </div>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const UnattendedVehicleList = () => {

    const dispatch = useDispatch();
    const listRef = useRef<HTMLDivElement>(null);
    const [vehicleList, setVehicleList] = useState<any[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [limit] = useState(5);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isFetching, setIsFetching] = useState(false);



    const fetchVehicles = useCallback(async () => {
        if (!hasNextPage || isFetching) return;
        setIsFetching(true);

        try {
            const response = await authAxios.get(`/api/vehicles/violation_vehicles?limit=${limit}&offset=${pageCount * limit}`);
            const newVehicles = response.data.results;
            setVehicleList((prev) => [...prev, ...newVehicles]);
            setPageCount((prev) => prev + 1);
            setHasNextPage(newVehicles.length === limit);
        } catch (error) {
            const errorMsg = Error(error);
            // showNotification("Error", errorMsg, "danger");
        } finally {
            setIsFetching(false);
        }
    }, [hasNextPage, isFetching, limit, pageCount]);


    const handleScroll = () => {
        if (listRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listRef.current;
            if (scrollTop + clientHeight >= scrollHeight - 20) {
                fetchVehicles();
            }
        }
    };


    useEffect(() => {
        fetchVehicles();
    }, []);

    useEffect(() => {
        if (listRef.current) {
            const { scrollHeight, clientHeight } = listRef.current;
            // If content is not scrollable yet, fetch more
            if (scrollHeight <= clientHeight && hasNextPage) {
                fetchVehicles();
            }
        }
    }, [vehicleList]); // runs whenever vehicle list changes

    return (
        <Card stretch className='prevent-userselect'>
            <CardHeader>
                <CardLabel>
                    <CardTitle tag='div' className='h3'>
                        Unattended Vehicle List
                    </CardTitle>
                </CardLabel>
            </CardHeader>
            <CardBody>
                
                {vehicleList?.length === 0 ? (
                    <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                        <p className='position_centered' style={{ marginTop: "-20px" }}>No vehicle found !</p>
                    </div>
                ) : (
                    <div
                        ref={listRef}
                        style={{ height: '300px', overflowY: 'scroll', overflowX: 'hidden' }}
                        className="hide-scrollbar"
                        onScroll={handleScroll}
                    >
                        <VehicleListComponent VehicleList={vehicleList} />
                        {isFetching && (
                            <div style={{ display: 'flex', justifyContent: 'center' }} className="loader">
                                <Spinner animation="grow" size="sm" />
                            </div>
                        )}
                    </div>
                )}
            </CardBody>
        </Card>
    );
};

export default UnattendedVehicleList;
