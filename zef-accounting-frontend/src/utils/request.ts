import axios from "axios";
import { baseURL } from "./baseUrl";


const axiosRequest = axios.create({
  baseURL ,
  withCredentials : true,
})


export default axiosRequest;