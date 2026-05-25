import React, { useRef, useState } from 'react';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../layout/SubHeader/SubHeader';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import AddButton from '../../components/CustomComponent/Buttons/AddButton';
import ScheduleTableComponent from './ScheduleTableComponent';
import ScheduleForm from './ScheduleForm';

const Index = () => {
	const tableRef = useRef();
	const urlBackup = useRef();
	const [scheduleModalShow, setScheduleModalShow] = useState(false);
	const [editId, setEditId] = useState<any>(null);

	const openAddModal = (state: boolean) => {
		if (state) setEditId(null);
		setScheduleModalShow(state);
	};

	const editModalToggle = (id: any) => {
		setEditId(id);
		setScheduleModalShow(true);
	};

	return (
		<>
			{scheduleModalShow && (
				<ScheduleForm
					isOpen={scheduleModalShow}
					setIsOpen={setScheduleModalShow}
					tableRef={tableRef}
					title={editId ? 'Edit Schedule' : 'Add Schedule'}
					id={editId}
				/>
			)}
			<PageWrapper title='Schedule'>
				<SubHeader>
					<SubHeaderLeft>
						<CardTitle tag='div' className='h5'>
							Schedule
						</CardTitle>
					</SubHeaderLeft>
					<SubHeaderRight>
						<AddButton modalShow={openAddModal} name='Add Schedule' />
					</SubHeaderRight>
				</SubHeader>
				<Card stretch>
					<CardHeader borderSize={1}>
						<CardLabel icon='' iconColor='info'>
							<CardTitle tag='div' className='h5'>
								<p />
							</CardTitle>
						</CardLabel>
					</CardHeader>
					<CardBody className='table-responsive'>
						<p />
						<ScheduleTableComponent
							tableRef={tableRef}
							urlBackup={urlBackup}
							editModalToggle={editModalToggle}
						/>
					</CardBody>
				</Card>
			</PageWrapper>
		</>
	);
};

export default Index;
