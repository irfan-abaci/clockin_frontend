export const allRoutesObject = {
	dashboard: {
		id: 'dashboard',
		path: '/',
	},

	UserManagement: {
		id: 'CompanyUsers',
		path: '/users',
	},
	site:{
		id: 'site',
		path: '/sites',
	
	},
	SpecialPeriod: {
		id: 'SpecialPeriod',
		path: '/special-period',
	},
	UserGroups: {
		id: 'UserGroups',
		path: '/groups',
	},
	Schedule: {
		id: 'Schedule',
		path: '/schedule',
	},
	Shift: {
		id: 'Shift',
		path: '/shift',
	},
	RoleManagement: {
		id: 'RoleManagement',
		path: '/roles',
	},
	ScheduleComponentDemo: {
		id: 'ScheduleComponentDemo',
		path: '/schedule-component-demo',
	},
	LeaveManagement: {
		id: 'LeaveManagement',
		path: '/leave-management',
	},
	Attendance: {
		id: 'Attendance',
		path: '/attendance',
	},
	Settings: {
		id: 'Settings',
	 	path: 'settings',
    	subMenu: {
			GeneralSettings: {
				id: 'GeneralSettings',
				path: 'settings/general-settings',
			
		},
		Buildings: {
			id: 'Buildings',
			path: 'settings/buildings',
		},
		Gates: {
			id: 'Gates',
			path: 'settings/gates',
		},
		Controller: {
			id: 'Controller',
			path: 'settings/controller',
			

		},
		EditLog: {
			id: 'EditLog',
			path: 'settings/editlog',
		
	}
	
	}},
	UserSchedule: {
		id: 'UserSchedule',
		text: 'Schedule',
		path: '/user/schedule',
		icon: 'PendingActions',
	},
	EventLog: {
		id: 'EventLog',
		path: '/event-log',
		icon: 'Description',
	},

}






export const CompanyAdminRoutes = {
	
	dashboard: {
		id: 'dashboard',
		text: 'Dashboard',
		path: '/',
		icon: 'Dashboard',
		subMenu: null,
	},
	site:{
		id: 'site',
		text: 'Site',
		icon: 'Apartment',
		path: '/sites',
	},
	userManagment: {
		id: 'CompanyUsers',
		text: 'Users',
		path: '/users',
		icon: 'Person',
	},
	UserGroups: {
		id: 'UserGroups',
		text: 'Groups',
		path: '/groups',
		icon: 'Group',
	},
	Schedule: {
		id: 'Schedule',
		text: 'Schedule',
		path: '/schedule',
		icon: 'PendingActions',
	},
	SpecialPeriod: {
		id: 'SpecialPeriod',
		text: 'Special Period',
		path: '/special-period',
		icon: 'Event',
	},
	Shift: {
		id: 'Shift',
		text: 'Shift',
		path: '/shift',
		icon: 'AccessTime',
	},
	RoleManagement: {
		id: 'RoleManagement',
		text: 'Roles',
		path: '/roles',
		icon: 'Badge',
	},
	LeaveManagement: {
		id: 'LeaveManagement',
		text: 'Leave Management',
		path: '/leave-management',
		icon: 'Event',
	},
	Attendance: {
		id: 'Attendance',
		text: 'Attendance',
		path: '/attendance',
		icon: 'Event',
	},
	EventLog: {
		id: 'EventLog',
		text: 'Event Log',
		path: '/event-log',
		icon: 'Description',
	},


	// Settings: {
	// 	id: 'Settings',
	// 	text: 'Settings',
	// 	path: 'settings',
	// 	icon: 'Settings',
	// 	subMenu: 
	// 	{
	// 		GeneralSettings: {
	// 			id: 'GeneralSettings',
	// 			path: 'settings/general-settings',
	// 			text: 'General settings',
	// 			icon: 'Settings',

	// 		},
	// 		Gates: {
	// 			id: 'Gates',
	// 			text: 'Gates',
	// 			path: 'settings/gates',
	// 			icon: 'GateIcon',
	// 		},
	// 		EditLog: {
	// 			id: 'EditLog',
	// 			path: 'settings/editlog',
	// 			text: 'Edit Log',
	// 			icon: 'Description',

	// 		},
	// 	}
			
		
	// },
	


	// userDashboard: {
	// 	id: 'userDashboard',
	// 	text: 'User Dashboard',
	// 	path: '/dashboard',
	// 	icon: 'Dashboard',
	// 	subMenu: null,
	// },

};




export const UserRoutes = {
	userDashboard: {
		id: 'userDashboard',
		text: 'Dashboard',
		path: '/dashboard',
		icon: 'Dashboard',
		subMenu: null,
	},
	LeaveManagement: {
		id: 'LeaveManagement',
		text: 'Leave Management',
		path: '/leave-management',
		icon: 'Event',
	},
	Attendance: {
		id: 'Attendance',
		text: 'Attendance',
		path: '/attendance',
		icon: 'AccessTime',
	},
	UserSchedule: {
		id: 'UserSchedule',
		text: 'Schedule',
		path: '/user/schedule',
		icon: 'PendingActions',
	},
};

export const SelfRoutes = UserRoutes;

/** HR console uses the same navigation as company admin (page access is still gated in contentRoutes). */
export const HRRoutes = CompanyAdminRoutes;

export const roleWiseRoutes: Record<string, any> = {
	Admin: CompanyAdminRoutes,
	HR: HRRoutes,
	user: UserRoutes,
};

	






export const pagesNotInSideBar = {
	VehicleDetails: {
		id: 'VehicleDetails',
		text: 'Vehicle Details',
		path: '/vehicles-details/:id',
		icon: '',
	},

	TenantDetails: {
		id: 'TenantDetails',
		text: 'Tenant Details',
		path: '/tenants-details/:id',
		icon: '',
	},
	UsertDetails: {
		id: 'UserDetails',
		text: 'User Details',
		path: '/user-details/:id',
		icon: '',
	},
	ScheduleTemplateDetail: {
		id: 'ScheduleTemplateDetail',
		text: 'Schedule details',
		path: '/schedule-details/:id',
		icon: '',
	},
	GroupTemplateDetail: {
		id: 'GroupTemplateDetail',
		text: 'Group details',
		path: '/group-details/:id',
		icon: '',
	},

	Profile: {
		id: 'Profile',
		text: 'Profile',
		path: 'profile',
		icon: 'Login',
	},
	login: {
		id: 'login',
		text: 'Login',
		path: 'login',
		icon: 'Login',
	},
	Contact: {
		id: 'Contact',
		text: 'Contact',
		path: '/contact',
		icon: '',
	},
	Register: {
		id: 'Register',
		text: 'Login',
		path: 'public/activation/:string',
		icon: 'Login',
	},
	ForgotPassword: {
		id: 'ForgotPassword',
		text: 'ForgotPassword',
		path: '/forgotpassword',
		icon: 'Login',
	},


	PrivacyPolicy: {
		id: 'Privacy Policy',
		text: 'Privacy Policy',
		path: 'public/privacypolicy',
		icon: 'Login',
	},
	TermsAndConditions: {
		id: 'Terms & Conditions',
		text: 'Terms & Conditions',
		path: 'public/termsofuse',
		icon: '',
	},
	
	

}