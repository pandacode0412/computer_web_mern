import AxiosClient from "./AxiosClient";

const BrandAPI = {
  getAllBrand() {
    const url = `/brand`;
    return AxiosClient.get(url);
  },

  createNewBranch(brandData) {
    const url = `/brand`;
    return AxiosClient.post(url, { ...brandData });
  },

  updateBranchData(brandData, brandId) {
    const url = `/brand/${brandId}`;
    return AxiosClient.put(url, { ...brandData });
  },

  deleteBranch(brandId){
    const url = `/brand/${brandId}`;
    return AxiosClient.delete(url);
  }
};
export default BrandAPI;
