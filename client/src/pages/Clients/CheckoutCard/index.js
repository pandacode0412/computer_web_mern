import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductAPI from '../../../API/Product';
import { FORMAT_NUMBER } from '../../../untils/constants';
import CheckoutCardConfirmModal from './components/CheckoutCardComfirmModal';
import './style.scss';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentMethodModal from './components/PaymentMethodModal';
import { useSelector } from 'react-redux';

export default function CheckoutCardPage() {
  const [userCartProduct, setUserCartProduct] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [confirmModal, setConfirmModal] = useState(false);
  const [paymentMethodModal, setPaymentMethodModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const userData = useSelector((state) => state.user.userData);
  const navigate = useNavigate();

  const getUserCartProduct = async () => {
    if (userData) {
      const userId = userData?.ctm_id;
      const productRes = await ProductAPI.getUserCart(userId);

      if (productRes?.data?.success) {
        const cartProduct = productRes?.data?.payload;
        const cartAddTotalPrice = cartProduct?.map((productItem) => {
          const price =
            productItem?.price === productItem?.sale_price || (productItem?.sale_price <= 0)
              ? productItem?.price
              : productItem?.sale_price  ;
          const totalPrice = Number(productItem?.quanlity) * price;
          return {
            ...productItem,
            total_price: totalPrice,
          };
        });
        console.log('cartAddTotalPrice > ', cartAddTotalPrice);
        setUserCartProduct(cartAddTotalPrice);
      }
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    if(userData?.ctm_id){
      getUserCartProduct();
    }
  }, [userData?.ctm_id]);

  useEffect(() => {
    const sumTotal = (arr) =>
      userCartProduct.reduce((sum, { total_price }) => sum + total_price, 0);
    setTotalPrice(sumTotal);
  }, [userCartProduct]);

  const deleteCartProduct = async (productId) => {
    try {
      const userId = userData?.ctm_id;
      const deleteRes = await ProductAPI.deleteCartProduct(productId, userId);

      if (deleteRes?.data?.success) {
        getUserCartProduct();
        toast.success('Xoá sản phẩm thành công');
      } else {
        toast.error('Xoá sản phẩm thất bại');
      }
    } catch (error) {
      console.log('delete cart product error >>> ', error);
    }
  };

  const checkoutCart = async (id) => {
    try {
      const userId = userData?.ctm_id;
      const cardDate = {
        total_price: totalPrice,
        user_id: userId,
        list_product: userCartProduct,
        payment_method: paymentMethod,
      };

      const checkoutRes = await ProductAPI.checkoutCart(cardDate, id);

      if (checkoutRes?.data?.success) {
        setUserCartProduct([]);
        setTotalPrice(0);
        setConfirmModal(false);
        setPaymentMethodModal(false);
        toast.success('Bạn đã đặt hàng thành công');
      } else {
        toast.error(
          checkoutRes?.data?.error?.message || 'Bạn đã đặt hàng thất bại'
        );
      }
    } catch (error) {
      toast.error('Bạn đã đặt hàng thất bại');
    }
  };

  return (
    <div className='card-page-frame'>
      {/* inner page section */}
      <section className='inner_page_head'>
        <div className='container_fuild'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='full'>
                <h3>Trang giỏ hàng</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div
        className='shopping-cart'
        style={{ marginTop: '100px', marginBottom: '100px' }}
      >
        <div className='column-labels'>
          <label className='product-image'>Hình ảnh</label>
          <label className='product-details'>Sản phẩm</label>
          <label className='product-price'>Giá gốc</label>
          <label className='product-price'>Giá giảm</label>
          <label className='product-quantity'>Số lượng</label>
          <label className='product-removal'>Xoá</label>
          <label className='product-line-price'>Tổng</label>
        </div>
        {userCartProduct?.map((productItem, productIndex) => {
          return (
            <div className='product' key={`user-cart-product-${productIndex}`}>
              <div className='product-image'>
                <img src={productItem?.image?.[0]} />
              </div>
              <div className='product-details'>
                <div className='product-title'>{productItem?.product_name}</div>
              </div>
              <div className='product-price'>
                {FORMAT_NUMBER.format(productItem?.price)}VNĐ
              </div>
              <div className='product-price'>
                {FORMAT_NUMBER.format(productItem?.sale_price)}VNĐ
              </div>
              <div className='product-quantity'>
                <input
                  type='number'
                  value={productItem?.quanlity}
                  min={1}
                  onChange={async (event) => {
                    if (Number(event.target.value) >= 1) {
                      const productCart = [...userCartProduct];
                      const productIndex = [...productCart].findIndex(
                        (item) => item?.product_id === productItem?.product_id
                      );
                      if (productIndex !== -1) {
                        productCart[productIndex].quanlity = Number(
                          event.target.value
                        );
                        const price =
                          productCart[productIndex]?.price ===
                          productCart[productIndex]?.sale_price || (productCart[productIndex]?.sale_price <= 0)
                            ? productCart[productIndex]?.price
                            : productCart[productIndex]?.sale_price;

                        productCart[productIndex].total_price =
                          Number(event.target.value) * Number(price);
                      }
                      setUserCartProduct(productCart);
                      const userId = userData?.ctm_id;
                      const updateRes =
                        await ProductAPI.changeCartProductQuanlity(
                          productItem?.product_id,
                          userId,
                          event.target.value
                        );
                    } else {
                      toast.error('Số lương sản phẩm cần lớn hơn 1');
                    }
                  }}
                />
              </div>
              <div className='product-removal'>
                <button
                  className='remove-product'
                  onClick={() => {
                    deleteCartProduct(productItem?.product_id);
                  }}
                >
                  Xoá
                </button>
              </div>
              <div className='product-line-price'>
                {FORMAT_NUMBER.format(productItem?.total_price)} VNĐ
              </div>
            </div>
          );
        })}
        <div className='totals'>
          <div className='totals-item'>
            <label>Tổng sản phẩm</label>
            <div className='totals-value' id='cart-subtotal'>
              {FORMAT_NUMBER.format(totalPrice)} VNĐ
            </div>
          </div>
          <div className='totals-item'>
            <label>Phí vận chuyển</label>
            <div className='totals-value' id='cart-shipping'>
              {userCartProduct?.length
                ? totalPrice >= 250000
                  ? 0
                  : '25.000 VNĐ'
                : 0}
            </div>
          </div>
          <div className='totals-item totals-item-total'>
            <label>Tổng đơn hàng</label>
            <div className='totals-value' id='cart-total'>
              {userCartProduct?.length
                ? totalPrice >= 250000
                  ? FORMAT_NUMBER.format(totalPrice)
                  : FORMAT_NUMBER.format(totalPrice + 25000)
                : 0}{' '}
              VNĐ
            </div>
          </div>
        </div>
        <button
          className='checkout'
          onClick={() => setPaymentMethodModal(true)}
        >
          Đặt hàng
        </button>
      </div>
      {confirmModal && (
        <Elements stripe={stripePromise}>
          <CheckoutCardConfirmModal
            visible={confirmModal}
            onClose={() => {
              setPaymentMethod('COD');
              setConfirmModal(false);
            }}
            handleActive={async(id) => await checkoutCart(id)}
          />
        </Elements>
      )}

      {paymentMethodModal && (
        <PaymentMethodModal
          visible={paymentMethodModal}
          onClose={async () => {
            setPaymentMethod('COD');
            setPaymentMethodModal(false);
          }}
          savePaymentMethod={async (method) => {
            setPaymentMethod(method);
            if (method === 'COD') await checkoutCart();
            else {
              setPaymentMethodModal(false);
              setConfirmModal(true);
            }
          }}
        />
      )}
      
    </div>
  );
}

const stripePromise = loadStripe(
  'pk_test_51KHAdUKzeo9d90anKj4ocFehY0bDFuNR5REW9UZKQ3vKWpfXJgbr2P0odm9HugkcoVmfmF383bTkmZRQZvpp8wlv00PAvM4dYm'
);
