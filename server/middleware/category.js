const Category = require('../models/category');

module.exports = {
  getAllCategory: async () => {
    try {
      const categoryRes = await Category.find({ isDelete: false })
        .lean()
        .exec();

      return {
        success: true,
        payload: categoryRes,
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

  createNewCategory: async (name, description) => {
    try {
      const checkCategory = await Category.findOne({ name, isDelete: false }).lean().exec();

      if (!checkCategory?._id) {
        const insertCategory = await Category.insertMany([{name, description}]);
        if (insertCategory?.length) {
          return {
            success: true,
          };
        } else {
          throw new Error('Thêm mới danh mục thất bại');
        }
      } else {
        throw new Error('Danh mục đã tồn tại');
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

  updateCategory: async (name, description, categoryId) => {
    try {
      const updateRes = await Category.findOneAndUpdate(
        { _id: categoryId },
        { name, description }
      );

      if (updateRes?._id) {
        return {
          success: true,
        };
      } else {
        throw new Error('Cập nhật danh mục thất bại');
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
  deleteCategory: async (categoryId) => {
    try {
      const deleteRes = await Category.findOneAndUpdate(
        { _id: categoryId },
        { isDelete: true }
      );
      if (deleteRes?._id) {
        return {
          success: true,
        };
      } else {
        throw new Error('Xoá danh mục thất bại');
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
