import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { selectRefreshToken } from "./selectors";
import { updateToken, updateTokenError } from "./slice";

//export const BACKEND_HOST = "https://projectpilotbackend.onrender.com";
export const BACKEND_HOST = "http://localhost:3000";
axios.defaults.baseURL = BACKEND_HOST + "/api/";

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (error.response && error.response.status === 401) {
      const state = store.getState(); 
      const refreshToken = state.auth.refreshToken; 

      if (!refreshToken) {
        return Promise.reject(error); 
      }

      try {
        const res = await axios.patch("/users/refresh", {
          refreshToken: refreshToken,
        });

        const { token } = res.data;

        localStorage.setItem("token", token);
        setAuthHeader(token);

        error.config.headers.Authorization = `Bearer ${token}`;
        return axios(error.config);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// add JWT
function setAuthHeader(token) {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
}

// remove JWT
function clearAuthHeader() {
  axios.defaults.headers.common.Authorization = "";
  //delete axios.defaults.headers.common.Authorization;?
}

// /*export const fixBackendPath = (path) => {
//   if (!path || path.startsWith('http')) return path;
//   else return BACKEND_HOST + path;
// };*/

export const add = createAsyncThunk(
  "auth/add",
  async (credentials, thunkAPI) => {
    try {
      const res = await axios.post("/users/add", credentials);
      // add token to the HTTP header
      //setAuthHeader(res.data.token);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const res = await axios.post("/users/login", credentials);
      const { token } = res.data;

      
      localStorage.setItem("token", token);

     
      setAuthHeader(token);

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await axios.get("/users/logout"); 
    localStorage.removeItem("token");
    clearAuthHeader();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const refresh = createAsyncThunk("auth/refresh", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const persistedToken = state.auth.token;

  if (persistedToken === null) {
    return thunkAPI.rejectWithValue("Unable to fetch user");
  }

  try {
    setAuthHeader(persistedToken);
    const res = await axios.get("/users/current");
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const editUser = createAsyncThunk(
  "auth/editUser",
  async (formData, thunkAPI) => {
    try {
      const res = await axios.patch("/users/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
