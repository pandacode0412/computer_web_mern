import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductAPI from "../../../API/Product";
import CustomPagination from "../../../components/CustomPagination";
import { FORMAT_NUMBER } from "../../../untils/constants";
import ProductFilter from "./components/Filter";
import $ from "jquery";
import "jquery-ui/ui/effects/effect-slide";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function ClientProduct() {
  const [categorySelected, setCategorySelected] = useState(-1);
  const [brandSelected, setBrandSelected] = useState(-1);
  const [listProduct, setListProduct] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [minPrice, setMinPrice] = useState(-1);
  const [maxPrice, setMaxPrice] = useState(-1);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);

  const getNewProductByFilter = async (categoryId, brandId, page, search, min, max) => {
    const productRes = await ProductAPI.getAllProduct(
      12,
      page - 1,
      categoryId,
      brandId,
      search,
      min,
      max
    );

    if (productRes?.data?.success) {
      setListProduct(productRes?.data?.payload?.product);
      const totalItem = productRes?.data?.payload?.totalItem;
      const totalPage = Math.ceil(Number(totalItem) / 12);
      setTotalPage(totalPage);
    }
  };

  useEffect(() => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    const category_id = params.category_id;
    const brand_id = params.brand_id;
    const search = params.search;
    const min = params.min;
    const max = params.max;

    if (category_id) setCategorySelected(category_id);
    if (brand_id) setBrandSelected(brand_id);
    if (search) setSearchText(search || "");
    if (min) setMinPrice(min || -1)
    if (max) setMaxPrice(max || -1)

    getNewProductByFilter(category_id || -1, brand_id || -1, 1, search || "", min || -1, max || -1);
  }, []);

  const productFlyEffect = (className) => {
    const cart = $(".shopping-cart");
    const imgtodrag = $("." + className)
      .parent(".options")
      .parent(".option_container")
      .parent(".box")
      .find(".img-box")
      .find("img")
      .eq(0);
    if (imgtodrag) {
      const imgclone = imgtodrag
        .clone()
        .offset({
          top: imgtodrag.offset().top,
          left: imgtodrag.offset().left,
        })
        .css({
          opacity: "0.5",
          position: "absolute",
          height: "150px",
          width: "150px",
          "z-index": "2000",
        })
        .appendTo($("body"))
        .animate(
          {
            top: cart.offset().top + 10,
            left: cart.offset().left + 10,
            width: 75,
            height: 75,
          },
          1000,
          "easeInOutExpo"
        );

      imgclone.animate({
        width: 0,
        height: 0,
      });
    }
  };

  return (
    <div className="product-page-frame">
      {/* inner page section */}
      <section className="inner_page_head">
        <div className="container_fuild">
          <div className="row">
            <div className="col-md-12">
              <div className="full">
                <h3>SẢN PHẨM CỦA CHÚNG TÔI</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* end inner page section */}
      {/* product section */}
      <section className="product_section layout_padding">
        <div className="container">
          <div className="heading_container heading_center">
            <h2>
              Tất cả <span> sản phẩm</span>
            </h2>
          </div>
          <div class="wrap home-searchbar">
            <div class="search">
              <input
                type="text"
                class="searchTerm"
                placeholder="Bạn muốn tìm kiếm sản phẩm gì"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
              <button
                type="submit"
                class="searchButton"
                onClick={() => {
                  const urlParams = new URLSearchParams(window.location.search);
                  urlParams.set("search", searchText);
                  window.location.search = urlParams;
                }}
              >
                <i class="fa fa-search"></i>
              </button>
            </div>
          </div>
          <ProductFilter />
          <div className="row">
            {listProduct?.map((productItem) => {
              return (
                <div
                  className="col-sm-6 col-md-4 col-lg-4 product-item"
                  key={`product-item-${productItem?._id}`}
                >
                  <div className="box">
                    <div className="option_container">
                      <div className="options">
                        <a
                          href
                          className={`option1 add_to_cart_button-${productItem?._id}`}
                          style={{ cursor: "pointer" }}
                          onClick={async () => {
                            if (userData) {
                              const userId = userData?.ctm_id;
                              const addCartRes =
                                await ProductAPI.addProductToCard(
                                  productItem?._id,
                                  userId,
                                  1
                                );
                              if (addCartRes?.data?.success) {
                                productFlyEffect(
                                  `add_to_cart_button-${productItem?._id}`
                                );
                              } else {
                                toast.error(
                                  "Thêm sản phẩm vào giỏ hàng thất bại"
                                );
                              }
                            } else {
                              navigate("/login");
                            }
                          }}
                        >
                          Thêm giỏ hàng
                        </a>
                        <a
                          href
                          className="option2"
                          onClick={() =>
                            navigate(`/product/${productItem._id}`)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          Chi tiết
                        </a>
                      </div>
                    </div>
                    <div className="img-box">
                      <img src={productItem?.image} alt="" />
                    </div>
                    <div className="detail-box">
                      <h5 style={{ textAlign: "center", width: "100%" }}>
                        {productItem?.name}
                      </h5>
                    </div>
                    <div
                      style={
                        productItem?.sale_price !== productItem?.price
                          ? {
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              textAlign: 'center'
                            }
                          : {}
                      }
                    >
                      {productItem?.sale_price !== productItem?.price && productItem?.sale_price > 0 && (
                        <h6 style={{ textAlign: "center", color: "red" }}>
                          {FORMAT_NUMBER.format(productItem?.sale_price)} VNĐ
                        </h6>
                      )}
                      <h6
                        style={{
                          textAlign: "center",
                          textDecoration:
                            productItem?.sale_price !== productItem?.price && productItem?.sale_price > 0
                              ? "line-through"
                              : "unset",
                          width: productItem?.sale_price !== productItem?.price && productItem?.sale_price > 0 ? '' : '100%'
                        }}
                      >
                        {FORMAT_NUMBER.format(productItem?.price)} VNĐ
                      </h6>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {totalPage > 0 && (
            <div className="pagination">
              <CustomPagination
                totalPage={totalPage}
                handlePageChange={(page) => {
                  getNewProductByFilter(categorySelected, brandSelected, page, searchText, minPrice, maxPrice);
                }}
              />
            </div>
          )}
        </div>
        
      </section>
    </div>
  );
}
