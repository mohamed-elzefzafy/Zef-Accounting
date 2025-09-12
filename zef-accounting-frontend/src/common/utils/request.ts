import axios from "axios";
import { API_URL, API_URL_FOR_STRIPE } from "../constants/api";
import { cookies } from "next/headers";

// 1️⃣ Public Axios instance for unprotected routes (e.g., login, register, etc.)
const request = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This can stay in case you need cookies in some public cases (e.g., CSRF)
});

// 2️⃣ Protected Axios instance for routes requiring authentication
const protectedRequest = axios.create({
  // baseURL: API_URL,
  //TODO:MAKE ONE BASE URL FOR ALL REQUESTS BEFORE DEPLOYMENT
  baseURL: API_URL_FOR_STRIPE,
  withCredentials: true, // Cookies are important here
});

// Attach token from cookies automatically for protected requests
protectedRequest.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  if (tokenCookie) {
    config.headers.Cookie = `${tokenCookie.name}=${tokenCookie.value}`;
  }

  return config;
});

export { request, protectedRequest };
