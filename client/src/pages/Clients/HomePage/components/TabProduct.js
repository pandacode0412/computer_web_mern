import React, { useState, useEffect } from "react";
import ProductAPI from "../../../../API/Product";
import { FORMAT_NUMBER } from "../../../../untils/constants";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import "jquery-ui/ui/effects/effect-slide";
import {  toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function TabProduct(props) {
  const [listProduct, setListProduct] = useState([]);
  const { categorySelected } = props;
  const userData = useSelector((state) => state.user.userData);
  const navigate = useNavigate();

  const getNewProductByCategory = async (categoryId) => {
    const productRes = await ProductAPI.getAllProduct(
      12,
      0,
      categoryId,
      -1,
      ""
    );
    if (productRes?.data?.success)
      setListProduct(productRes?.data?.payload?.product);
  };

  useEffect(() => {
    if (categorySelected !== -1) getNewProductByCategory(categorySelected);
  }, [categorySelected]);

  const flyToCartEffect = (className) => {
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
    <div className="row">
      {listProduct?.map((productItem) => {
        return (
          <div
            className="col-sm-6 col-md-4 col-lg-4"
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
                        const addCartRes = await ProductAPI.addProductToCard(
                          productItem?._id,
                          userId,
                          1
                        );
                        if (addCartRes?.data?.success) {
                          flyToCartEffect(
                            `add_to_cart_button-${productItem?._id}`
                          );
                        } else {
                          toast.error("Thêm sản phẩm vào giỏ hàng thất bại");
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
                      navigate(`/product/${productItem?._id}`)
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
                  productItem?.sale_price !== productItem?.price && productItem?.sale_price > 0
                    ? {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
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
  );
}
