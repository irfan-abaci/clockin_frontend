import React, { lazy } from 'react';
import {
	allRoutesObject,
	pagesNotInSideBar,
} from './RoutesMenu';

const MAINROUTE={
	Dashboard: lazy(() => import('../pages/Dashboard/Dashboard')),
	Profile: lazy(() => import('../pages/Profile/Index')),
	Users: lazy(() => import('../pages/UserManagement/index')),
	site: lazy(() => import('../pages/Site/index')),
	SpecialPeriod: lazy(() => import('../pages/SpecialDays/index')),
	UserGroups: lazy(() => import('../pages/UserGroups/index')),
	GroupDetail: lazy(() => import('../pages/UserGroups/GroupDetailPage')),
	Schedule: lazy(() => import('../pages/Schedule/index')),
	ScheduleDetail: lazy(() => import('../pages/Schedule/ScheduleDetailPage')),
	Shift: lazy(() => import('../pages/Shift/index')),
	ScheduleComponentDemo: lazy(() => import('../pages/ScheduleComponentDemo/index')),
	UserDetails: lazy(() => import('../pages/UserManagement/UserManagementPage')),
	LeaveManagement: lazy(() => import('../pages/LeaveManagement/index')),
	Attendance: lazy(() => import('../pages/Attendance/index')),
	UserSchedule: lazy(() => import('../pages/UserSchedule')),
	EventLog: lazy(() => import('../pages/EventLog/index')),
	RoleManagement: lazy(() => import('../pages/RoleManagement/index')),
}
interface CustomRouteConfig {
	path: string;
	element: React.ReactNode;
	allowedTo?: string[]; // Custom property for role-based access control
}

const RouteConfig: CustomRouteConfig[] = [
	{
		path: allRoutesObject.dashboard.path,
		element: <MAINROUTE.Dashboard />,
		allowedTo:  ['Admin','HR']
	},
	{
		path: '/dashboard',
		element: <MAINROUTE.Dashboard />,
		allowedTo: ['user', 'Admin','HR'],
	},
	{
		path: pagesNotInSideBar.Profile.path,
		element: <MAINROUTE.Profile/>,
		allowedTo:   ['Admin','HR']
	},
	{
		path: allRoutesObject.UserManagement.path,
		element: <MAINROUTE.Users/>,
		allowedTo:   ['Admin','HR']
	},
	{
		path: allRoutesObject.site.path,
		element: <MAINROUTE.site/>,
		allowedTo:   ['Admin','HR']
	},
	{
		path: pagesNotInSideBar.GroupTemplateDetail.path,
		element: <MAINROUTE.GroupDetail />,
		allowedTo: ['Admin','HR'],
	},
	{
		path: allRoutesObject.UserGroups.path,
		element: <MAINROUTE.UserGroups/>,
		allowedTo:   ['Admin','HR']
	},
	{
		path: pagesNotInSideBar.ScheduleTemplateDetail.path,
		element: <MAINROUTE.ScheduleDetail />,
		allowedTo: ['Admin','HR'],
	},
	{
		path: allRoutesObject.Schedule.path,
		element: <MAINROUTE.Schedule />,
		allowedTo: ['Admin','HR'],
	},
	{
		path: allRoutesObject.Shift.path,
		element: <MAINROUTE.Shift />,
		allowedTo: ['Admin','HR'],
	},
	{
		path: allRoutesObject.ScheduleComponentDemo.path,
		element: <MAINROUTE.ScheduleComponentDemo />,
		allowedTo: ['Admin','HR'],
	},
	{
		path: pagesNotInSideBar.UsertDetails.path,
		element: <MAINROUTE.UserDetails />,
		allowedTo: ['Admin','HR'],
	},
	{
		path: allRoutesObject.LeaveManagement.path,
		element: <MAINROUTE.LeaveManagement />,
		allowedTo: ['Admin','HR','user'],
	},
	{
		path: allRoutesObject.Attendance.path,
		element: <MAINROUTE.Attendance />,
		allowedTo: ['Admin','HR','user'],
	},
	{
		path: allRoutesObject.UserSchedule.path,
		element: <MAINROUTE.UserSchedule />,
		allowedTo: ['Admin', 'HR','user'],
	},
	{
		path: allRoutesObject.SpecialPeriod.path,
		element: <MAINROUTE.SpecialPeriod />,
		allowedTo: ['Admin','HR'],
	},
	{
		path: allRoutesObject.EventLog.path,
		element: <MAINROUTE.EventLog />,
		allowedTo: ['Admin','HR'],
	},
	{
		path: allRoutesObject.RoleManagement.path,
		element: <MAINROUTE.RoleManagement />,
		allowedTo: ['Admin', 'HR'],
	},
	
]






export default RouteConfig;
