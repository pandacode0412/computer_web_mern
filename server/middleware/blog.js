const Blog = require('../models/blog');

module.exports = {
  getAllPost: async (limit, offset, search) => {
    try {
      let getPost = null;
      const newSearch = search && search!== 'undefined' ? search : ''

      if (limit === 'undefined' && offset === 'undefined') {
        getPost = await Blog.find({
          blog_title: { $regex: new RegExp(newSearch.toLowerCase(), "i") },
          isDelete: false,
        })
          .lean()
          .exec();
      } else if (offset === 'undefined' && limit) {
        getPost = await Blog.find({
          blog_title: { $regex: new RegExp(newSearch.toLowerCase(), "i") },
          isDelete: false,
        })
          .skip(0)
          .limit(limit)
          .lean()
          .exec();
      } else {
        getPost = await Blog.find({
          blog_title: { $regex: new RegExp(newSearch.toLowerCase(), "i") },
          isDelete: false,
        })
          .skip(offset * limit)
          .limit(limit)
          .lean()
          .exec();

        const totalItem = await Blog.find({ isDelete: false }).lean().exec();

        return {
          success: true,
          payload: {
            post: getPost,
            totalItem: totalItem?.length,
          },
        };
      }

      if (getPost) {
        return {
          success: true,
          payload: getPost,
        };
      } else {
        throw new Error('Lấy thông tin bài viết thất bại');
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

  addNewPostData: async ({ title, desc, image }) => {
    try {
      const addRes = await Blog.insertMany([
        { blog_title: title, blog_desc: desc, blog_image: image },
      ]);

      if (addRes) {
        const getPost = await Blog.find({ isDelete: false }).lean().exec();

        return {
          success: true,
          payload: getPost,
        };
      } else {
        throw new Error('Thêm bài viết thất bại');
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

  deletePostData: async (postId) => {
    try {
      const deletePost = await Blog.findOneAndUpdate(
        { _id: postId },
        { isDelete: true }
      );

      if (deletePost) {
        return {
          success: true,
        };
      } else {
        throw new Error('Xoá bài viết thất bại');
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
  updatePostData: async (postId, title, desc, image) => {
    try {
      const updateRes = await Blog.findOneAndUpdate(
        { _id: postId },
        { blog_title: title, blog_desc: desc, blog_image: image }
      );

      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Cập nhật bài viết thất bại');
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
  getPostById: async (postId) => {
    try {
      const getPost = await Blog.findOne({_id: postId}).lean().exec();

      if (getPost) {
        return {
          success: true,
          payload: getPost,
        };
      } else {
        throw new Error('Lấy thông tin bài post thất bại');
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
