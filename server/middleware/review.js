const Review = require('../models/productReview');

module.exports = {
  getReviewByProductId: async (productId, limit, page) => {
    try {
      const reviewRes = await Review.aggregate([
        {
          $match: {
            isDelete: false,
            $expr: {
              $eq: [{ $toString: '$product_id' }, productId],
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $skip: Number(page * limit),
        },
        {
          $limit: Number(limit),
        },
        {
          $project: {
            createdAt: 1,
            isDelete: 1,
            product_id: 1,
            review: 1,
            status: 1,
            user_id: 1,
            _id: 1,
            name: '$user.name',
          },
        },
      ]);

      if (reviewRes) {
        const allItem = await Review.find({ isDelete: false }).lean().exec();
        return {
          success: true,
          payload: {
            review: reviewRes,
            totalItem: allItem?.length,
          },
        };
      } else {
        throw new Error('Lấy thông tin review thất bại');
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

  createNewReview: async ({ user_id, review, product_id }) => {
    try {
      const reviewRes = await Review.insertMany([
        { user_id, review, product_id, status: true },
      ]);

      if (reviewRes?.length) {
        return {
          success: true,
        };
      } else {
        throw new Error('Thêm mới review thất bại');
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

  getAllReview: async () => {
    try {
      const reviewRes = await Review.aggregate([
        {
          $match: {
            isDelete: false,
          },
        },
        {
          $group: {
            _id: '$product_id',
            total_reviews: { $sum: 1 },
            total_users: {
              $sum: {
                $cond: [{ $isArray: '$user_id' }, { $size: '$user_id' }, 1],
              },
            },
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product',
          },
        },
        {
          $unwind: '$product',
        },
        {
          $project: {
            createdAt: 1,
            product_id: '$_id',
            _id: 1,
            product_image: '$product.image',
            product_name: '$product.name',
            number_of_user: '$total_users',
          },
        },
      ]);

      if (reviewRes) {
        const resRow = reviewRes?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.product_id === value.product_id)
        );
        return {
          success: true,
          payload: resRow,
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
  changeReviewStatus: async (reviewId, status) => {
    try {
      const updateRes = await Review.findOneAndUpdate(
        { _id: reviewId },
        { status }
      )
        .lean()
        .exec();
      if (updateRes) return { success: true };
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
