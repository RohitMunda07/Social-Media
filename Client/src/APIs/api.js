import axios from "axios";

const app = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false, // ✅ allow cookies to be sent with every request
});

console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

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
