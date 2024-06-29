import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryAPI from "../../API/Category";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import { useSelector } from "react-redux";

export default function Header() {
  const [categoryOption, setCategoryOption] = useState([]);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);

  const getlistCategory = async () => {
    try {
      const branchRes = await CategoryAPI.getAllCategory();
      if (branchRes?.data?.success) {
        const payload = branchRes?.data?.payload;
        const option = payload?.map((item, index) => {
          return {
            label: item?.name,
            value: item?._id,
          };
        });
        option.unshift({
          label: "Tất cả",
          value: -1,
        });
        setCategoryOption(option);
      }
    } catch (error) {
      console.log("get list brand error >>> ", error);
    }
  };

  useEffect(() => {
    getlistCategory();
  }, []);

  return (
    <header className="header_section">
      <div className="container">
        <nav className="navbar navbar-expand-lg custom_nav-container ">
          <a className="navbar-brand" href="/">
            <img width={90} height={50} src="/images/web-logo.png" alt="#" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className> </span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav">
              <li className="nav-item active">
                <a
                  className="nav-link"
                  href="/"
                  style={
                    window.location.pathname === "/"
                      ? { color: "rgb(247,68,77)" }
                      : { color: "black" }
                  }
                >
                  Trang chủ
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  {" "}
                  <span
                    className="nav-label"
                    style={
                      window.location.pathname === "/product"
                        ? { color: "rgb(247,68,77)" }
                        : { color: "black" }
                    }
                  >
                    Sản phẩm{" "}
                    <span
                      className="caret"
                      style={
                        window.location.pathname === "/product"
                          ? { color: "rgb(247,68,77)" }
                          : { color: "black" }
                      }
                    />
                  </span>
                </a>
                <ul className="dropdown-menu">
                  {categoryOption.map((categoryItem) => {
                    return (
                      <li
                        onClick={() => {
                          navigate(
                            `/product?category_id=${categoryItem?.value}`
                          );
                          window.location.reload();
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <a>{categoryItem?.label}</a>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/post"
                  style={
                    window.location.pathname === "/post"
                      ? { color: "rgb(247,68,77)" }
                      : { color: "black" }
                  }
                >
                  Bài viết
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/about"
                  style={
                    window.location.pathname === "/about"
                      ? { color: "rgb(247,68,77)" }
                      : { color: "black" }
                  }
                >
                  Giới thiệu
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link shopping-cart" href="/cart">
                  <svg
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 456.029 456.029"
                    style={{ enableBackground: "new 0 0 456.029 456.029" }}
                    xmlSpace="preserve"
                  >
                    <g>
                      <g>
                        <path
                          d="M345.6,338.862c-29.184,0-53.248,23.552-53.248,53.248c0,29.184,23.552,53.248,53.248,53.248
                                          c29.184,0,53.248-23.552,53.248-53.248C398.336,362.926,374.784,338.862,345.6,338.862z"
                        />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path
                          d="M439.296,84.91c-1.024,0-2.56-0.512-4.096-0.512H112.64l-5.12-34.304C104.448,27.566,84.992,10.67,61.952,10.67H20.48
                                          C9.216,10.67,0,19.886,0,31.15c0,11.264,9.216,20.48,20.48,20.48h41.472c2.56,0,4.608,2.048,5.12,4.608l31.744,216.064
                                          c4.096,27.136,27.648,47.616,55.296,47.616h212.992c26.624,0,49.664-18.944,55.296-45.056l33.28-166.4
                                          C457.728,97.71,450.56,86.958,439.296,84.91z"
                        />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path
                          d="M215.04,389.55c-1.024-28.16-24.576-50.688-52.736-50.688c-29.696,1.536-52.224,26.112-51.2,55.296
                                          c1.024,28.16,24.064,50.688,52.224,50.688h1.024C193.536,443.31,216.576,418.734,215.04,389.55z"
                        />
                      </g>
                    </g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                  </svg>
                </a>
              </li>
              {!userData?.ctm_id && (
                <li
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  <button
                    className="btn  my-2 my-sm-0 nav_search-btn"
                    type="submit"
                  >
                    <LoginIcon />
                  </button>
                </li>
              )}

              {userData?.ctm_id && (
                <li
                  onClick={() => {
                    navigate("/user-checkout-history");
                  }}
                >
                  <button
                    className="btn  my-2 my-sm-0 nav_search-btn"
                    type="submit"
                  >
                    <AccountCircleIcon />
                  </button>
                </li>
              )}
              {userData?.ctm_id && (
                <li
                  onClick={() => {
                    sessionStorage.clear();
                    navigate("/");
                    window.location.reload();
                  }}
                >
                  <button
                    className="btn  my-2 my-sm-0 nav_search-btn"
                    type="submit"
                  >
                    <LogoutIcon />
                  </button>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
