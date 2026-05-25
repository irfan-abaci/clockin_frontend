import React, { useContext, useRef, useState } from 'react';
// import Swal from 'sweetalert2';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
} from '../../layout/SubHeader/SubHeader';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
// import AddUsers from './AddUsers';
// import UserManagementTableComponent from '../../components/MasterComponents/Usermanagement/UserMangementTableComponent';
// import ExportButton from '../../components/CustomComponent/Buttons/ExportButton';
import BulkUpload from '../../components/MasterComponents/BulkUpload/BulkUploadOffCanvas';
// import ButtonWithPopover from '../../components/CustomComponent/Buttons/ButtonWithPopover';
import { useNavigate } from 'react-router-dom';
import AddButton from '../../components/CustomComponent/Buttons/AddButton';
import usePermissionHook from '../../hooks/userPermissionHook';
import AuthContext from '../../contexts/authContext';
import ButtonFiltter from '../../components/CustomComponent/Filters/ButtonFiltter';
import SiteManagementTableComponent from './SiteManagementTableComponent';
import AddSite from './AddSite';
import ButtonWithPopover from '../../components/CustomComponent/Buttons/ButtonWithPopover';

const Index = () => {

	const tableRef = useRef();
	const urlBackup = useRef();
	const navigate = useNavigate();
	const [addModalShow, setAddModalShow] = useState(false);
	const [editId, setEditId] = useState<any>(null);
	const [addBulkModalShow, setAddBulkModalShow] = useState(false);
	const canManageUser = usePermissionHook('manage_user');
	const {userData}=useContext(AuthContext)
	const tenant = userData?.active_relations?.[0]?.tenant_details || null;
	const [activeTab, setActiveTab] = useState('All')
	const FilterStatus = ['All', tenant ? tenant?.tenant_name : '']
	const canSeeTenantFilter=usePermissionHook('view_tenant_filter');	
	const editModalToggle = (id: any) => {
		setEditId(id);
		setAddModalShow(true);
	}

	const openAddModal = (state: boolean) => {
		if (state) setEditId(null);
		setAddModalShow(state);
	};


	return (
		<>
			{addModalShow && (
				<AddSite
					isOpen={addModalShow}
					setIsOpen={setAddModalShow}
					tableRef={tableRef}
					title={editId ? 'Edit Site' : 'Add Site'}
					id={editId}
				/>
			)}
			{/* {editModalShow && (
				<UserForm
					isOpen={editModalShow}
					setIsOpen={setEditModalShow}
					tableRef={tableRef}
					id={dataToBeEdited}
					title='Edit User Details'
				/>
			)} */}
			{addBulkModalShow && (
				<BulkUpload
					isOpen={addBulkModalShow}
					setIsOpen={setAddBulkModalShow}
					tableRef={tableRef}
					title='Bulk Upload'
					api='api/users/user_csv_import_and_sample_csv_download?user_type=[Admin,User]'
					fileName='Users.csv'

				/>
			)}

			<PageWrapper title='Site Management'>
				<SubHeader>
					<SubHeaderLeft>
						<CardTitle tag='div' className='h5'>
							Site Management
						</CardTitle>

					</SubHeaderLeft>
					<SubHeaderRight>
						{/* <ButtonWithPopover 
						  addModalShow={setAddModalShow}
						  addBulkModalShow={setAddBulkModalShow}
						  buttonName='Add Site'
						/> */}
						<AddButton modalShow={openAddModal} name="Add Site" />
					</SubHeaderRight>
				</SubHeader>
				<Card stretch>
					<CardHeader borderSize={1}>
						<CardLabel icon='' iconColor='info'>
							<CardTitle tag='div' className='h5' ><p /></CardTitle>
						</CardLabel>
						{/* <CardActions>
						  <ExportButton url={urlBackup} hiddenColumnsKey='' name='Users' />
						</CardActions> */}
					</CardHeader>
					<CardBody className='table-responsive'><p />
					{tenant && canSeeTenantFilter && <ButtonFiltter
							FilterStatus={FilterStatus}
							activeTab={activeTab}
							setActiveTab={setActiveTab}
							styles={{ top: '100px' }}
						/>}
						<SiteManagementTableComponent
							tableRef={tableRef}
							editModalToggle={editModalToggle}
							urlBackup={urlBackup}
							//@ts-ignore
							tenant={tenant}
							activeTab={activeTab}
						/>
					</CardBody>
				</Card>
			</PageWrapper>
		</>
	);
};

export default Index;
