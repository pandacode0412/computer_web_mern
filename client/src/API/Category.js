import AxiosClient from "./AxiosClient";

const CategoryAPI = {
  getAllCategory() {
    const url = `/category`;
    return AxiosClient.get(url);
  },

  createNewCategory(categoryData) {
    const url = `/category`;
    return AxiosClient.post(url, { ...categoryData });
  },

  updateCategoryData(categoryData, categoryId) {
    const url = `/category/${categoryId}`;
    return AxiosClient.put(url, { ...categoryData });
  },

  deleteCategory(categoryId){
    const url = `/category/${categoryId}`;
    return AxiosClient.delete(url);
  }
};
export default CategoryAPI;
