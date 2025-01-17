import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import { useLocation } from "react-router-dom";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import PostAddIcon from "@mui/icons-material/PostAdd";
import RateReviewIcon from '@mui/icons-material/RateReview';
import { useDispatch } from "react-redux";
import { setUserData } from "../slice/userSlice";
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

function AdminLayout(props) {
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const pathName = useLocation().pathname;
  const dispatch = useDispatch();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              TRANG QUẢN LÍ
            </Typography>
            <IconButton color="inherit">
              <LogoutIcon
                onClick={() => {
                  sessionStorage.clear();
                  dispatch(setUserData({}))
                  navigate("/login");
                }}
              />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List>
            <React.Fragment>
              <ListItemButton
                onClick={() => navigate("/admin")}
                sx={
                  pathName === "/admin" ? { background: "#b0b0b0" } : {}
                }
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Trang chủ" />
              </ListItemButton>

              <ListItemButton
                onClick={() => navigate("/admin/branch")}
                sx={
                  pathName === "/admin/branch" ? { background: "#b0b0b0" } : {}
                }
              >
                <ListItemIcon>
                  <BrandingWatermarkIcon />
                </ListItemIcon>
                <ListItemText primary="Thương hiệu" />
              </ListItemButton>

              <ListItemButton
                onClick={() => navigate("/admin/category")}
                sx={
                  pathName === "/admin/category"
                    ? { background: "#b0b0b0" }
                    : {}
                }
              >
                <ListItemIcon>
                  <AppRegistrationIcon />
                </ListItemIcon>
                <ListItemText primary="Danh mục" />
              </ListItemButton>

              <ListItemButton
                onClick={() => navigate("/admin/product")}
                sx={
                  pathName === "/admin/product" ? { background: "#b0b0b0" } : {}
                }
              >
                <ListItemIcon>
                  <CardGiftcardIcon />
                </ListItemIcon>
                <ListItemText primary="Sản phẩm" />
              </ListItemButton>

              <ListItemButton
                onClick={() => navigate("/admin/post")}
                sx={pathName === "/admin/post" ? { background: "#b0b0b0" } : {}}
              >
                <ListItemIcon>
                  <PostAddIcon />
                </ListItemIcon>
                <ListItemText primary="Bài viết" />
              </ListItemButton>

              <ListItemButton
                onClick={() => navigate("/admin/checkout")}
                sx={
                  pathName === "/admin/checkout"
                    ? { background: "#b0b0b0" }
                    : {}
                }
              >
                <ListItemIcon>
                  <ProductionQuantityLimitsIcon />
                </ListItemIcon>
                <ListItemText primary="Đơn đặt hàng" />
              </ListItemButton>

              <ListItemButton
                onClick={() => navigate("/admin/review")}
                sx={
                  pathName === "/admin/review"
                    ? { background: "#b0b0b0" }
                    : {}
                }
              >
                <ListItemIcon>
                  <RateReviewIcon />
                </ListItemIcon>
                <ListItemText primary="Đánh giá khách hàng" />
              </ListItemButton>

              <ListItemButton
                onClick={() => navigate("/admin/account")}
                sx={
                  pathName === "/admin/account" ? { background: "#b0b0b0" } : {}
                }
              >
                <ListItemIcon>
                  <ManageAccountsIcon />
                </ListItemIcon>
                <ListItemText primary="Tài khoản" />
              </ListItemButton>
            </React.Fragment>
          </List>
          <Divider />
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {props.children}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function PageAdminLayout(props) {
  return <AdminLayout {...props} />;
}
