import { useContext } from "react";
import AuthContext from "../contexts/authContext";

const permissionObject = {
	is_super_user:['super_admin'],
	tenant_management: ['super_admin','admin'],
	view_tenant_details: ['super_admin','admin_assistant','admin'],
	vehicle_management: ['super_admin','admin'],
	business_space_management: ['super_admin','admin'],
	blacklist_management: ['super_admin','admin'],
	gate_management: ['super_admin','admin'],
	exit_request_management: ['super_admin','admin'],
    manage_user: ['super_admin','admin'],
	manage_user_group: ['super_admin', 'admin'],
	manage_schedule: ['super_admin', 'admin'],
	manage_shift: ['super_admin', 'admin'],
	view_user_details: ['super_admin','admin_assistant','admin'],
    manage_general_settings: ['super_admin','admin'],
	manage_building: ['super_admin','admin'],
	manage_controller: ['super_admin','admin'],

	company_admin: ['admin'],
	overnight_request_management: ['super_admin','security'],
	view_tenant_filter: ['super_admin','admin_assistant','security'],
};

const usePermissionHook = (page) => {
	const {userData}=useContext(AuthContext)
	const allowedRoles = permissionObject[page] || [];
	return allowedRoles.includes(userData?.user_type);
};

export default usePermissionHook;
