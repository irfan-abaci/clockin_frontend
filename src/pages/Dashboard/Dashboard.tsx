import React, { useEffect, useState } from 'react';
import { useTour } from '@reactour/tour';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/Page/Page';
import SubHeader from '../../layout/SubHeader/SubHeader';
import { CardTitle } from '../../components/bootstrap/Card';
import UnattendedVehicleList from './UnattendedVehicleList';
import VehicleActivity from './VehicleActivity';
import ParkingOccupancyChart from './ParkingOccupancyChart';
import { authAxios } from '../../axiosInstance';
import AbaciLoader from '../../components/AbaciLoader/AbaciLoader';
import usePermissionHook from '../../hooks/userPermissionHook';

const Dashboard = () => {
	const isCompanyAdmin = usePermissionHook('company_admin');
	const { currentStep, setCurrentStep } = useTour();
	const [graphData, setGraphData] = useState({
		parking: {
			Tenant: [0, 0],
			Administration: [0, 0]
		}
	})

	const [isLoading, setIsLoading] = useState(false)
	useEffect(() => {
		if (currentStep === 3) setCurrentStep(4);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentStep]);


	// useEffect(() => {
	// 	const url = '/api/parking_status'
	// 	authAxios.get(url)
	// 		.then((res) => {
	// 			setGraphData(res.data)
	// 			setIsLoading(false)

	// 		})
	// 		.catch((err) => {
	// 			// showErrorNotification(err)
	// 			setIsLoading(false)

	// 		})
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [])

	if (isLoading) {
		return <AbaciLoader />
	}
	return (
		<PageWrapper title='Dashboard'>
			<SubHeader>
				<CardTitle tag='div' className='h5'>
					Dashboard
				</CardTitle>
			</SubHeader>
			<Page container='fluid' >
				{/* <div className='row'>
					{isCompanyAdmin ?
						<div className='col-lg-4 col-sm-12'>
							<ParkingOccupancyChart
								colors={['#152B52', '#BC922E']}
								title={"Company Parking Occupancy"}
								graphData={graphData.parking.Tenant}
								isLoading={isLoading}
							/>
						</div> :
						<>
							<div className='col-lg-4 col-sm-12'>
								<ParkingOccupancyChart
									colors={['#BC922E', '#DBC389']}
									title={"Tenant Parking Occupancy"}
									graphData={graphData.parking.Tenant}
									isLoading={isLoading}
								/>
							</div>
							<div className='col-lg-4 col-sm-12'>
								<ParkingOccupancyChart
									colors={['#152B52', '#8A95A8']}
									title={"Hilite Parking Occupancy"}
									graphData={graphData.parking.Administration}
									isLoading={isLoading}
								/>
							</div>
						</>}
					<div className={`${isCompanyAdmin ? 'col-lg-8' : 'col-lg-4'} col-sm-12`}>
						<UnattendedVehicleList />
					</div>

				</div>
				<VehicleActivity /> */}

				<div>hello world</div>
			</Page>
		</PageWrapper>
	);
};

export default Dashboard;
