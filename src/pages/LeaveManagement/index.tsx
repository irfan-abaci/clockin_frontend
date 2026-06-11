import React from 'react';
import { Navigate } from 'react-router-dom';
import { allRoutesObject } from '../../routes/RoutesMenu';

/** Legacy route — redirects to Leave Requests page. */
const LeaveManagementRedirect = () => (
	<Navigate to={allRoutesObject.LeaveRequests.path} replace />
);

export default LeaveManagementRedirect;
