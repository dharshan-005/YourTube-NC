// import axios from "axios";
// // console.log("Backend URL:", process.env.BACKEND_URL);
// console.log("Backend URL:", 'http://localhost:5000');
// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:5000',
// });
// export default axiosInstance;

// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
// });
// console.log("AXIOS BASE URL =", axiosInstance.defaults.baseURL);
// axiosInstance.interceptors.request.use((config) => {
//   const user = localStorage.getItem("user");
//   if (user) {
//     const parsedUser = JSON.parse(user);
//     if (parsedUser?.token) {
//       config.headers.Authorization = `Bearer ${parsedUser.token}`;
//     }
//   }
//   return config;
// });

// export default axiosInstance;

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

console.log("AXIOS BASE URL =", axiosInstance.defaults.baseURL);

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser?.token) {
        config.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    }
  }
  return config;
});

export default axiosInstance;
