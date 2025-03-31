import axios from "axios";
import { store } from "../redux/store";
import { updateToken, updateTokenError } from "../redux/auth/slice";
import { BACKEND_HOST } from "./backend";

axios.defaults.baseURL = BACKEND_HOST + "/api/";
const refreshAxios = axios.create();
refreshAxios.defaults.baseURL = BACKEND_HOST + "/api/";

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (
      error.response &&
      error.response.status == 401 &&
      !error.config._retry
    ) {
      error.config._retry = true;
      const state = store.getState();

      const refreshToken = state.auth.refreshToken;

      if (!refreshToken) {
        //console.log("No refresh token available.");
        return Promise.reject(error);
      }

      try {
        const res = await refreshAxios.patch("/users/refresh", {
          refreshToken,
        });

        error.config.headers.Authorization = `Bearer ${res.data.token}`;

        store.dispatch(updateToken(res.data));

        return axios(error.config);
      } catch (error) {
        store.dispatch(updateTokenError());
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
