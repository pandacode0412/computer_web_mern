import React from 'react';
import { Navigate } from 'react-router-dom';
import PageAdminLayout from '../../layouts/AdminLayout';
import { useSelector } from 'react-redux';

const AdminPrivateRouter = (props) => {
  let customerData = useSelector((state) => state.user.userData);
  
  return customerData && customerData?.ctm_rl === '1' ? (
    <Navigate to='/' />
  ) : customerData && customerData.ctm_rl !== '1' ? (
    <PageAdminLayout {...props} />
  ) : (
    <Navigate to='/login' />
  );
};

export default AdminPrivateRouter;
