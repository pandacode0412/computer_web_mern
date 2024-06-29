const Product = require('../models/product');
const Stripe = require('stripe');
require('dotenv').config();
const stripe = new Stripe(process.env.STRIPE_KEY);
const ProductCart = require('../models/productCart');
const ProductCheckout = require('../models/productCheckout');
const ProductCheckoutDetail = require('../models/productCheckoutDetail');
const User = require('../models/user');

module.exports = {
  getAllProduct: async (
    limit,
    offset,
    categoryId,
    brandId,
    search,
    min,
    max
  ) => {
    try {
      let productRes = null;
      const query = {};

      if (
        min !== 'undefined' &&
        Number(min) !== -1 &&
        typeof min !== undefined
      ) {
        query.price = {
          $gte: Number(min),
        };
      }

      if (
        max !== 'undefined' &&
        Number(max) !== -1 &&
        typeof max !== undefined
      ) {
        query.price = {
          ...query.price,
          $lte: Number(max),
        };
      }

      if (
        typeof search !== undefined &&
        search !== null &&
        search !== 'undefined'
      ) {
        query.name = { $regex: new RegExp(search.toLowerCase(), "i") }
      }

      if (
        brandId !== 'undefined' &&
        Number(brandId) !== -1 &&
        typeof brandId !== undefined
      ) {
        query.brand_id = brandId;
      }

      if (
        categoryId !== 'undefined' &&
        Number(categoryId) !== -1 &&
        typeof categoryId !== undefined
      ) {
        query.category_id = categoryId;
      }

      if (limit === 'undefined' && offset === 'undefined') {
        productRes = await Product.find({ isDelete: false, ...query })
          .lean()
          .exec();
      } else if (offset === 'undefined' && limit) {
        productRes = await Product.find({ isDelete: false, ...query })
          .limit(Number(limit))
          .skip(0)
          .lean()
          .exec();
      } else {
        productRes = await Product.find({ isDelete: false, ...query })
          .limit(Number(limit))
          .skip(Number(offset) * Number(limit))
          .lean()
          .exec();

        const allItem = await Product.find({ isDelete: false }).lean().exec();

        return {
          success: true,
          payload: {
            product: productRes,
            totalItem: allItem?.length,
          },
        };
      }

      return {
        success: true,
        payload: {
          product: productRes,
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          message: err.message,
        },
      };
    }
  },

  getCheckoutByDate: async (fromDate, toDate) => {
    try {
      const query = {};
      if (fromDate.length) {
        query.createdAt = {
          $gte: new Date(fromDate),
        };
      }

      if (toDate.length) {
        query.createdAt = {
          ...query.createdAt,
          $lte: new Date(toDate),
        };
      }

      const bookingRes = await ProductCheckout.find({
        isDelete: false,
        ...query,
      })
        .lean()
        .exec();
      if (bookingRes) {
        return {
          success: true,
          payload: bookingRes,
        };
      }
    } catch (err) {
      return {
        success: false,
        error: {
          message: err.message,
        },
      };
    }
  },

  createNewProduct: async (
    name,
    description,
    image,
    price,
    sale_price,
    quanlity,
    brand_id,
    category_id,
    front_image,
    back_image
  ) => {
    try {
      const checkProduct = await Product.findOne({
        name,
        category_id,
        brand_id,
        isDelete: false,
      })
        .lean()
        .exec();

      if (!checkProduct?._id) {
        const insertProduct = await Product.insertMany([
          {
            name,
            description,
            image: [image, front_image, back_image],
            price,
            sale_price,
            quanlity,
            brand_id,
            category_id,
          },
        ]);

        if (insertProduct?.length) {
          return {
            success: true,
          };
        } else {
          throw new Error('Thêm mới sản phẩm thất bại');
        }
      } else {
        throw new Error('Sản phẩm đã tồn tại');
      }
    } catch (err) {
      return {
        success: false,
        error: {
          message: err.message,
        },
      };
    }
  },
  updateProduct: async (
    name,
    description,
    image,
    price,
    sale_price,
    quanlity,
    brand_id,
    category_id,
    product_id,
    front_image,
    back_image
  ) => {
    try {
      const updateRes = await Product.findOneAndUpdate(
        { _id: product_id },
        {
          name,
          description,
          image: [image, front_image, back_image],
          price,
          sale_price,
          quanlity,
          brand_id,
          category_id,
        }
      );

      if (updateRes?._id) {
        return {
          success: true,
        };
      } else {
        throw new Error('Cập nhật sản phẩm thất bại');
      }
    } catch (err) {
      return {
        success: false,
        error: {
          message: err.message,
        },
      };
    }
  },
  deleteProduct: async (product_id) => {
    try {
      const deleteRes = await Product.findOneAndUpdate(
        { _id: product_id },
        { isDelete: true }
      );
      if (deleteRes?._id) {
        return {
          success: true,
        };
      } else {
        throw new Error('Xoá sản phẩm thất bại');
      }
    } catch (err) {
      return {
        success: false,
        error: {
          message: err.message,
        },
      };
    }
  },

  getProductById: async (productId) => {
    try {
      const productRes = await Product.findOne({ _id: productId })
        .lean()
        .exec();

      if (productRes) {
        return {
          success: true,
          payload: productRes,
        };
      }
    } catch (err) {
      return {
        success: false,
        error: {
          message: err.message,
        },
      };
    }
  },

  addProductToCart: async (productId, userId, quanlity) => {
    try {
      const checkCartExist = await ProductCart.find({ user_id: userId })
        .lean()
        .exec();

      if (checkCartExist?.length > 0) {
        const checkProductExist = await ProductCart.find({
          user_id: userId,
          product_id: productId,
        })
          .lean()
          .exec();

        if (checkProductExist?.length) {
          const qly = checkProductExist?.[0]?.quanlity;
          const newQuality = Number(qly) + Number(quanlity);

          await ProductCart.findOneAndUpdate(
            { user_id: userId, product_id: productId },
            { quanlity: Number(newQuality) }
          );
        } else {
          await ProductCart.insertMany([
            { product_id: productId, user_id: userId, quanlity },
          ]);
        }
      } else {
        await ProductCart.insertMany([
          { product_id: productId, user_id: userId, quanlity },
        ]);
      }

      return {
        success: true,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          message: err.message,
        },
      };
    }
  },

  getUserCart: async (userId) => {
    try {
      console.log('userId >> ', userId);
      const getCartProduct = await ProductCart.aggregate([
        {
          $match: {
            $expr: {
              $eq: [{ $toString: '$user_id' }, userId],
            },
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'product_id',
            foreignField: '_id',
            as: 'product',
          },
        },
        {
          $unwind: '$product',
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'product.category_id',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $unwind: '$category',
        },
        {
          $lookup: {
            from: 'brands',
            localField: 'product.brand_id',
            foreignField: '_id',
            as: 'brand',
          },
        },
        {
          $unwind: '$category',
        },
        {
          $unwind: '$brand',
        },
        {
          $project: {
            product_id: 1,
            user_id: 1,
            quanlity: 1,
            createdAt: 1,
            category_name: '$category.name',
            brand_name: '$brand.name',
            product_name: '$product.name',
            image: '$product.image',
            price: '$product.price',
            sale_price: '$product.sale_price',
          },
        },
      ]);

      if (getCartProduct) {
        return {
          success: true,
          payload: getCartProduct,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  changeProductCartQuanlity: async (productId, userId, quanlity) => {
    try {
      const updateRes = await ProductCart.findOneAndUpdate(
        { product_id: productId, user_id: userId },
        { quanlity: Number(quanlity) }
      );
      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Cập nhật số lượng sản phẩm thành công');
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  deleteCartProduct: async (productId, userId) => {
    try {
      const deleteRes = await ProductCart.findOneAndDelete({
        product_id: productId,
        user_id: userId,
      });
      if (deleteRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Xoá sản phẩm thành công');
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  checkoutCart: async (
    total_price,
    user_id,
    list_product,
    paymentId,
    payment_method
  ) => {
    try {
      if (payment_method !== 'COD') {
        const payment = await stripe.paymentIntents.create({
          amount: total_price,
          currency: 'VND',
          description: 'Pay gear',
          payment_method: paymentId,
          confirm: true,
        });

        if (!payment) throw new Error('Thanh toán thất bại');
      }

      const userRes = await User.findOne({ _id: user_id });

      if (userRes?._id) {
        const { name, email, phone_number, address } = userRes;
        const insertCheckout = await ProductCheckout.insertMany([
          {
            total_price,
            user_id,
            user_name: name,
            user_address: address,
            user_phone: phone_number,
            user_email: email,
            status: 1,
            payment_methods: payment_method,
          },
        ]);

        if (insertCheckout?.length) {
          const checkout_id = insertCheckout?.[0]?._id;

          for (let i = 0; i < list_product?.length; i++) {
            const price =
              Number(list_product[i]?.price) ===
                Number(list_product[i]?.sale_price) ||
              list_product[i]?.sale_price <= 0
                ? Number(list_product[i]?.price)
                : Number(list_product[i]?.sale_price);

            const res = await ProductCheckoutDetail.insertMany([
              {
                checkout_id,
                product_id: list_product[i]?.product_id,
                product_name: list_product[i]?.product_name,
                proudct_brand: list_product[i]?.brand_name,
                product_category: list_product[i]?.category_name,
                product_price: price,
                product_quanlity: Number(list_product[i]?.quanlity),
                proudct_image: list_product[i]?.image?.[0] || '',
              },
            ]);

            if (res?.length) {
              await ProductCart.findOneAndDelete({
                product_id: list_product[i]?.product_id,
                user_id: user_id,
              });

              const curentProductQuantity = await Product.findOne(
                { _id: list_product[i]?.product_id },
                { quanlity: 1 }
              )
                .lean()
                .exec();

              if (curentProductQuantity?.quanlity) {
                await Product.findOneAndUpdate(
                  { _id: list_product[i]?.product_id },
                  {
                    quanlity:
                      curentProductQuantity?.quanlity -
                      Number(list_product[i]?.quanlity),
                  }
                );
              }
            }
          }
        }
        return {
          success: true,
        };
      } else {
        throw new Error('Khách hàng không tồn tại');
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  getAllCheckoutProduct: async () => {
    try {
      const productRes = await ProductCheckout.find().lean().exec();

      if (productRes) {
        return {
          success: true,
          payload: productRes,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  getCheckoutById: async (checkoutId) => {
    try {
      const checkoutRes = await ProductCheckout.aggregate([
        {
          $match: {
            $expr: {
              $eq: [{ $toString: '$_id' }, checkoutId],
            },
          },
        },
        {
          $lookup: {
            from: 'product-checkout-details',
            localField: '_id',
            foreignField: 'checkout_id',
            as: 'pcd',
          },
        },
        {
          $unwind: '$pcd',
        },
        {
          $project: {
            proudct_image: '$pcd.proudct_image',
            product_name: '$pcd.product_name',
            proudct_brand: '$pcd.proudct_brand',
            product_category: '$pcd.product_category',
            product_quanlity: '$pcd.product_quanlity',
            product_price: '$pcd.product_price',
            product_quanlity: '$pcd.product_quanlity',
          },
        },
      ]);

      if (checkoutRes) {
        return {
          success: true,
          payload: checkoutRes,
        };
      } else {
        throw new Error('get checkout product error >>>>> ', error);
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  deleteCheckoutProduct: async (checkoutId) => {
    try {
      const deleteCheckoutRes = await ProductCheckoutDetail.findOneAndDelete({
        checkout_id: checkoutId,
      });

      if (deleteCheckoutRes) {
        await ProductCheckout.findOneAndDelete({ _id: checkoutId });
      }
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  changeCheckoutStatus: async (checkoutId, status) => {
    try {
      if (Number(status) >= 0) {
        const updateRes = await ProductCheckout.findOneAndUpdate(
          { _id: checkoutId },
          { status }
        );
        if (updateRes) {
          return {
            success: true,
          };
        }
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },
  getCheckoutByUserId: async (userId) => {
    try {
      const checkoutRes = await ProductCheckout.find({ user_id: userId })
        .lean()
        .exec();
      if (checkoutRes) {
        return {
          success: true,
          payload: checkoutRes,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },
};
