import React, { useRef, useState } from 'react';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../layout/SubHeader/SubHeader';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import AddButton from '../../components/CustomComponent/Buttons/AddButton';
import ShiftTableComponent from './ShiftTableComponent';
import ShiftForm from './ShiftForm';

const Index = () => {
	const tableRef = useRef();
	const urlBackup = useRef();
	const [shiftModalShow, setShiftModalShow] = useState(false);
	const [editId, setEditId] = useState<any>(null);

	const openAddModal = (state: boolean) => {
		if (state) setEditId(null);
		setShiftModalShow(state);
	};

	const editModalToggle = (id: any) => {
		setEditId(id);
		setShiftModalShow(true);
	};

	return (
		<>
			{shiftModalShow && (
				<ShiftForm
					isOpen={shiftModalShow}
					setIsOpen={setShiftModalShow}
					tableRef={tableRef}
					title={editId ? 'Edit Shift' : 'Add Shift'}
					id={editId}
				/>
			)}
			<PageWrapper title='Shift'>
				<SubHeader>
					<SubHeaderLeft>
						<CardTitle tag='div' className='h5'>
							Shift
						</CardTitle>
					</SubHeaderLeft>
					<SubHeaderRight>
						<AddButton modalShow={openAddModal} name='Add Shift' />
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
						<ShiftTableComponent
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
