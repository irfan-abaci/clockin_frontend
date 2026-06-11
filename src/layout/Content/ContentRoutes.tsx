import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute'; // Import ProtectedRoute
import ErrorPage from '../../pages/PublicPages/ErrorPage';
import Login from '../../pages/Auth/Login';
import Registration from '../../pages/Auth/Registration';
import ForgotPassword from '../../pages/Auth/ForgotPassword';
import AuthContext from '../../contexts/authContext';
import Unauthorized from '../../pages/PublicPages/Unauthorized';
import AbaciLoader from '../../components/AbaciLoader/AbaciLoader';
import RouteConfig from '../../routes/contentRoutes';
import { getEffectiveUserTypeForRoutes } from '../../helpers/roleToggleUtils';


const ContentRoutes = () => {
	const { userData } = useContext(AuthContext);
	const accountToggle = useSelector((state: any) => state.authSlice?.account_toggle_button);
	const mode = accountToggle || 'Admin';
	const effectiveUserType = getEffectiveUserTypeForRoutes(userData?.user_type, mode);

	const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
      if (userData !== null || window.location.pathname.startsWith('/public')) {
          setIsLoading(false);
      }
  }, [userData]);

  if (isLoading) {
    return <AbaciLoader />
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/public/activation/:string" element={<Registration />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/public/error" element={<ErrorPage />} />

      {/* Protected Routes */}
      {RouteConfig.map((page) => {
          if(page.allowedTo){
             if(page.allowedTo?.includes(effectiveUserType)){
              return <Route path={page.path} element={<ProtectedRoute element={page.element} />} key={page.path}/>
            }
              return <Route path={page.path} element={<Unauthorized />} key={page.path}/>
           }
              return <Route path={page.path} element={page.element} key={page.path} />
           })
         }


      <Route path="*" element={<Navigate to="/public/error" />} />
    </Routes>
  );
};

export default ContentRoutes;
