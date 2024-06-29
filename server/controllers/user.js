const asyncHandler = require('express-async-handler');
const userMiddleware = require('../middleware/user');

module.exports = {
  userSignUp: asyncHandler(async (req, res) => {
    const { name, email, phone_number, address, password, role } = req?.body;
    const response = await userMiddleware.userSignUp(
      name,
      email,
      phone_number,
      address,
      password,
      role
    );
    res.json(response);
  }),

  userLogin: asyncHandler(async (req, res) => {
    const { email, password } = req?.body;
    const response = await userMiddleware.userLogin(email, password);
    res.json(response);
  }),

  getAllUser: asyncHandler(async (req, res) => {
    const { role } = req.query;
    const response = await userMiddleware.getAllUser(role);
    res.json(response);
  }),

  getUserById: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const results = await userMiddleware.getUserById(userId);
    res.json(results);
  }),

  updateUserInfo: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { email, name, phone_number, address } = req.body;
    const results = await userMiddleware.updateUserInfo(
      userId,
      email,
      name,
      phone_number,
      address
    );
    res.json(results);
  }),

  deleteUserId: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const results = await userMiddleware.deleteUserId(userId);
    res.json(results);
  }),
};
