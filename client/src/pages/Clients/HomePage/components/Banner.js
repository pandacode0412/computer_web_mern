import React from "react";

export default function Banner() {
  return (
    <section className="slider_section ">
      <div className="slider_bg_box">
        <img src="images/banner.png" alt="" />
      </div>
      <div id="customCarousel1" className="carousel slide" data-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="container ">
              <div className="row">
                <div className="col-md-7 col-lg-6 ">
                  <div className="detail-box">
                    <h1>
                      <span>Khuyến mãi 20%</span>
                      <br />
                      Tất cả sản phẩm
                    </h1>
                    <p>
                      Tưng bừng chào hè cùng MOUSE CLICK SERVICE. Hãy đến với
                      cửa hàng chúng tôi, vô vàng khuyến mãi đang chào đón bạn
                    </p>
                    <div className="btn-box">
                      <a href="/product">
                        Mua ngay
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="carousel-item ">
            <div className="container ">
              <div className="row">
                <div className="col-md-7 col-lg-6 ">
                  <div className="detail-box">
                    <h1>
                      <span>Khuyến mãi 20%</span>
                      <br />
                      Tất cả sản phẩm
                    </h1>
                    <p>
                      Tưng bừng chào hè cùng MOUSE CLICK SERVICE. Hãy đến với
                      cửa hàng chúng tôi, vô vàng khuyến mãi đang chào đón bạn
                    </p>
                    <div className="btn-box">
                      <a href="/product">
                        Mua ngay
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="container ">
              <div className="row">
                <div className="col-md-7 col-lg-6 ">
                  <div className="detail-box">
                    <h1>
                      <span>Khuyến mãi 20%</span>
                      <br />
                      Tất cả sản phẩm
                    </h1>
                    <p>
                      Tưng bừng chào hè cùng MOUSE CLICK SERVICE. Hãy đến với
                      cửa hàng chúng tôi, vô vàng khuyến mãi đang chào đón bạn
                    </p>
                    <div className="btn-box">
                      <a href="/product">
                        Mua ngay
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <ol className="carousel-indicators">
            <li
              data-target="#customCarousel1"
              data-slide-to={0}
              className="active"
            />
            <li data-target="#customCarousel1" data-slide-to={1} />
            <li data-target="#customCarousel1" data-slide-to={2} />
          </ol>
        </div>
      </div>
    </section>
  );
}
