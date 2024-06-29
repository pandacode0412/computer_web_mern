import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import ClientLayout from "../layouts/Client";
import Login from "../pages/Login";
import SignUp from "../pages/Register";
import ClientHomePage from '../pages/Clients/HomePage';
import ClientProduct from "../pages/Clients/Products";
import ProductDetail from '../pages/Clients/ProductDetail';
import AdminPrivateRouter from "./PrivateRouter/AdminPrivateRouter";
import DashboardContent from '../pages/Admins/Dashboard'
import AdminAccount from '../pages/Admins/Account';
import ProductBranch from "../pages/Admins/Branch";
import AdminProduct from "../pages/Admins/Product";
import ProductCategory from "../pages/Admins/Category";
import AdminBlog from "../pages/Admins/Post";
import PostPage from "../pages/Clients/Post";
import PostDetailPage from "../pages/Clients/PostDetail";
import AboutPage from "../pages/Clients/About";
import CheckoutCardPage from "../pages/Clients/CheckoutCard";
import AdminCheckout from "../pages/Admins/Checkout";
import UserProfile from "../pages/Clients/UserCheckoutHistory";
import AdminReview from "../pages/Admins/Review";

export default function MainRouter() {
  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/" element={<ClientHomePage />} />
        <Route exact path="/product" element={<ClientLayout><ClientProduct /></ClientLayout>} />
        <Route exact path="/post" element={<ClientLayout><PostPage /></ClientLayout>} />
        <Route exact path="/post/:postId" element={<ClientLayout><PostDetailPage /></ClientLayout>} />
        <Route exact path="/about" element={<ClientLayout><AboutPage /></ClientLayout>} />
        <Route exact path="/product/:productId" element={<ClientLayout><ProductDetail /></ClientLayout>} />
        <Route exact path="/cart" element={<ClientLayout><CheckoutCardPage /></ClientLayout>} />
        <Route exact path="/user-checkout-history" element={<ClientLayout><UserProfile /></ClientLayout>} />
        <Route exact path="/admin" element={<AdminPrivateRouter><DashboardContent /></AdminPrivateRouter>} />
        <Route exact path="/admin/account" element={<AdminPrivateRouter><AdminAccount /></AdminPrivateRouter>} />
        <Route exact path="/admin/branch" element={<AdminPrivateRouter><ProductBranch /></AdminPrivateRouter>} />
        <Route exact path="/admin/product" element={<AdminPrivateRouter><AdminProduct /></AdminPrivateRouter>} />
        <Route exact path="/admin/category" element={<AdminPrivateRouter><ProductCategory /></AdminPrivateRouter>} />
        <Route exact path="/admin/post" element={<AdminPrivateRouter><AdminBlog /></AdminPrivateRouter>} />
        <Route exact path="/admin/checkout" element={<AdminPrivateRouter><AdminCheckout /></AdminPrivateRouter>} />
        <Route exact path="/admin/review" element={<AdminPrivateRouter><AdminReview /></AdminPrivateRouter>} />
      </Routes>
    </Router>
  );
}
