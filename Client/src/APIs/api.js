// import axios from 'axios'

// const app = axios.create({
// baseURL: "http://localhost:8080/auth"
//     baseURL: "http://localhost:8080/api/v1/"
// })

// export const googleAuth = (code) => {
//     app.get(`/google?code=${code}`)
// }

// const res = await axios.post("http://localhost:8080/api/v1/users/register", formData, {
//     headers: { "Content-Type": "application/json" },
// });


// const res = await axios.post("users/register", formData, {
//     headers: { "Content-Type": "application/json" },
// });

// export const post = async (route, formData, { headers }) => {
//     return await app.post(`${route}`, formData, { headers })
// try {
// } catch (error) {
//     console.log("Error from Axios file", error);
// }
// }

//  const res = await app.get(`/users/search?searchData=${searchData}`);
// export const get = async (route) => {
//     return await app.get(route)
// }


import axios from "axios";

const app = axios.create({
  baseURL: "http://localhost:8080/api/v1/",
  withCredentials: false, // ✅ allow cookies to be sent with every request
});

// Add token dynamically for every request
// Add Token Automatically
app.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token"); // correct key
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export const googleAuth = (code) => {
  app.get(`/google?code=${code}`);
};

export const post = async (route, formData = {}, options = {}) => {
  return await app.post(route, formData, {
    ...options,
    // withCredentials: true, // ✅ ensure cookies for POST
  });
};

export const get = async (route, options = {}) => {
  return await app.get(route, {
    ...options,
    // withCredentials: true, // ✅ ensure cookies for GET
  });
};

export const put = async (route, formData = {}, options = {}) => {
  return await app.put(route, formData, {
    ...options,
    // withCredentials: true,
  })
};

export const patch = async (route, options = {}) => {
  return await app.patch(route, {
    ...options,
    // withCredentials: true
  })
}

export const del = async (route, formData = {}) => {
  return await app.delete(route, formData, {
    // withCredentials: true
  })
}

export default app;
