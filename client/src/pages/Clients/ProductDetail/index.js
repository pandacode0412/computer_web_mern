import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './style.scss';
import ProductAPI from '../../../API/Product';
import { FORMAT_NUMBER } from '../../../untils/constants';
import ProductDetailReview from './components/Review';
import 'jquery-ui/ui/effects/effect-slide';
import { toast } from 'react-toastify';
import { Markup } from 'interweave';
import { CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';

export default function ProductDetail() {
  const [productDetail, setProductDetail] = useState({});
  const [relativeProduct, setRelativeProduct] = useState([]);
  const [productQuanlity, setProductQuanlity] = useState(1);
  const [loadingAddToCart, setLoadingAddToCart] = useState(false);
  const [loadingBuyNow, setLoadingBuyNow] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);

  const getProductDetail = async () => {
    try {
      const detailRes = await ProductAPI.getProductById(params?.productId);
      if (detailRes?.data?.success) {
        setProductDetail(detailRes?.data?.payload);
      }
    } catch (error) {
      console.log('get product detail error: ', error);
    }
  };

  const getRelativeProduct = async () => {
    try {
      const productRes = await ProductAPI.getAllProduct(
        4,
        0,
        productDetail?.category_id,
        -1
      );
      if (productRes?.data?.success) {
        setRelativeProduct(productRes?.data?.payload?.product);
      }
    } catch (error) {
      console.log('get relative product error: ', error);
    }
  };

  useEffect(() => {
    getProductDetail();
  }, []);

  useEffect(() => {
    getRelativeProduct();
  }, [productDetail]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <section className='inner_page_head'>
        <div className='container_fuild'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='full'>
                <h3>Chi tiết sản phẩm</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className='col-lg-8 border p-3 main-section bg-white product-detail-frame'>
        <div className='row hedding m-0 pl-3 pt-0 pb-3'>Chi tiết sản phẩm</div>
        <div className='row m-0'>
          <div className='col-lg-4 left-side-product-box pb-3 single_product_image_background'>
            <img
              src={productDetail?.image?.[0]}
              className='border p-3'
              alt=''
              width={280}
              height={280}
            />
            {productDetail?.image?.[1] && (
              <img
                src={productDetail?.image?.[1]}
                className='border p-3'
                alt='Hình ảnh sản phẩm'
                width={280}
                height={280}
              />
            )}
            {productDetail?.image?.[2] && (
              <img
                src={productDetail?.image?.[2]}
                className='border p-3'
                alt='Hình ảnh sản phẩm'
                width={280}
                height={280}
              />
            )}
          </div>
          <div className='col-lg-8'>
            <div className='right-side-pro-detail border p-3 m-0'>
              <div className='row'>
                <div className='col-lg-12'>
                  <span>Tên sản phẩm</span>
                  <p
                    className='m-0 p-0'
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      marginTop: '15px',
                      marginBottom: '15px',
                    }}
                  >
                    {productDetail?.name}
                  </p>
                </div>

                <div
                  className='col-lg-12'
                  style={
                    productDetail?.sale_price !== productDetail?.price &&
                    productDetail?.sale_price > 0
                      ? {
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          margin: '15px 0',

                        }
                      : {
                          margin: '15px 0',
                        }
                  }
                >
                  {productDetail?.sale_price !== productDetail?.price &&
                    productDetail?.sale_price > 0 && (
                      <h6
                        style={{
                          textAlign: 'center',
                          color: 'red',
                          fontSize: '20px',
                        }}
                      >
                        {FORMAT_NUMBER.format(productDetail?.sale_price)} VNĐ
                      </h6>
                    )}
                  <h6
                    style={{
                      textAlign:
                        productDetail?.sale_price !== productDetail?.price &&
                        productDetail?.sale_price > 0
                          ? 'center'
                          : 'left',
                      fontSize: '20px',
                      textDecoration:
                        productDetail?.sale_price !== productDetail?.price &&
                        productDetail?.sale_price > 0
                          ? 'line-through'
                          : 'unset',
                    }}
                  >
                    {FORMAT_NUMBER.format(productDetail?.price)} VNĐ
                  </h6>
                </div>
                <div className='col-lg-12'>
                  <h6>Số lượng :</h6>
                  <input
                    type='number'
                    className='form-control text-center w-100'
                    value={productQuanlity}
                    min={1}
                    onChange={(event) => {
                      if (Number(event?.target?.value)) {
                        setProductQuanlity(event?.target?.value);
                      } else {
                        toast.error(
                          'Số lượng sản phẩm cần lớn hơn hoặc bằng 1'
                        );
                      }
                    }}
                  />
                </div>
                <div className='col-lg-12 mt-3'>
                  <div className='row'>
                    <div className='col-lg-6 pb-2'>
                      <div
                        className={`btn btn-danger w-100 add_to_cart_button-${
                          productDetail?._id || '1234567890'
                        }`}
                        style={{ color: 'white', cursor: 'pointer' }}
                        onClick={async () => {
                          if (userData) {
                            setLoadingAddToCart(true);
                            const userId = userData?.ctm_id;
                            const addCartRes =
                              await ProductAPI.addProductToCard(
                                productDetail?._id,
                                userId,
                                productQuanlity
                              );
                            if (addCartRes?.data?.success) {
                              toast.success('Thêm vào giỏ hàng thành công');
                            } else {
                              toast.error(
                                'Thêm sản phẩm vào giỏ hàng thất bại'
                              );
                            }
                            setLoadingAddToCart(false);
                          } else {
                            navigate('/login');
                          }
                        }}
                      >
                        {loadingAddToCart ? (
                          <CircularProgress
                            size={10}
                            style={{ color: 'white' }}
                          />
                        ) : (
                          ' Thêm vào giỏ hàng'
                        )}
                      </div>
                    </div>
                    <div className='col-lg-6'>
                      <a
                        className='btn btn-success w-100'
                        href
                        style={{ color: 'white', cursor: 'pointer' }}
                        onClick={async () => {
                          if (userData) {
                            setLoadingBuyNow(true);
                            const userId = userData?.ctm_id;
                            const addCartRes =
                              await ProductAPI.addProductToCard(
                                productDetail?._id,
                                userId,
                                productQuanlity
                              );
                            if (addCartRes?.data?.success) {
                              navigate(`/cart`);
                            } else {
                              toast.error(
                                'Thêm sản phẩm vào giỏ hàng thất bại'
                              );
                              setLoadingBuyNow(false);
                            }
                          } else {
                            navigate('/login');
                          }
                        }}
                      >
                        {loadingBuyNow ? (
                          <CircularProgress
                            size={10}
                            style={{ color: 'white' }}
                          />
                        ) : (
                          ' Mua ngay'
                        )}
                      </a>
                    </div>
                  </div>
                </div>
                <div className='col-lg-12 pt-2 product-detail-content'>
                  <h5>Chi tiết sản phẩm</h5>
                  <Markup content={productDetail?.description || ''} />
                  <hr className='m-0 pt-2 mt-2' />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-12 text-center pt-5'>
            <h4>Sản phẩm liên quan</h4>
          </div>
        </div>
        {relativeProduct?.length ? (
          <div className='row mt-3 p-0 text-center pro-box-section'>
            {relativeProduct
              ?.filter((item) => item?._id !== params?.productId)
              ?.map((productItem) => {
                return (
                  <div
                    className='col-lg-3 pb-2'
                    key={`relative-product-${productItem?._id}`}
                    onClick={() => {
                      navigate(`/product/${productItem?._id}`);
                      window.location.reload();
                    }}
                  >
                    <div className='pro-box border p-0 m-0'>
                      <img src={productItem?.image} />
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div style={{ textAlign: 'center' }} className='mt-2'>
            Không có sản phẩm phù hợp
          </div>
        )}
      </div>
      <div style={{ marginTop: '80px' }}>
        <ProductDetailReview />
      </div>
    </>
  );
}
