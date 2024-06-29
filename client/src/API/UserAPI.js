import AxiosClient from './AxiosClient';

const UserAPI = {
  userSignup({ name, email, phone_number, address, password, role }) {
    const url = `/user/signup`;
    return AxiosClient.post(url, {
      name,
      email,
      phone_number,
      address,
      password,
      role,
    });
  },

  userLogin({ email, password }) {
    const url = `/user/login`;
    return AxiosClient.post(url, { email, password });
  },

  getAllUser(role) {
    const url = `/user/all?role=${role}`;
    return AxiosClient.get(url);
  },

  getUserInfo(userId) {
    const url = `/user/${userId}`;
    return AxiosClient.get(url);
  },

  updateUserInfo({ id, email, name, address, phone_number }) {
    const url = `/user/${id}`;
    return AxiosClient.put(url, { email, name, address, phone_number });
  },

  deleteUser(userId) {
    const url = `/user/${userId}`;
    return AxiosClient.delete(url);
  },
};
export default UserAPI;
