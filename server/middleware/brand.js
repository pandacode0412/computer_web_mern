const Brand = require('../models/brand');

module.exports = {
  getAllBrand: async () => {
    try {
      const brandRes = await Brand.find({ isDelete: false }).lean().exec();

      return {
        success: true,
        payload: brandRes?.length ? brandRes : [],
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

  createNewBrand: async (name, image, description) => {
    try {
      const checkBrand = await Brand.findOne({ name, isDelete: false }).lean().exec();

      if (!checkBrand?._id) {
        const insertAccount = await Brand.insertMany([
          { name, image, description },
        ]);

        if (insertAccount?.length) {
          return {
            success: true,
          };
        } else {
          throw new Error('Thêm mới thương hiệu thất bại');
        }
      } else {
        throw new Error('Thương hiệu đã tồn tại');
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

  updateBrand: async (name, image, description, brandId) => {
    try {
      const updateRes = await Brand.findOneAndUpdate({_id: brandId}, {
        name,
        image,
        description,
      });
      if (updateRes?._id) {
        return {
          success: true,
        };
      } else {
        throw new Error('Cập nhật thương hiệu thất bại');
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
  deleteBrand: async (brandId) => {
    try {
      const deleteRes = await Brand.findOneAndUpdate({_id: brandId}, {
        isDelete: true,
      });

      if (deleteRes?._id) {
        return {
          success: true,
        };
      } else {
        throw new Error('Xoá thương hiệu thất bại');
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
};
