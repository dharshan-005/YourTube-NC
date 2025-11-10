// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: process.env.BACKEND_URL,
// });

// export default axiosInstance;

import axios from "axios";
// console.log("Backend URL:", process.env.BACKEND_URL);
console.log("Backend URL:", 'http://localhost:5000');
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
});
export default axiosInstance;
