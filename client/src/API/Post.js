import AxiosClient from "./AxiosClient"

const PostAPI = {
    getAll(limit,offset, search) {
        const url = `/post?limit=${limit}&offset=${offset}&search=${search}`;
        return AxiosClient.get(url);
    },

    getPostById(postId) {
        const url = `/post/${postId}`;
        return AxiosClient.get(url);
    },

    createNewPost({ title, desc, image }) {
        const url = `/post`;
        return AxiosClient.post(url, { title, desc, image });
    },

    deletePostData(postId) {
        const url = `/post/${postId}`;
        return AxiosClient.delete(url);
    },

    updatePostData({ id, title, desc, image }) {
        const url = `/post/${id}`;
        return AxiosClient.put(url, { title, desc, image });
    },
};
export default PostAPI;
