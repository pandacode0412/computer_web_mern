import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import 'react-tabs/style/react-tabs.css';
import UserAPI from '../../../API/UserAPI';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserCheckout from './components/UserCheckout';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../../../slice/userSlice';

export default function UserProfile(props) {
  const [userInfo, setUserInfo] = useState({});
  const [addUpdateNoti, setAddUpdateNoti] = useState({
    status: false,
    noti: '',
    type: '',
  });
  const navigate = useNavigate();
  const customerDataSession = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();

  const getUserData = async () => {
    try {
      const userRes = await UserAPI.getUserInfo(customerDataSession.ctm_id);
      if (userRes?.data?.success) {
        setUserInfo(userRes?.data?.payload);
      }
    } catch (error) {
      console.log('get user data error: ', error);
    }
  };

  const updateUserInfo = async () => {
    try {
      const userRes = await UserAPI.updateUserInfo({
        ...userInfo,
        id: customerDataSession.ctm_id,
      });

      if (userRes.data && userRes.data.success) {
        dispatch(
          setUserData({
            ...customerDataSession,
            ctm_usr: userInfo?.email,
            ctm_name: userInfo?.name,
            ctm_phone: userInfo?.phone_number,
          })
        );
        toast.success('Cập nhật thông tin thành công');
        setAddUpdateNoti({
          status: true,
          noti: 'Cập nhật thông tin thành công',
          type: 'success',
        });
      } else {
        toast.error(
          userRes?.data?.error?.message || 'Cập nhật thông tin thất bại'
        );
        setAddUpdateNoti({
          status: true,
          noti: userRes?.data?.error?.message || 'Cập nhật thông tin thất bại',
          type: 'error',
        });
      }

      setTimeout(() => {
        setAddUpdateNoti({ status: false, noti: '', type: '' });
      }, 3000);
    } catch (error) {
      console.log('update user data error: ', error);
    }
  };

  useEffect(() => {
    if (customerDataSession?.ctm_id) {
      getUserData();
    }else {
      const userId = window.sessionStorage.getItem('user_id');
      if (!userId){
        navigate('/login')
      }
    }
  }, [customerDataSession]);

  return (
    <div>
      <section className='inner_page_head'>
        <div className='container_fuild'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='full'>
                <h3>Trang thông tin</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Box
        sx={{
          paddingLeft: '50px',
          paddingRight: '50px',
          marginTop: '50px',
          marginBottom: '50px',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Stack
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Avatar />
              <TextField
                label='Tên'
                defaultValue=''
                id='contact-address'
                variant='filled'
                style={{ marginTop: '11px', width: '100%' }}
                sx={{
                  '.css-10botns-MuiInputBase-input-MuiFilledInput-input': {
                    marginTop: '12px',
                  },
                }}
                value={userInfo.name}
                onChange={(event) => {
                  setUserInfo({ ...userInfo, name: event.target.value });
                }}
              />

              <TextField
                label='Email'
                defaultValue=''
                id='contact-address'
                variant='filled'
                style={{ marginTop: 11, width: '100%' }}
                value={userInfo.email}
                sx={{
                  '.css-10botns-MuiInputBase-input-MuiFilledInput-input': {
                    marginTop: '12px',
                  },
                }}
                onChange={(event) => {
                  setUserInfo({ ...userInfo, email: event.target.value });
                }}
              />

              <TextField
                label='Địa chỉ'
                defaultValue=''
                id='contact-address'
                variant='filled'
                style={{ marginTop: 11, width: '100%' }}
                value={userInfo.address}
                sx={{
                  '.css-10botns-MuiInputBase-input-MuiFilledInput-input': {
                    marginTop: '12px',
                  },
                }}
                onChange={(event) => {
                  setUserInfo({ ...userInfo, address: event.target.value });
                }}
              />
              <TextField
                label='Số điện thoại'
                defaultValue=''
                id='contact-address'
                variant='filled'
                style={{ marginTop: 11, width: '100%' }}
                value={userInfo.phone_number}
                sx={{
                  '.css-10botns-MuiInputBase-input-MuiFilledInput-input': {
                    marginTop: '12px',
                  },
                }}
                onChange={(event) => {
                  setUserInfo({
                    ...userInfo,
                    phone_number: event.target.value,
                  });
                }}
              />

              {addUpdateNoti.status && (
                <Grid item xs={12}>
                  <Stack
                    spacing={2}
                    justifyContent='space-around'
                    flexDirection={'row'}
                  >
                    <Alert
                      severity={addUpdateNoti.type}
                      sx={{ marginTop: '10px' }}
                    >
                      {addUpdateNoti.noti}
                    </Alert>
                  </Stack>
                </Grid>
              )}

              <Box sx={{ marginTop: '30px' }}>
                <Button
                  variant='contained'
                  sx={{ color: 'white !important' }}
                  onClick={() => updateUserInfo()}
                >
                  Cập nhật
                </Button>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1}></Grid>
          <Grid item xs={12} sm={7}>
            <div>
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '24px',
                  marginBottom: '12px',
                }}
              >
                LỊCH SỬ ĐẶT HÀNG
              </div>
              <UserCheckout />
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
