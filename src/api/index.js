import axiosRoot from 'axios';
const baseURL = `${process.env.REACT_APP_API_URL}`;

export const axios = axiosRoot.create({
    baseURL: baseURL,
});