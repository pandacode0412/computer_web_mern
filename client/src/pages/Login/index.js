import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import "./style.css";
import UserAPI from "../../API/UserAPI";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingButton } from "@mui/lab";
import { useDispatch } from "react-redux";
import { setUserData } from "../../slice/userSlice";

const theme = createTheme();

export default function Login() {
  const [signUpNoti, setSignUpNoti] = useState({
    status: false,
    noti: "",
    type: "",
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const dispatch = useDispatch()

  const navigation = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSignUpNoti({
      status: false,
      noti: "",
      type: "",
    });

    const data = new FormData(event.currentTarget);
    const customerData = {
      email: data.get("email"),
      password: data.get("password"),
    };

    if (!customerData.email.length || !customerData.password.length) {
      setSignUpNoti({
        status: true,
        noti: "Các trường không được để trống",
        type: "error",
      });
    } else {
      setLoginLoading(true)
      const loginRes = await UserAPI.userLogin({
        email: customerData.email,
        password: customerData.password,
      });
      if (loginRes?.data && loginRes?.data?.success) {
        toast.success("Bạn đã đăng nhập thành công");

        if (loginRes?.data?.payload?.ctm_rl === '1') {
          window.sessionStorage.setItem(
            "user_id",
            loginRes?.data?.payload?.ctm_id
          );
          dispatch(setUserData(loginRes?.data?.payload))
          setTimeout(() => {
            navigation("/");
          }, 1500);
        } else {
          window.sessionStorage.setItem(
            "user_id",
            loginRes?.data?.payload?.ctm_id
          );
          dispatch(setUserData(loginRes?.data?.payload))
          setTimeout(() => {
            navigation("/admin");
          }, 1500);
        }
      } else {
        toast.error(loginRes?.data?.error?.message || "Bạn đăng nhập thất bại");
        setSignUpNoti({
          status: true,
          noti: loginRes?.data?.error?.message || "Bạn đăng nhập thất bại",
          type: "error",
        });
      }
      setLoginLoading(false);
    }
  };

  return (
    <div className='login-page'>
      <ThemeProvider theme={theme}>
        <Grid
          container
          component="main"
          sx={{
            height: "100vh",
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
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />{" "}
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
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{
                  m: 1,
                  bgcolor: "secondary.main",
                }}
              >
                <LockOutlinedIcon />
              </Avatar>{" "}
              <Typography
                component="h1"
                variant="h5"
                sx={{
                  fontSize: "18px",
                }}
              >
                Đăng nhập{" "}
              </Typography>{" "}
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{
                  mt: 1,
                  fontSize: "2em",
                  width: "100%",
                }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  sx={{
                    fontSize: "14px",
                  }}
                />{" "}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Mật khẩu"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                {signUpNoti.status && (
                  <Alert
                    severity={signUpNoti.type}
                    sx={{
                      marginTop: "10px",
                      width: "100%",
                      fontSize: "14px",
                    }}
                  >
                    {signUpNoti.noti}{" "}
                  </Alert>
                )}
                <LoadingButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    height: "40px",
                    fontSize: "14px",
                  }}
                  loading={loginLoading}
                >
                  Đăng nhập{" "}
                </LoadingButton>{" "}
                <Grid container>
                  <Grid item>
                    <Link
                      href="/signup"
                      variant="body2"
                      sx={{
                        fontSize: "14px",
                      }}
                    >
                      {" "}
                      {"Bạn chưa có tài khoản? Đăng ký"}{" "}
                    </Link>{" "}
                  </Grid>{" "}
                </Grid>{" "}
              </Box>{" "}
            </Box>{" "}
          </Grid>{" "}
        </Grid>{" "}
        
      </ThemeProvider>
    </div>
  );
}
