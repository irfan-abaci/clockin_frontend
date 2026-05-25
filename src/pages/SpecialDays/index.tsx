import React, { useRef, useState } from 'react';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../layout/SubHeader/SubHeader';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import AddButton from '../../components/CustomComponent/Buttons/AddButton';
import SpecialDaysTable from './table';
import AddSpecialDay from './Add';

const Index = () => {
	const tableRef = useRef();
	const urlBackup = useRef();
	const [modalShow, setModalShow] = useState(false);
	const [editId, setEditId] = useState<any>(null);

	const openAddModal = (state: boolean) => {
		if (state) setEditId(null);
		setModalShow(state);
	};

	const editModalToggle = (id: any) => {
		setEditId(id);
		setModalShow(true);
	};

	return (
		<>
			{modalShow && (
				<AddSpecialDay
					isOpen={modalShow}
					setIsOpen={setModalShow}
					tableRef={tableRef}
					title={editId ? 'Edit Special Day' : 'Add Special Day'}
					id={editId}
				/>
			)}
			<PageWrapper title='Special Days'>
				<SubHeader>
					<SubHeaderLeft>
						<CardTitle tag='div' className='h5'>
							Special Days
						</CardTitle>
					</SubHeaderLeft>
					<SubHeaderRight>
						<AddButton modalShow={openAddModal} name='Add Special Day' />
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
						<SpecialDaysTable
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
