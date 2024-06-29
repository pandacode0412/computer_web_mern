import axios from 'axios';

export const AxiosClient = axios.create({
    baseURL: 'http://localhost:5005/api',
    headers: {
        'Content-Type': 'application/json',
    },
});
export default AxiosClient