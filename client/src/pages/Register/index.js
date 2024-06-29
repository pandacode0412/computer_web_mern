import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import './style.css';
import UserAPI from '../../API/UserAPI';
import { useNavigate } from 'react-router-dom';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingButton } from '@mui/lab';

const theme = createTheme();

export default function SignUp() {
  const [signupNoti, setSignupNoti] = useState({
    status: false,
    noti: '',
    type: '',
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSignupNoti({
      status: false,
      noti: '',
      type: '',
    });

    const data = new FormData(event.currentTarget);
    const customerData = {
      name: data.get('name'),
      email: data.get('email'),
      phone: data.get('phone'),
      address: data.get('address'),
      password: data.get('password'),
      confirmPassword: data.get('confirmPassword'),
    };
    const { name, email, phone, address, password, confirmPassword } =
      customerData;
    if (
      !name.length ||
      !email.length ||
      !phone.length ||
      !address.length ||
      !password.length ||
      !confirmPassword.length
    ) {
      setSignupNoti({
        status: true,
        noti: 'Không thể thiếu thông tin',
        type: 'error',
      });
    } else if (
      !String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      setSignupNoti({
        status: true,
        noti: 'Email sai định dạng',
        type: 'error',
      });
    } else if (!/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(phone)) {
      setSignupNoti({
        status: true,
        noti: 'Số điện thoại sai định dạng',
        type: 'error',
      });
    } else if (password !== confirmPassword) {
      setSignupNoti({
        status: true,
        noti: 'Nhập lại mật khẩu không chính xác',
        type: 'error',
      });
    } else {
      setRegisterLoading(true);
      const signupRes = await UserAPI.userSignup({
        name,
        email,
        phone_number: phone,
        address,
        password,
        role: 1,
      });
      if (signupRes?.data?.success) {
        toast.success('Bạn đã đăng kí tài khoản thành công');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(
          signupRes?.data?.error?.message || 'Bạn đăng kí tài khoản thất bại'
        );
      }
      setRegisterLoading(false);
    }
  };
  return (
    <div className='register-page'>
      <ThemeProvider theme={theme}>
        <Grid
          container
          component='main'
          sx={{
            height: '100vh',
          }}
        >
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={6}
            sx={{
              backgroundImage: `url(/login-bg.png)`,
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) =>
                t.palette.mode === 'light'
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />{' '}
          <Grid
            item
            xs={12}
            sm={8}
            md={6}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar
                sx={{
                  m: 1,
                  bgcolor: 'secondary.main',
                }}
              >
                <LockOutlinedIcon />
              </Avatar>{' '}
              <Typography
                component='h1'
                variant='h5'
                sx={{
                  fontSize: '18px',
                }}
              >
                Đăng ký{' '}
              </Typography>{' '}
              <Box
                component='form'
                noValidate
                sx={{
                  mt: 1,
                  fontSize: '2em',
                  width: '100%',
                }}
                onSubmit={handleSubmit}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete='given-name'
                      name='name'
                      required
                      fullWidth
                      id='name'
                      label='Họ và tên'
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id='email'
                      label='Email'
                      name='email'
                      autoComplete='email'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id='phone'
                      label='Số điện thoại'
                      name='phone'
                      autoComplete='phone'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id='address'
                      label='Địa chỉ'
                      name='address'
                      autoComplete='address'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name='password'
                      label='Mật khẩu'
                      type='password'
                      id='password'
                      autoComplete='new-password'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name='confirmPassword'
                      label='Nhập lại mật khẩu'
                      type='password'
                      id='confirmPassword'
                      autoComplete='new-password'
                    />
                  </Grid>{' '}
                </Grid>
                {signupNoti?.status && (
                  <Alert
                    severity={signupNoti?.type}
                    sx={{ marginTop: '10px', fontSize: '14px' }}
                  >
                    {signupNoti.noti}
                  </Alert>
                )}
                <LoadingButton
                  type='submit'
                  fullWidth
                  variant='contained'
                  sx={{
                    mt: 3,
                    mb: 2,
                    height: '40px',
                    fontSize: '14px',
                  }}
                  loading={registerLoading}
                >
                  Đăng ký{' '}
                </LoadingButton>
                <Grid container justifyContent='flex-end'>
                  <Grid item>
                    <Link
                      href='/login'
                      variant='body2'
                      sx={{
                        fontSize: '14px',
                      }}
                    >
                      Bạn đã có tài khoản ? Đăng nhập{' '}
                    </Link>{' '}
                  </Grid>{' '}
                </Grid>{' '}
              </Box>{' '}
            </Box>{' '}
          </Grid>{' '}
          
        </Grid>{' '}
      </ThemeProvider>
    </div>
  );
}
