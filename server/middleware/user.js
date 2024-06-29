const bcrypt = require('bcryptjs');
const SALT_ROUND = 10;
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const SECRET_TOKEN = process.env.SECRET_TOKEN || '';

module.exports = {
  userSignUp: async (name, email, phone_number, address, password, role) => {
    try {
      const checkUserFromCustomer = await User.findOne({
        email: email,
        isDelete: false,
      })
        .lean()
        .exec();

      if (!checkUserFromCustomer?.email) {
        const hashPassword = bcrypt.hashSync(password, SALT_ROUND);
        const token = jwt.sign(
          {
            name,
            email,
            phone_number,
            address,
            password: hashPassword,
          },
          SECRET_TOKEN
        );

        const insertAccount = await User.insertMany([
          {
            name,
            email,
            phone_number,
            address,
            password: hashPassword,
            role,
          },
        ]);

        if (insertAccount?.[0]?._id) {
          return {
            success: true,
            payload: {
              user: {
                ctm_tk: token,
                ctm_rl: 'c',
                ctm_id: insertAccount?._id,
                ctm_usr: name,
              },
            },
          };
        }
      } else {
        throw new Error('Email đã tồn tại');
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

  userLogin: async (userEmail, userPassword) => {
    try {
      const checkUserFromCustomer = await User.findOne({
        email: userEmail,
        isDelete: false,
      })
        .lean()
        .exec();

      if (checkUserFromCustomer?._id) {
        if (bcrypt.compareSync(userPassword, checkUserFromCustomer?.password)) {
          return {
            success: true,
            payload: {
              ctm_tk: checkUserFromCustomer?.token,
              ctm_rl: checkUserFromCustomer?.role,
              ctm_id: checkUserFromCustomer?._id,
              ctm_usr: userEmail,
              ctm_name: checkUserFromCustomer?.name,
              ctm_phone: checkUserFromCustomer?.phone_number,
            },
          };
        } else {
          throw new Error('Sai mật khẩu');
        }
      } else {
        throw new Error('Thông tin đăng nhập không chính xác');
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

  getAllUser: async (role) => {
    try {
      if (role) {
        const userRes = await User.find({ role: role, isDelete: false })
          .lean()
          .exec();

        return {
          success: true,
          payload: {
            user: userRes,
          },
        };
      } else {
        const userRes = await User.find({ isDelete: false }).lean().exec();

        return {
          success: true,
          payload: {
            user: userRes,
          },
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

  getUserById: async (userId) => {
    try {
      const userRes = await User.findOne({ _id: userId }).lean().exec();

      return {
        success: true,
        payload: userRes,
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
  updateUserInfo: async (userId, email, name, phone_number, address) => {
    try {
      const checkEmail = await User.findOne({ email: email, isDelete: false });

      if (!checkEmail?._id || (checkEmail?._id &&  checkEmail?._id !== userId)) {
        const updateRes = await User.findOneAndUpdate(
          { _id: userId },
          {
            email,
            name,
            phone_number,
            address,
          }
        );
        if (updateRes) {
          return {
            success: true,
          };
        } else {
          throw new Error('Can not update user info');
        }
      } else {
        throw new Error('Thông tin email đã tồn tại');
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
  deleteUserId: async (userId) => {
    try {
      const deleteProductReview = await User.findOneAndUpdate(
        { _id: userId },
        {
          isDelete: true,
        }
      );

      if (deleteProductReview) {
        return {
          success: true,
        };
      }
      throw new Error('Kiểm tra các thông tin ràng buộc khác của người dùng');
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
