import React from "react";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="full">
              <div className="logo_footer">
                <a href="/">
                  <img width={100} height={60} src="/images/web-logo.png" alt="#" />
                </a>
              </div>
              <div className="information_f">
                <p>
                  <strong>ĐỊA CHỈ:</strong> 168 Lê Văn Sỹ, P.12, Phú Nhuận, Hồ Chí Minh
                </p>
                <p>
                  <strong>SỐ ĐIỆN THOẠI:</strong> +84 987 654 3210
                </p>
                <p>
                  <strong>EMAIL:</strong> yourmain@gmail.com
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-6">
                    <div className="widget_menu">
                      <h3>Điều hướng</h3>
                      <ul>
                        <li>
                          <a href="/">Trang chủ</a>
                        </li>
                        <li>
                          <a href="/product">Sản phẩm</a>
                        </li>
                        <li>
                          <a href="/post">Bài viết</a>
                        </li>
                        <li>
                          <a href="/about">Giới thiệu</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="widget_menu">
                      <h3>Tài khoản</h3>
                      <ul>
                        <li>
                          <a href="/user-checkout-history">Tài khoản</a>
                        </li>
                        <li>
                          <a href="/cart">Giỏ hàng</a>
                        </li>
                        <li>
                          <a href="/login">Đăng nhập</a>
                        </li>
                        <li>
                          <a href="/signup">Đăng kí</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>      
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
