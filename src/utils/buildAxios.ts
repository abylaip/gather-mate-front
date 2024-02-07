import axios from "axios";
import Cookies from "js-cookie";

export function buildAxios() {
  return axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    headers: {
      Authorization: `Bearer ${Cookies.get("access_token")}`,
    },
  });
}
