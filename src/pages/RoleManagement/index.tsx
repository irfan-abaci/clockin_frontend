import React, { useRef, useState } from 'react';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../layout/SubHeader/SubHeader';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import AddButton from '../../components/CustomComponent/Buttons/AddButton';
import RoleTableComponent from './Table';
import RoleForm from './RoleForm';

const RoleManagement = () => {
	const tableRef = useRef(null);
	const urlBackup = useRef('');
	const [formOpen, setFormOpen] = useState(false);
	const [editId, setEditId] = useState<any>(null);

	const openAddModal = (state: boolean) => {
		if (state) setEditId(null);
		setFormOpen(state);
	};

	const editModalToggle = (id: any) => {
		setEditId(id);
		setFormOpen(true);
	};

	return (
		<>
			{formOpen && (
				<RoleForm
					key={editId ?? 'add'}
					isOpen={formOpen}
					setIsOpen={setFormOpen}
					tableRef={tableRef}
					title={editId ? 'Edit Role' : 'Add Role'}
					id={editId}
				/>
			)}
			<PageWrapper title='Role Management'>
				<SubHeader>
					<SubHeaderLeft>
						<CardTitle tag='div' className='h5'>
							Roles
						</CardTitle>
					</SubHeaderLeft>
					<SubHeaderRight>
						<AddButton modalShow={openAddModal} name='Add Role' />
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
						<RoleTableComponent
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

export default RoleManagement;
