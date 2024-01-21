import axios from "axios";
import Cookies from "js-cookie";

export function buildAxios() {
  return axios.create({
    baseURL: "http://localhost:3001/api",
    headers: {
      Authorization: `Bearer ${Cookies.get("access_token")}`,
    },
  });
}
